<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Feature extends Model
{
    use HasFactory;

    protected $fillable = [
        'software_type_id',
        'category',
        'name',
        'slug',
        'description',
        'hours_dev',
        'hours_integration',
        'hours_testing_qa',
        'cost_setup_infra',
        'cost_monthly_infra',
        'is_preset_mining',
        'is_preset_environment',
        'is_preset_commerce',
        'is_preset_industry',
        'is_preset_services',
        'is_recommended',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'hours_dev' => 'decimal:2',
            'hours_integration' => 'decimal:2',
            'hours_testing_qa' => 'decimal:2',
            'cost_setup_infra' => 'decimal:2',
            'cost_monthly_infra' => 'decimal:2',
            'is_preset_mining' => 'boolean',
            'is_preset_environment' => 'boolean',
            'is_preset_commerce' => 'boolean',
            'is_preset_industry' => 'boolean',
            'is_preset_services' => 'boolean',
            'is_recommended' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Total de horas calculadas (desarrollo + integración + QA)
     */
    public function getTotalHoursAttribute(): float
    {
        return (float) ($this->hours_dev + $this->hours_integration + $this->hours_testing_qa);
    }

    public function softwareType(): BelongsTo
    {
        return $this->belongsTo(SoftwareType::class);
    }

    public function quoteItems(): HasMany
    {
        return $this->hasMany(QuoteItem::class);
    }
}
