<?php

use App\Http\Controllers\CalendarController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ClientPortalController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\QuoteController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Módulo Mini-CRM (Gestión de Clientes)
    Route::resource('clients', ClientController::class);

    // Módulo CPQ / Cotizaciones
    Route::resource('quotes', QuoteController::class)->only(['index', 'create', 'store', 'show']);
    Route::patch('quotes/{quote}/status', [QuoteController::class, 'updateStatus'])->name('quotes.status.update');

    // Módulo Proyectos & Obras Operativas
    Route::resource('projects', ProjectController::class)->only(['index', 'show']);
    Route::patch('projects/{project}/status', [ProjectController::class, 'updateStatus'])->name('projects.status.update');

    // Módulo Tablero de Tickets & Asignaciones Multi-Rol
    Route::get('/tickets', [TicketController::class, 'index'])->name('tickets.index');
    Route::patch('/tickets/{ticket}', [TicketController::class, 'update'])->name('tickets.update');
    Route::post('/tickets/{ticket}/assign', [TicketController::class, 'assign'])->name('tickets.assign');
    Route::post('/tickets/{ticket}/unassign', [TicketController::class, 'unassign'])->name('tickets.unassign');
    Route::post('/tickets/{ticket}/comments', [TicketController::class, 'addComment'])->name('tickets.comments.store');

    // Módulo Calendario & Disponibilidad Laboral (Lunes a Viernes)
    Route::get('/calendar', [CalendarController::class, 'index'])->name('calendar.index');

    // Portal del Cliente
    Route::get('/portal', [ClientPortalController::class, 'index'])->name('portal.dashboard');
    Route::get('/portal/quotes/{quote}', [ClientPortalController::class, 'showQuote'])->name('portal.quotes.show');
    Route::post('/portal/quotes/{quote}/respond', [ClientPortalController::class, 'respondQuote'])->name('portal.quotes.respond');
    Route::post('/portal/quotes/{quote}/comment', [ClientPortalController::class, 'addComment'])->name('portal.quotes.comment');

    // Perfil de Usuario
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
