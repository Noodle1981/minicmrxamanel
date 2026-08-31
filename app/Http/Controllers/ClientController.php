<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Quote;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    /**
     * Listado de Clientes con segmentación de industria y métricas
     */
    public function index(Request $request): Response
    {
        $query = Client::withCount(['quotes', 'projects'])
            ->with(['creator', 'user'])
            ->latest();

        // Filtro por industria / rubro
        if ($request->filled('industry')) {
            $query->where('industry', $request->industry);
        }

        // Búsqueda por empresa, contacto o email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('company_name', 'like', "%{$search}%")
                    ->orWhere('contact_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('cuit_tax_id', 'like', "%{$search}%");
            });
        }

        $clients = $query->paginate(10)->withQueryString();

        // Métricas de cartera
        $totalClients = Client::count();
        $miningClients = Client::where('industry', 'mineria')->count();
        $envClients = Client::where('industry', 'medio_ambiente')->count();
        $commerceClients = Client::where('industry', 'comercio')->count();

        return Inertia::render('Clients/Index', [
            'clients' => $clients,
            'filters' => $request->only(['industry', 'search']),
            'metrics' => [
                'total_clients' => $totalClients,
                'mining_count' => $miningClients,
                'environment_count' => $envClients,
                'commerce_count' => $commerceClients,
            ],
        ]);
    }

    /**
     * Formulario de Alta de Cliente
     */
    public function create(): Response
    {
        return Inertia::render('Clients/Create');
    }

    /**
     * Guardar nuevo cliente
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'contact_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:clients,email',
            'phone' => 'nullable|string|max:50',
            'industry' => 'required|string|in:mineria,medio_ambiente,comercio,servicios,otro',
            'cuit_tax_id' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $validated['created_by'] = $request->user()->id;

        $client = Client::create($validated);

        // Si se solicitó redirigir directamente al cotizador
        if ($request->boolean('redirect_to_quote')) {
            return redirect()->route('quotes.create', ['client_id' => $client->id])
                ->with('success', 'Cliente ' . $client->company_name . ' registrado. Iniciando cotización...');
        }

        return redirect()->route('clients.show', $client->id)
            ->with('success', 'Cliente ' . $client->company_name . ' registrado exitosamente.');
    }

    /**
     * Ficha 360° del Cliente (Detalle, historial de presupuestos y proyectos)
     */
    public function show(Client $client): Response
    {
        $client->load([
            'creator',
            'user',
            'quotes' => function ($q) {
                $q->with('softwareType')->latest();
            },
            'projects' => function ($q) {
                $q->with('manager')->latest();
            },
        ]);

        // Estadísticas del cliente
        $totalQuoted = (float) $client->quotes->sum('total_amount');
        $acceptedQuoted = (float) $client->quotes->where('status', 'accepted')->sum('total_amount');
        $totalQuotesCount = $client->quotes->count();
        $acceptedQuotesCount = $client->quotes->where('status', 'accepted')->count();

        return Inertia::render('Clients/Show', [
            'client' => $client,
            'stats' => [
                'total_quoted' => $totalQuoted,
                'accepted_quoted' => $acceptedQuoted,
                'total_quotes_count' => $totalQuotesCount,
                'accepted_quotes_count' => $acceptedQuotesCount,
                'active_projects_count' => $client->projects->whereIn('status', ['pending_start', 'in_development', 'testing_validation'])->count(),
            ],
        ]);
    }

    /**
     * Formulario de Edición de Cliente
     */
    public function edit(Client $client): Response
    {
        return Inertia::render('Clients/Edit', [
            'client' => $client,
        ]);
    }

    /**
     * Actualizar cliente
     */
    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'contact_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:clients,email,' . $client->id,
            'phone' => 'nullable|string|max:50',
            'industry' => 'required|string|in:mineria,medio_ambiente,comercio,servicios,otro',
            'cuit_tax_id' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $client->update($validated);

        return redirect()->route('clients.show', $client->id)
            ->with('success', 'Datos del cliente actualizados correctamente.');
    }

    /**
     * Eliminar cliente
     */
    public function destroy(Client $client)
    {
        $company = $client->company_name;
        $client->delete();

        return redirect()->route('clients.index')
            ->with('success', 'Cliente ' . $company . ' eliminado de la cartera.');
    }
}
