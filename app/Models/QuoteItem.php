<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuoteItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'quote_id',
        'feature_id',
        'category',
        'name',
        'description',
        'hours_dev',
        'hours_integration',
        'hours_testing_qa',
        'total_hours',
        'cost_setup_infra',
        'cost_monthly_infra',
        'price',
    ];

    protected function casts(): array
    {
        return [
            'hours_dev' => 'decimal:2',
            'hours_integration' => 'decimal:2',
            'hours_testing_qa' => 'decimal:2',
            'total_hours' => 'decimal:2',
            'cost_setup_infra' => 'decimal:2',
            'cost_monthly_infra' => 'decimal:2',
            'price' => 'decimal:2',
        ];
    }

    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }

    public function feature(): BelongsTo
    {
        return $this->belongsTo(Feature::class);
    }

    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }
}
