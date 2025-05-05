<?php

namespace App\Http\Controllers\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class BlogController extends Controller
{
    /**
     * Display a listing of the instructor's blogs.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $blogs = Blog::where('instructor_id', $request->user()->id)
                    ->orderBy('created_at', 'desc')
                    ->paginate(10);

        return response()->json($blogs);
    }

    /**
     * Store a newly created blog post.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'content' => 'required|json',
            'thumbnail' => 'nullable|image|max:2048',
            'published_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $blogData = $validator->validated();
        
        // Handle thumbnail upload if provided
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('blog_thumbnails', 'public');
            $blogData['thumbnail'] = $path;
        }

        // Set the instructor_id to the authenticated user's id
        $blogData['instructor_id'] = $request->user()->id;
        
        // Set published_at to now if not specified
        if (empty($blogData['published_at'])) {
            $blogData['published_at'] = Carbon::now();
        }

        $blog = Blog::create($blogData);

        return response()->json([
            'message' => 'Blog post created successfully',
            'blog' => $blog
        ], 201);
    }

    /**
     * Display the specified blog post.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
        $blog = Blog::where('instructor_id', $request->user()->id)
                   ->findOrFail($id);

        return response()->json($blog);
    }

    /**
     * Update the specified blog post.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $blog = Blog::where('instructor_id', $request->user()->id)
                   ->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'thumbnail' => 'nullable|image|max:2048',
            'published_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $blogData = $validator->validated();

        // Handle thumbnail upload if provided
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('blog_thumbnails', 'public');
            $blogData['thumbnail'] = $path;
        }

        $blog->update($blogData);

        return response()->json([
            'message' => 'Blog post updated successfully',
            'blog' => $blog
        ]);
    }

    /**
     * Remove the specified blog post.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $blog = Blog::where('instructor_id', $request->user()->id)
                   ->findOrFail($id);

        $blog->delete();

        return response()->json([
            'message' => 'Blog post deleted successfully'
        ]);
    }

    /**
     * Schedule a blog post for future publication.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function schedule(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'published_at' => 'required|date|after:now',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $blog = Blog::where('instructor_id', $request->user()->id)
                   ->findOrFail($id);

        $blog->published_at = $request->published_at;
        $blog->save();

        return response()->json([
            'message' => 'Blog post scheduled for publication',
            'blog' => $blog
        ]);
    }

    /**
     * Publish a blog post immediately.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function publishNow(Request $request, $id)
    {
        $blog = Blog::where('instructor_id', $request->user()->id)
                   ->findOrFail($id);

        $blog->published_at = Carbon::now();
        $blog->save();

        return response()->json([
            'message' => 'Blog post published successfully',
            'blog' => $blog
        ]);
    }
} 