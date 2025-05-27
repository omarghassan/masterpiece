<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\Course;
use App\Models\Instructor;
use App\Models\User;

class AnalyticsController extends Controller
{
    public function getDashboardStats()
    {
        return response()->json([
            'users' => User::count(),
            'instructors' => Instructor::count(),
            'blogs' => Blog::count(),
            'courses' => Course::count(),
        ]);
    }
}