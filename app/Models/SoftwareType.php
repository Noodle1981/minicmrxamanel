<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SoftwareType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'base_hours_dev',
        'base_hours_qa',
        'base_price_infrastructure',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'base_hours_dev' => 'decimal:2',
            'base_hours_qa' => 'decimal:2',
            'base_price_infrastructure' => 'decimal:2',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function features(): HasMany
    {
        return $this->hasMany(Feature::class);
    }

    public function quotes(): HasMany
    {
        return $this->hasMany(Quote::class);
    }
}
