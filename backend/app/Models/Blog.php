<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Blog extends Model
{
    /** @use HasFactory<\Database\Factories\BlogFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'instructor_id',
        'title',
        'content',
        'thumbnail',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function instructor()
    {
        return $this->belongsTo(Instructor::class);
    }
}
