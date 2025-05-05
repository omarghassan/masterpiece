<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\SubscriptionType;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SubscriptionManagementController extends Controller
{
    /**
     * Display a listing of all subscription types.
     *
     * @return \Illuminate\Http\Response
     */
    public function listSubscriptionTypes()
    {
        $subscriptionTypes = SubscriptionType::withCount('subscriptions')
                                           ->orderBy('price', 'asc')
                                           ->get();

        return response()->json($subscriptionTypes);
    }

    /**
     * Store a newly created subscription type.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeSubscriptionType(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:subscription_types',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'duration' => 'required|integer|min:1',
            'features' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $subscriptionTypeData = $validator->validated();
        $subscriptionTypeData['is_active'] = $subscriptionTypeData['is_active'] ?? true;

        $subscriptionType = SubscriptionType::create($subscriptionTypeData);

        return response()->json([
            'message' => 'Subscription type created successfully',
            'subscription_type' => $subscriptionType
        ], 201);
    }

    /**
     * Update the specified subscription type.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updateSubscriptionType(Request $request, $id)
    {
        $subscriptionType = SubscriptionType::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255|unique:subscription_types,name,' . $id,
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'duration_in_days' => 'sometimes|required|integer|min:1',
            'features' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $subscriptionType->update($validator->validated());

        return response()->json([
            'message' => 'Subscription type updated successfully',
            'subscription_type' => $subscriptionType
        ]);
    }

    /**
     * Toggle subscription type active status.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function toggleSubscriptionTypeStatus($id)
    {
        $subscriptionType = SubscriptionType::findOrFail($id);
        $subscriptionType->is_active = !$subscriptionType->is_active;
        $subscriptionType->save();

        $status = $subscriptionType->is_active ? 'activated' : 'deactivated';

        return response()->json([
            'message' => "Subscription type has been {$status} successfully",
            'subscription_type' => $subscriptionType
        ]);
    }

    /**
     * Display a listing of all active subscriptions with filters.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function listSubscriptions(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'nullable|string|in:active,expired,all',
            'subscription_type' => 'nullable|integer|exists:subscription_types,id',
            'search' => 'nullable|string',
            'sort_by' => 'nullable|string|in:start_date,end_date,price',
            'sort_dir' => 'nullable|string|in:asc,desc',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $query = Subscription::with(['user:id,name,email', 'subscriptionType:id,name,price']);

        // Apply status filter
        if ($request->has('status') && $request->status !== 'all') {
            if ($request->status === 'active') {
                $query->where('end_date', '>=', now());
            } else {
                $query->where('end_date', '<', now());
            }
        }

        // Apply subscription type filter
        if ($request->has('subscription_type') && !empty($request->subscription_type)) {
            $query->where('subscription_type_id', $request->subscription_type);
        }

        // Apply search filter (searches user name or email)
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        // Apply sorting
        $sortBy = $request->sort_by ?? 'start_date';
        $sortDir = $request->sort_dir ?? 'desc';
        $query->orderBy($sortBy, $sortDir);

        // Get paginated results
        $subscriptions = $query->paginate(15);

        return response()->json($subscriptions);
    }

    /**
     * Get subscription revenue statistics.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getRevenueStats(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'period' => 'nullable|string|in:daily,weekly,monthly,yearly',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Set default period to monthly if not specified
        $period = $request->period ?? 'monthly';

        // Set default date range if not specified
        $endDate = $request->end_date ? Carbon::parse($request->end_date) : Carbon::now();
        
        $startDate = null;
        if ($request->start_date) {
            $startDate = Carbon::parse($request->start_date);
        } else {
            // Default start date based on period
            switch ($period) {
                case 'daily':
                    $startDate = Carbon::now()->subDays(30);
                    break;
                case 'weekly':
                    $startDate = Carbon::now()->subWeeks(12);
                    break;
                case 'monthly':
                    $startDate = Carbon::now()->subMonths(12);
                    break;
                case 'yearly':
                    $startDate = Carbon::now()->subYears(5);
                    break;
            }
        }

        // Format for SQL based on period
        $dateFormat = '%Y-%m-%d'; // daily
        $groupBy = 'date';
        
        switch ($period) {
            case 'weekly':
                $dateFormat = '%Y-%u'; // Year and week number
                $groupBy = 'week';
                break;
            case 'monthly':
                $dateFormat = '%Y-%m'; // Year and month
                $groupBy = 'month';
                break;
            case 'yearly':
                $dateFormat = '%Y'; // Year
                $groupBy = 'year';
                break;
        }

        // Get revenue data
        $revenueData = Subscription::join('subscription_types', 'subscriptions.subscription_type_id', '=', 'subscription_types.id')
            ->whereBetween('subscriptions.start_date', [$startDate, $endDate])
            ->select(
                DB::raw("DATE_FORMAT(subscriptions.start_date, '{$dateFormat}') as {$groupBy}"),
                DB::raw('SUM(subscription_types.price) as revenue'),
                DB::raw('COUNT(*) as subscription_count')
            )
            ->groupBy($groupBy)
            ->orderBy($groupBy)
            ->get();

        // Get total statistics
        $totalStats = [
            'total_revenue' => Subscription::join('subscription_types', 'subscriptions.subscription_type_id', '=', 'subscription_types.id')
                ->whereBetween('subscriptions.start_date', [$startDate, $endDate])
                ->sum('subscription_types.price'),
            'total_subscriptions' => Subscription::whereBetween('start_date', [$startDate, $endDate])->count(),
            'active_subscriptions' => Subscription::where('end_date', '>=', now())->count(),
            'subscription_types' => SubscriptionType::withCount(['subscriptions' => function($query) use ($startDate, $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate]);
            }])
            ->select('id', 'name', 'price')
            ->get()
            ->map(function ($type) {
                return [
                    'id' => $type->id,
                    'name' => $type->name,
                    'price' => $type->price,
                    'subscription_count' => $type->subscriptions_count,
                    'revenue' => $type->price * $type->subscriptions_count
                ];
            })
        ];

        return response()->json([
            'period' => $period,
            'start_date' => $startDate->toDateString(),
            'end_date' => $endDate->toDateString(),
            'revenue_data' => $revenueData,
            'stats' => $totalStats
        ]);
    }
} 