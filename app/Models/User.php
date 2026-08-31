<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'avatar_url',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    /* ==================== RELACIONES ==================== */

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class)->withTimestamps();
    }

    public function client(): HasOne
    {
        return $this->hasOne(Client::class);
    }

    public function clientsCreated(): HasMany
    {
        return $this->hasMany(Client::class, 'created_by');
    }

    public function quotesCreated(): HasMany
    {
        return $this->hasMany(Quote::class, 'created_by');
    }

    public function managedProjects(): HasMany
    {
        return $this->hasMany(Project::class, 'manager_id');
    }

    public function ticketAssignments(): HasMany
    {
        return $this->hasMany(TicketAssignment::class);
    }

    public function assignedTickets(): BelongsToMany
    {
        return $this->belongsToMany(Ticket::class, 'ticket_assignments')
            ->withPivot('role_in_ticket', 'assigned_at')
            ->withTimestamps();
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class);
    }

    /* ==================== HELPERS DE ROLES ==================== */

    public function hasRole(string|array $roles): bool
    {
        if (is_string($roles)) {
            return $this->roles->contains('name', $roles);
        }

        return $this->roles->whereIn('name', $roles)->isNotEmpty();
    }

    public function isSuperAdmin(): bool
    {
        return $this->hasRole('super_admin');
    }

    public function isVendedor(): bool
    {
        return $this->hasRole('vendedor');
    }

    public function isCliente(): bool
    {
        return $this->hasRole('cliente');
    }

    public function isTechnical(): bool
    {
        return $this->hasRole(['desarrollador', 'disenador', 'qa_tester', 'validador']);
    }
}
