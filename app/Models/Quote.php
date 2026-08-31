<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Quote extends Model
{
    use HasFactory;

    protected $fillable = [
        'quote_number',
        'client_id',
        'software_type_id',
        'created_by',
        'title',
        'preset_used',
        'status',
        'currency',
        'hourly_rate',
        'total_hours_dev',
        'total_hours_integration',
        'total_hours_qa',
        'total_hours',
        'subtotal_development',
        'subtotal_infrastructure_setup',
        'subtotal_infrastructure_monthly',
        'discount_percentage',
        'discount_amount',
        'total_amount',
        'team_capacity_hours_per_day',
        'estimated_business_days',
        'estimated_start_date',
        'estimated_delivery_date',
        'notes',
        'terms_conditions',
        'accepted_at',
        'rejected_at',
        'rejection_reason',
        'valid_until',
    ];

    protected function casts(): array
    {
        return [
            'hourly_rate' => 'decimal:2',
            'total_hours_dev' => 'decimal:2',
            'total_hours_integration' => 'decimal:2',
            'total_hours_qa' => 'decimal:2',
            'total_hours' => 'decimal:2',
            'subtotal_development' => 'decimal:2',
            'subtotal_infrastructure_setup' => 'decimal:2',
            'subtotal_infrastructure_monthly' => 'decimal:2',
            'discount_percentage' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'total_amount' => 'decimal:2',
            'team_capacity_hours_per_day' => 'decimal:2',
            'estimated_business_days' => 'integer',
            'estimated_start_date' => 'date',
            'estimated_delivery_date' => 'date',
            'accepted_at' => 'datetime',
            'rejected_at' => 'datetime',
            'valid_until' => 'date',
        ];
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function softwareType(): BelongsTo
    {
        return $this->belongsTo(SoftwareType::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(QuoteItem::class);
    }

    public function project(): HasOne
    {
        return $this->hasOne(Project::class);
    }

    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }

    public function attachments(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }
}
