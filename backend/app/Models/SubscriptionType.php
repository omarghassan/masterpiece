<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubscriptionType extends Model
{
    /** @use HasFactory<\Database\Factories\SubscriptionTypeFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'price',
        'duration',
        'features',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'features' => 'array',
    ];

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }
}
