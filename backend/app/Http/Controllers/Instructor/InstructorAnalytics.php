<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Course;
use App\Models\Instructor;
use App\Models\User;

class InstructorAnalytics extends Controller
{
    public function getDashboardStats($id)
    {
        $instructor = Instructor::find($id);

        if (!$instructor) {
            return response()->json(['error' => 'Instructor not found'], 404);
        }

        return response()->json([
            'courses' => Course::where('instructor_id', $id)->count(),
            'blogs' => Blog::where('instructor_id', $id)->count(),
        ]);
    }
}
