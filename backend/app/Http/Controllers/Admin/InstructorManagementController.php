<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InstructorManagementController extends Controller
{
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
        $instructors = $query->withCount(['courses', 'blogs'])->paginate(15);

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

    /**
     * Delete an instructor and all associated content.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function deleteInstructor($id)
    {
        $instructor = Instructor::findOrFail($id);
        
        // Delete associated courses and blogs
        $instructor->courses()->delete();
        $instructor->blogs()->delete();
        
        // Delete the instructor
        $instructor->delete();

        return response()->json([
            'message' => 'Instructor and all associated content have been deleted successfully'
        ]);
    }
} 