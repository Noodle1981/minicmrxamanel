<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuoteController;
use Illuminate\Foundation\Application;
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

    // Módulo CPQ / Cotizaciones
    Route::resource('quotes', QuoteController::class)->only(['index', 'create', 'store', 'show']);
    Route::patch('quotes/{quote}/status', [QuoteController::class, 'updateStatus'])->name('quotes.status.update');

    // Perfil de Usuario
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
