<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'quote_id',
        'client_id',
        'manager_id',
        'code',
        'name',
        'description',
        'status',
        'priority',
        'start_date',
        'due_date',
        'delivered_at',
        'progress_percentage',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'due_date' => 'date',
            'delivered_at' => 'datetime',
            'progress_percentage' => 'integer',
        ];
    }

    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
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
