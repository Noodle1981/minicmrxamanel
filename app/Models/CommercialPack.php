<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CommercialPack extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'target_audience',
        'total_hours',
        'price_min_usd',
        'price_max_usd',
        'monthly_maintenance_usd',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'total_hours' => 'decimal:2',
            'price_min_usd' => 'decimal:2',
            'price_max_usd' => 'decimal:2',
            'monthly_maintenance_usd' => 'decimal:2',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function features(): BelongsToMany
    {
        return $this->belongsToMany(Feature::class, 'commercial_pack_feature')
            ->withPivot('is_mandatory')
            ->withTimestamps();
    }

    public function quotes(): HasMany
    {
        return $this->hasMany(Quote::class, 'pack_id');
    }
}
