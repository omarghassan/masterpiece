<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Instructor extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\InstructorFactory> */
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;
    
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'profile_image',
        'expertise',
        'instructor_bio',
        'is_verified',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_verified' => 'boolean',
        'password' => 'hashed',
    ];

    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    public function blogs()
    {
        return $this->hasMany(Blog::class);
    }
}
