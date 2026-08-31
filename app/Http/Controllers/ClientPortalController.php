<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Comment;
use App\Models\Quote;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClientPortalController extends Controller
{
    /**
     * Dashboard del Portal del Cliente
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Buscar el cliente asociado al usuario o usar el primero para modo demo / vendedor
        $client = $user->client;
        if (!$client) {
            $client = Client::where('user_id', $user->id)->first() ?: Client::first();
        }

        $quotes = $client ? Quote::where('client_id', $client->id)->with('softwareType')->latest()->get() : collect();
        $projects = $client ? $client->projects()->with(['manager', 'tickets'])->latest()->get() : collect();

        return Inertia::render('Portal/Dashboard', [
            'client' => $client,
            'quotes' => $quotes,
            'projects' => $projects,
            'summary' => [
                'active_quotes' => $quotes->whereIn('status', ['sent', 'under_review'])->count(),
                'accepted_quotes' => $quotes->where('status', 'accepted')->count(),
                'active_projects' => $projects->whereIn('status', ['pending_start', 'in_development', 'testing_validation'])->count(),
            ],
        ]);
    }

    /**
     * Vista de Revisión de Presupuesto para el Cliente
     */
    public function showQuote(Quote $quote, Request $request): Response
    {
        $quote->load([
            'client',
            'softwareType',
            'creator',
            'items.feature',
            'comments.user',
        ]);

        return Inertia::render('Portal/QuoteView', [
            'quote' => $quote,
        ]);
    }

    /**
     * Acción de Aceptación o Rechazo formal por parte del Cliente
     */
    public function respondQuote(Request $request, Quote $quote)
    {
        $validated = $request->validate([
            'action' => 'required|in:accept,reject',
            'feedback' => 'nullable|string',
        ]);

        if ($validated['action'] === 'accept') {
            $quote->update([
                'status' => 'accepted',
                'accepted_at' => Carbon::now(),
            ]);

            // Agregar comentario de aceptación si se incluyó mensaje
            if (!empty($validated['feedback'])) {
                Comment::create([
                    'user_id' => $request->user()->id,
                    'commentable_type' => Quote::class,
                    'commentable_id' => $quote->id,
                    'content' => 'Propuesta aceptada por el cliente. Comentario: ' . $validated['feedback'],
                    'is_internal' => false,
                ]);
            }

            return back()->with('success', '¡Presupuesto aceptado con éxito! Nuestro equipo técnico se pondrá en contacto para coordinar el inicio del proyecto.');
        } else {
            $quote->update([
                'status' => 'rejected',
                'rejected_at' => Carbon::now(),
                'rejection_reason' => $validated['feedback'] ?? 'Rechazado por el cliente desde el portal',
            ]);

            if (!empty($validated['feedback'])) {
                Comment::create([
                    'user_id' => $request->user()->id,
                    'commentable_type' => Quote::class,
                    'commentable_id' => $quote->id,
                    'content' => 'Propuesta rechazada por el cliente. Motivo: ' . $validated['feedback'],
                    'is_internal' => false,
                ]);
            }

            return back()->with('info', 'Presupuesto marcado como rechazado. Nos pondremos en contacto para ajustar los requerimientos.');
        }
    }

    /**
     * Enviar mensaje o consulta sobre una cotización
     */
    public function addComment(Request $request, Quote $quote)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        Comment::create([
            'user_id' => $request->user()->id,
            'commentable_type' => Quote::class,
            'commentable_id' => $quote->id,
            'content' => $validated['content'],
            'is_internal' => false,
        ]);

        return back()->with('success', 'Mensaje enviado a nuestro equipo comercial.');
    }
}
