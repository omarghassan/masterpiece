<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    /**
     * Store a newly created course.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'thumbnail' => 'nullable|image|max:2048',
            'level' => 'required|string|in:beginner,intermediate,advanced',
            'is_published' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $courseData = $validator->validated();
        
        // Handle thumbnail upload if provided
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('course_thumbnails', 'public');
            $courseData['thumbnail'] = $path;
        }

        // Set the instructor_id to the authenticated user's id
        $courseData['instructor_id'] = $request->user()->id;
        // Default to unpublished if not specified
        $courseData['is_published'] = $courseData['is_published'] ?? false;

        $course = Course::create($courseData);

        return response()->json([
            'message' => 'Course created successfully',
            'course' => $course
        ], 201);
    }

    /**
     * Update the specified course.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $course = Course::where('instructor_id', $request->user()->id)
                       ->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'thumbnail' => 'nullable|image|max:2048',
            'level' => 'sometimes|required|string|in:beginner,intermediate,advanced',
            'is_published' => 'sometimes|required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $courseData = $validator->validated();

        // Handle thumbnail upload if provided
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('course_thumbnails', 'public');
            $courseData['thumbnail'] = $path;
        }

        $course->update($courseData);

        return response()->json([
            'message' => 'Course updated successfully',
            'course' => $course
        ]);
    }

    /**
     * Get all courses for the authenticated instructor.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $courses = Course::where('instructor_id', $request->user()->id)
                        ->paginate(10);

        return response()->json($courses);
    }

    /**
     * Get a specific course.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
        $course = Course::where('instructor_id', $request->user()->id)
                       ->with(['modules.lessons'])
                       ->findOrFail($id);

        return response()->json($course);
    }

    /**
     * Delete a course.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $course = Course::where('instructor_id', $request->user()->id)
                       ->findOrFail($id);

        $course->delete();

        return response()->json([
            'message' => 'Course deleted successfully'
        ]);
    }

    /**
     * Toggle the published status of a course.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function togglePublished(Request $request, $id)
    {
        $course = Course::where('instructor_id', $request->user()->id)
                       ->findOrFail($id);

        $course->is_published = !$course->is_published;
        $course->save();

        return response()->json([
            'message' => $course->is_published ? 
                'Course published successfully' : 
                'Course unpublished successfully',
            'is_published' => $course->is_published
        ]);
    }
} 