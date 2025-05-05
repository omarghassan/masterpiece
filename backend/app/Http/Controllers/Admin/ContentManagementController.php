<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Blog;
use App\Models\Module;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContentManagementController extends Controller
{
    /**
     * Display a listing of all courses with pagination and filters.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function listCourses(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'search' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:published,unpublished,all',
            'instructor' => 'nullable|integer|exists:instructors,id',
            'level' => 'nullable|string|in:beginner,intermediate,advanced,all',
            'sort_by' => 'nullable|string|in:title,created_at,instructor_name',
            'sort_dir' => 'nullable|string|in:asc,desc',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $query = Course::with('instructor:id,name');

        // Apply search filter
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%");
            });
        }

        // Apply publication status filter
        if ($request->has('status') && $request->status !== 'all') {
            $isPublished = $request->status === 'published';
            $query->where('is_published', $isPublished);
        }

        // Apply instructor filter
        if ($request->has('instructor') && !empty($request->instructor)) {
            $query->where('instructor_id', $request->instructor);
        }

        // Apply level filter
        if ($request->has('level') && $request->level !== 'all') {
            $query->where('level', $request->level);
        }

        // Apply sorting
        $sortBy = $request->sort_by ?? 'created_at';
        $sortDir = $request->sort_dir ?? 'desc';
        
        if ($sortBy === 'instructor_name') {
            $query->join('instructors', 'courses.instructor_id', '=', 'instructors.id')
                  ->orderBy('instructors.name', $sortDir)
                  ->select('courses.*');
        } else {
            $query->orderBy($sortBy, $sortDir);
        }

        // Get paginated results with modules count
        $courses = $query->withCount('modules')->paginate(15);

        return response()->json($courses);
    }

    /**
     * Display detailed information about a specific course including modules and lessons.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getCourseDetails($id)
    {
        $course = Course::with(['instructor', 'modules.lessons'])
                       ->withCount(['modules', 'lessons'])
                       ->findOrFail($id);

        return response()->json($course);
    }

    /**
     * Toggle course publication status.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function toggleCoursePublicationStatus($id)
    {
        $course = Course::findOrFail($id);
        $course->is_published = !$course->is_published;
        $course->save();

        $status = $course->is_published ? 'published' : 'unpublished';

        return response()->json([
            'message' => "Course has been {$status} successfully",
            'course' => $course
        ]);
    }

    /**
     * Display a listing of all blogs with pagination and filters.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function listBlogs(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'search' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:published,scheduled,all',
            'instructor' => 'nullable|integer|exists:instructors,id',
            'sort_by' => 'nullable|string|in:title,created_at,published_at,instructor_name',
            'sort_dir' => 'nullable|string|in:asc,desc',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $query = Blog::with('instructor:id,name');

        // Apply search filter
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('content', 'LIKE', "%{$search}%");
            });
        }

        // Apply publication status filter
        if ($request->has('status') && $request->status !== 'all') {
            if ($request->status === 'published') {
                $query->where('published_at', '<=', now());
            } else if ($request->status === 'scheduled') {
                $query->where('published_at', '>', now());
            }
        }

        // Apply instructor filter
        if ($request->has('instructor') && !empty($request->instructor)) {
            $query->where('instructor_id', $request->instructor);
        }

        // Apply sorting
        $sortBy = $request->sort_by ?? 'created_at';
        $sortDir = $request->sort_dir ?? 'desc';
        
        if ($sortBy === 'instructor_name') {
            $query->join('instructors', 'blogs.instructor_id', '=', 'instructors.id')
                  ->orderBy('instructors.name', $sortDir)
                  ->select('blogs.*');
        } else {
            $query->orderBy($sortBy, $sortDir);
        }

        // Get paginated results
        $blogs = $query->paginate(15);

        return response()->json($blogs);
    }

    /**
     * Display detailed information about a specific blog.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getBlogDetails($id)
    {
        $blog = Blog::with('instructor')->findOrFail($id);

        return response()->json($blog);
    }

    /**
     * Delete a blog post.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function deleteBlog($id)
    {
        $blog = Blog::findOrFail($id);
        $blog->delete();

        return response()->json([
            'message' => 'Blog post deleted successfully'
        ]);
    }

    /**
     * Delete a course.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function deleteCourse($id)
    {
        $course = Course::findOrFail($id);
        $course->delete();

        return response()->json([
            'message' => 'Course deleted successfully'
        ]);
    }
} 