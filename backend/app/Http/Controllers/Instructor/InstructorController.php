<?php

namespace App\Http\Controllers\Instructor;
use App\Http\Controllers\Controller;

use App\Models\Instructor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class InstructorController extends Controller
{
    /**
     * Display a listing of instructors.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $instructors = Instructor::paginate(15);
        return response()->json($instructors);
    }

    /**
     * Store a newly created instructor.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:instructors',
            'phone' => 'nullable|string|unique:instructors',
            'password' => 'required|string|min:8|confirmed',
            'profile_image' => 'nullable|image|max:2048',
            'expertise' => 'nullable|string|max:255',
            'instructor_bio' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $instructorData = $validator->validated();

        // Handle profile image upload if provided
        if ($request->hasFile('profile_image')) {
            $path = $request->file('profile_image')->store('instructor_images', 'public');
            $instructorData['profile_image'] = $path;
        }

        $instructorData['password'] = Hash::make($instructorData['password']);
        $instructorData['is_verified'] = false; // Default to unverified

        $instructor = Instructor::create($instructorData);

        return response()->json([
            'message' => 'Instructor created successfully',
            'instructor' => $instructor
        ], 201);
    }

    /**
     * Display the specified instructor.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $instructor = Instructor::findOrFail($id);
        return response()->json($instructor);
    }

    /**
     * Update the specified instructor.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $instructor = Instructor::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => [
                'sometimes',
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('instructors')->ignore($instructor->id),
            ],
            'phone' => [
                'nullable',
                'string',
                Rule::unique('instructors')->ignore($instructor->id),
            ],
            'password' => 'sometimes|required|string|min:8|confirmed',
            'profile_image' => 'nullable|image|max:2048',
            'expertise' => 'nullable|string|max:255',
            'instructor_bio' => 'nullable|string',
            'is_verified' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $instructorData = $validator->validated();

        // Handle profile image upload if provided
        if ($request->hasFile('profile_image')) {
            $path = $request->file('profile_image')->store('instructor_images', 'public');
            $instructorData['profile_image'] = $path;
        }

        // Hash password if provided
        if (isset($instructorData['password'])) {
            $instructorData['password'] = Hash::make($instructorData['password']);
        }

        $instructor->update($instructorData);

        return response()->json([
            'message' => 'Instructor updated successfully',
            'instructor' => $instructor
        ]);
    }

    /**
     * Remove the specified instructor.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $instructor = Instructor::findOrFail($id);
        $instructor->delete();

        return response()->json([
            'message' => 'Instructor deleted successfully'
        ]);
    }

    /**
     * Authenticate instructor and return token.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Custom attempt for instructor authentication
        $instructor = Instructor::where('email', $request->email)->first();

        if (!$instructor || !Hash::check($request->password, $instructor->password)) {
            return response()->json([
                'message' => 'Invalid login credentials'
            ], 401);
        }

        $token = $instructor->createToken('instructor_auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'token_type' => 'Bearer',
            'instructor' => $instructor,
        ]);
    }

    /**
     * Log the instructor out (Invalidate the token).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    /**
     * Get the authenticated instructor's profile.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Update the authenticated instructor's profile.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function updateProfile(Request $request)
    {
        return $this->update($request, $request->user()->id);
    }

    /**
     * Get instructor courses.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getCourses($id)
    {
        $instructor = Instructor::findOrFail($id);
        $courses = $instructor->courses()->paginate(10);

        return response()->json($courses);
    }

    /**
     * Get instructor blogs.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function getBlogs($id)
    {
        $instructor = Instructor::findOrFail($id);
        $blogs = $instructor->blogs()->paginate(10);

        return response()->json($blogs);
    }

    /**
     * Toggle instructor verification status.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function toggleVerification($id)
    {
        $instructor = Instructor::findOrFail($id);
        $instructor->is_verified = !$instructor->is_verified;
        $instructor->save();

        return response()->json([
            'message' => $instructor->is_verified ?
                'Instructor verified successfully' :
                'Instructor verification removed',
            'is_verified' => $instructor->is_verified
        ]);
    }
}
