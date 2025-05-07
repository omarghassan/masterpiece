<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Instructor;
use App\Models\Course;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class UserManagementController extends Controller
{
    /**
     * Display a listing of all users with pagination and optional filters.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function listUsers(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'search' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:active,inactive,all',
            'subscription' => 'nullable|string|in:free,paid,all',
            'sort_by' => 'nullable|string|in:name,email,created_at',
            'sort_dir' => 'nullable|string|in:asc,desc',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $query = User::query();

        // Apply search filter
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%");
            });
        }

        // Apply subscription filter
        if ($request->has('subscription') && $request->subscription !== 'all') {
            if ($request->subscription === 'paid') {
                $query->whereHas('subscriptions', function($q) {
                    $q->where('end_date', '>=', now());
                });
            } else {
                $query->whereDoesntHave('subscriptions', function($q) {
                    $q->where('end_date', '>=', now());
                });
            }
        }

        // Apply sorting
        $sortBy = $request->sort_by ?? 'created_at';
        $sortDir = $request->sort_dir ?? 'desc';
        $query->orderBy($sortBy, $sortDir);

        // Get paginated results
        $users = $query->withCount(['subscriptions', 'progress'])->paginate(15);

        return response()->json($users);
    }

    /**
     * Display detailed information about a specific user including subscriptions and progress.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getUserDetails($id)
    {
        $user = User::with(['subscriptions.subscriptionType', 'progress.lesson.module.course'])
                    ->findOrFail($id);

        return response()->json($user);
    }

    /**
     * Toggle user account status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function toggleUserStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'is_active' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::findOrFail($id);
        $user->is_active = $request->is_active;
        $user->save();

        $status = $user->is_active ? 'activated' : 'deactivated';

        return response()->json([
            'message' => "User account has been {$status} successfully",
            'user' => $user
        ]);
    }

    /**
     * Delete a user and all associated data.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        
        // Delete associated subscriptions
        $user->subscriptions()->delete();
        
        // Delete associated progress
        $user->progress()->delete();
        
        // Delete the user
        $user->delete();

        return response()->json([
            'message' => 'User and all associated data have been deleted successfully'
        ]);
    }

    /**
     * Display a listing of all instructors with pagination and filters.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function listInstructors(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'search' => 'nullable|string|max:255',
            'verification' => 'nullable|string|in:verified,unverified,all',
            'sort_by' => 'nullable|string|in:name,email,created_at',
            'sort_dir' => 'nullable|string|in:asc,desc',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $query = Instructor::query();

        // Apply search filter
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('email', 'LIKE', "%{$search}%")
                  ->orWhere('expertise', 'LIKE', "%{$search}%");
            });
        }

        // Apply verification filter
        if ($request->has('verification') && $request->verification !== 'all') {
            $isVerified = $request->verification === 'verified';
            $query->where('is_verified', $isVerified);
        }

        // Apply sorting
        $sortBy = $request->sort_by ?? 'created_at';
        $sortDir = $request->sort_dir ?? 'desc';
        $query->orderBy($sortBy, $sortDir);

        // Get paginated results with course count
        $instructors = $query->withCount('courses')->paginate(15);

        return response()->json($instructors);
    }

    /**
     * Display detailed information about a specific instructor including courses and blogs.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getInstructorDetails($id)
    {
        $instructor = Instructor::with(['courses', 'blogs'])
                               ->withCount(['courses', 'blogs'])
                               ->findOrFail($id);

        return response()->json($instructor);
    }

    /**
     * Toggle instructor verification status.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function toggleInstructorVerification($id)
    {
        $instructor = Instructor::findOrFail($id);
        $instructor->is_verified = !$instructor->is_verified;
        $instructor->save();

        $status = $instructor->is_verified ? 'verified' : 'unverified';

        return response()->json([
            'message' => "Instructor has been {$status} successfully",
            'instructor' => $instructor
        ]);
    }
} 