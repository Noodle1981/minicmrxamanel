<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'quote_item_id',
        'ticket_number',
        'title',
        'description',
        'status',
        'type',
        'priority',
        'estimated_hours',
        'logged_hours',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'estimated_hours' => 'decimal:2',
            'logged_hours' => 'decimal:2',
            'sort_order' => 'integer',
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function quoteItem(): BelongsTo
    {
        return $this->belongsTo(QuoteItem::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(TicketAssignment::class);
    }

    public function assignees(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'ticket_assignments')
            ->withPivot('role_in_ticket', 'assigned_at')
            ->withTimestamps();
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
