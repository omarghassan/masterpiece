<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
// use App\Http\Controllers\AdminController;
// use App\Http\Controllers\InstructorController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Instructor\InstructorController;
use App\Http\Controllers\Instructor\CourseController;
use App\Http\Controllers\Instructor\BlogController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('users/login', [UserController::class, 'login']);
Route::post('users/register', [UserController::class, 'store']);

Route::post('admins/login', [AdminController::class, 'login']);
Route::post('instructors/login', [InstructorController::class, 'login']);
Route::post('instructors/register', [InstructorController::class, 'store']);

// User routes (protected)
Route::prefix('users')->middleware('auth:sanctum')->group(function () {
    // User profile routes
    Route::get('/profile', [UserController::class, 'profile']);
    Route::put('/profile', [UserController::class, 'updateProfile']);
    Route::post('/logout', [UserController::class, 'logout']);
    
    // User resource routes
    Route::apiResource('users', UserController::class);
});

// Admin routes (protected)
Route::prefix('admins')->middleware(['auth:sanctum', 'ability:admin'])->group(function () {
    // Admin profile routes
    Route::get('/profile', [AdminController::class, 'profile']);
    Route::put('/profile', [AdminController::class, 'updateProfile']);
    Route::post('/logout', [AdminController::class, 'logout']);
    
    // Admin resource routes
    Route::apiResource('admins', AdminController::class);
    
    // Admin specific routes
    Route::put('instructors/{instructor}/verify', [InstructorController::class, 'toggleVerification']);
});

// Instructor routes (protected)
Route::prefix('instructors')->middleware(['auth:sanctum', 'ability:instructor'])->group(function () {
    // Instructor profile routes
    Route::get('/profile', [InstructorController::class, 'profile']);
    Route::put('/profile', [InstructorController::class, 'updateProfile']);
    Route::post('/logout', [InstructorController::class, 'logout']);
    
    // Instructor resource routes
    Route::apiResource('instructors', InstructorController::class);
    
    // Instructor specific routes
    Route::get('instructors/{instructor}/courses', [InstructorController::class, 'getCourses']);
    Route::get('instructors/{instructor}/blogs', [InstructorController::class, 'getBlogs']);

    // Course management routes
    Route::prefix('courses')->group(function () {
        Route::get('/', [CourseController::class, 'index']);
        Route::post('/', [CourseController::class, 'store']);
        Route::get('/{course}', [CourseController::class, 'show']);
        Route::put('/{course}', [CourseController::class, 'update']);
        Route::delete('/{course}', [CourseController::class, 'destroy']);
        Route::put('/{course}/toggle-published', [CourseController::class, 'togglePublished']);
    });
    
    // Blog management routes
    Route::prefix('blogs')->group(function () {
        Route::get('/', [BlogController::class, 'index']);
        Route::post('/', [BlogController::class, 'store']);
        Route::get('/{blog}', [BlogController::class, 'show']);
        Route::put('/{blog}', [BlogController::class, 'update']);
        Route::delete('/{blog}', [BlogController::class, 'destroy']);
        Route::put('/{blog}/schedule', [BlogController::class, 'schedule']);
        Route::put('/{blog}/publish-now', [BlogController::class, 'publishNow']);
    });
});