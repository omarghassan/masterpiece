<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lesson extends Model
{
    /** @use HasFactory<\Database\Factories\LessonFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'module_id',
        'title',
        'content',
        'video_url',
        'duration',
        'order',
    ];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function course()
    {
        return $this->hasOneThrough(Course::class, Module::class, 'id', 'id', 'module_id', 'course_id');
    }

    public function userProgress()
    {
        return $this->hasMany(UserProgress::class);
    }

    public function completedByUsers()
    {
        return $this->belongsToMany(User::class, 'user_progress')
            ->withPivot('completed', 'completed_at')
            ->wherePivot('completed', true);
    }
}
