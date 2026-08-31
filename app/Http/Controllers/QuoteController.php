<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Feature;
use App\Models\Quote;
use App\Models\QuoteItem;
use App\Models\SoftwareType;
use App\Services\QuoteCalculationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class QuoteController extends Controller
{
    protected QuoteCalculationService $calculationService;

    public function __construct(QuoteCalculationService $calculationService)
    {
        $this->calculationService = $calculationService;
    }

    /**
     * Listado de Presupuestos / Cotizaciones
     */
    public function index(Request $request): Response
    {
        $query = Quote::with(['client', 'softwareType', 'creator'])
            ->latest();

        // Filtro por estado
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filtro por cliente
        if ($request->filled('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        // Búsqueda por número o título
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('quote_number', 'like', "%{$search}%")
                    ->orWhere('title', 'like', "%{$search}%")
                    ->orWhereHas('client', function ($clientQ) use ($search) {
                        $clientQ->where('company_name', 'like', "%{$search}%");
                    });
            });
        }

        $quotes = $query->paginate(10)->withQueryString();

        // Métricas rápidas para el dashboard de cotizaciones
        $metrics = [
            'total_quotes' => Quote::count(),
            'total_accepted_amount' => (float) Quote::where('status', 'accepted')->sum('total_amount'),
            'pending_review' => Quote::whereIn('status', ['sent', 'under_review'])->count(),
            'drafts' => Quote::where('status', 'draft')->count(),
        ];

        return Inertia::render('Quotes/Index', [
            'quotes' => $quotes,
            'filters' => $request->only(['status', 'client_id', 'search']),
            'clients' => Client::select('id', 'company_name')->orderBy('company_name')->get(),
            'metrics' => $metrics,
        ]);
    }

    /**
     * Pantalla interactiva del Cotizador CPQ (Crear nueva cotización)
     */
    public function create(Request $request): Response
    {
        $clients = Client::orderBy('company_name')->get();
        $softwareTypes = SoftwareType::where('is_active', true)->orderBy('sort_order')->get();
        $features = Feature::where('is_active', true)->get();

        // Agrupar features por categoría
        $featuresByCategory = $features->groupBy('category');

        return Inertia::render('Quotes/Create', [
            'clients' => $clients,
            'softwareTypes' => $softwareTypes,
            'features' => $features,
            'featuresByCategory' => $featuresByCategory,
            'preselectedClientId' => $request->client_id ? (int) $request->client_id : null,
            'preselectedPreset' => $request->preset ?? null,
        ]);
    }

    /**
     * Almacenar una nueva cotización calculada
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'software_type_id' => 'required|exists:software_types,id',
            'title' => 'required|string|max:255',
            'preset_used' => 'nullable|string|in:mineria,medio_ambiente,comercio,personalizado',
            'hourly_rate' => 'required|numeric|min:1',
            'team_capacity_hours_per_day' => 'required|numeric|min:1|max:24',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'estimated_start_date' => 'nullable|date',
            'valid_until' => 'nullable|date',
            'notes' => 'nullable|string',
            'terms_conditions' => 'nullable|string',
            'selected_feature_ids' => 'required|array|min:1',
            'selected_feature_ids.*' => 'exists:features,id',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $softwareType = SoftwareType::findOrFail($validated['software_type_id']);
            $selectedFeatures = Feature::whereIn('id', $validated['selected_feature_ids'])->get();

            // 1. Horas base del tipo de software
            $baseDevHours = (float) $softwareType->base_hours_dev;
            $baseQaHours = (float) $softwareType->base_hours_qa;
            $baseIntegrationHours = 0.0;
            $baseInfraSetup = (float) $softwareType->base_price_infrastructure;
            $baseInfraMonthly = 0.0;

            // 2. Sumar horas e infraestructura de los módulos seleccionados
            $featureDevHours = (float) $selectedFeatures->sum('hours_dev');
            $featureIntegrationHours = (float) $selectedFeatures->sum('hours_integration');
            $featureQaHours = (float) $selectedFeatures->sum('hours_testing_qa');
            $featureInfraSetup = (float) $selectedFeatures->sum('cost_setup_infra');
            $featureInfraMonthly = (float) $selectedFeatures->sum('cost_monthly_infra');

            $totalDevHours = $baseDevHours + $featureDevHours;
            $totalIntegrationHours = $baseIntegrationHours + $featureIntegrationHours;
            $totalQaHours = $baseQaHours + $featureQaHours;
            $totalHours = $totalDevHours + $totalIntegrationHours + $totalQaHours;

            // 3. Cálculos monetarios
            $hourlyRate = (float) $validated['hourly_rate'];
            $subtotalDevelopment = $totalHours * $hourlyRate;
            $subtotalInfraSetup = $baseInfraSetup + $featureInfraSetup;
            $subtotalInfraMonthly = $baseInfraMonthly + $featureInfraMonthly;

            $discountPercentage = isset($validated['discount_percentage']) ? (float) $validated['discount_percentage'] : 0.0;
            $discountAmount = ($subtotalDevelopment + $subtotalInfraSetup) * ($discountPercentage / 100);
            $totalAmount = ($subtotalDevelopment + $subtotalInfraSetup) - $discountAmount;

            // 4. Cálculo de tiempos y días hábiles
            $capacityPerDay = (float) $validated['team_capacity_hours_per_day'];
            $requiredBusinessDays = $this->calculationService->calculateRequiredBusinessDays($totalHours, $capacityPerDay);

            $startDate = !empty($validated['estimated_start_date'])
                ? Carbon::parse($validated['estimated_start_date'])
                : Carbon::now()->addDay();

            $deliveryDate = $this->calculationService->calculateBusinessDeliveryDate($startDate, $requiredBusinessDays);

            // 5. Crear la cotización
            $quote = Quote::create([
                'quote_number' => $this->calculationService->generateQuoteNumber(),
                'client_id' => $validated['client_id'],
                'software_type_id' => $validated['software_type_id'],
                'created_by' => $request->user()->id,
                'title' => $validated['title'],
                'preset_used' => $validated['preset_used'] ?? 'personalizado',
                'status' => 'draft',
                'currency' => 'USD',
                'hourly_rate' => $hourlyRate,
                'total_hours_dev' => $totalDevHours,
                'total_hours_integration' => $totalIntegrationHours,
                'total_hours_qa' => $totalQaHours,
                'total_hours' => $totalHours,
                'subtotal_development' => $subtotalDevelopment,
                'subtotal_infrastructure_setup' => $subtotalInfraSetup,
                'subtotal_infrastructure_monthly' => $subtotalInfraMonthly,
                'discount_percentage' => $discountPercentage,
                'discount_amount' => $discountAmount,
                'total_amount' => $totalAmount,
                'team_capacity_hours_per_day' => $capacityPerDay,
                'estimated_business_days' => $requiredBusinessDays,
                'estimated_start_date' => $startDate->toDateString(),
                'estimated_delivery_date' => $deliveryDate->toDateString(),
                'notes' => $validated['notes'] ?? null,
                'terms_conditions' => $validated['terms_conditions'] ?? "Presupuesto válido por 15 días corridos. Incluye 3 meses de garantía técnica y soporte pos-lanzamiento.",
                'valid_until' => !empty($validated['valid_until']) ? $validated['valid_until'] : Carbon::now()->addDays(15)->toDateString(),
            ]);

            // 6. Crear ítems desglosados en QuoteItem
            // Ítem base de arquitectura
            QuoteItem::create([
                'quote_id' => $quote->id,
                'feature_id' => null,
                'category' => 'Arquitectura Base',
                'name' => 'Estructura Base: ' . $softwareType->name,
                'description' => $softwareType->description,
                'hours_dev' => $baseDevHours,
                'hours_integration' => $baseIntegrationHours,
                'hours_testing_qa' => $baseQaHours,
                'total_hours' => $baseDevHours + $baseQaHours,
                'cost_setup_infra' => $baseInfraSetup,
                'cost_monthly_infra' => 0,
                'price' => (($baseDevHours + $baseQaHours) * $hourlyRate) + $baseInfraSetup,
            ]);

            // Ítems de cada módulo seleccionado
            foreach ($selectedFeatures as $feature) {
                $featureTotalHours = (float) ($feature->hours_dev + $feature->hours_integration + $feature->hours_testing_qa);
                $itemPrice = ($featureTotalHours * $hourlyRate) + (float) $feature->cost_setup_infra;

                QuoteItem::create([
                    'quote_id' => $quote->id,
                    'feature_id' => $feature->id,
                    'category' => $feature->category,
                    'name' => $feature->name,
                    'description' => $feature->description,
                    'hours_dev' => $feature->hours_dev,
                    'hours_integration' => $feature->hours_integration,
                    'hours_testing_qa' => $feature->hours_testing_qa,
                    'total_hours' => $featureTotalHours,
                    'cost_setup_infra' => $feature->cost_setup_infra,
                    'cost_monthly_infra' => $feature->cost_monthly_infra,
                    'price' => $itemPrice,
                ]);
            }

            return redirect()->route('quotes.show', $quote->id)
                ->with('success', 'Presupuesto ' . $quote->quote_number . ' generado exitosamente.');
        });
    }

    /**
     * Vista formal y ejecutiva del Presupuesto (Show)
     */
    public function show(Quote $quote): Response
    {
        $quote->load([
            'client',
            'softwareType',
            'creator',
            'items.feature',
            'project',
            'comments.user',
        ]);

        return Inertia::render('Quotes/Show', [
            'quote' => $quote,
        ]);
    }

    /**
     * Actualizar estado comercial de la cotización
     */
    public function updateStatus(Request $request, Quote $quote, \App\Services\ProjectService $projectService)
    {
        $validated = $request->validate([
            'status' => 'required|in:draft,sent,under_review,accepted,rejected',
            'rejection_reason' => 'nullable|string',
        ]);

        $updateData = ['status' => $validated['status']];

        if ($validated['status'] === 'accepted') {
            $updateData['accepted_at'] = Carbon::now();
            $quote->update($updateData);

            // Generación automática de Proyecto y Tickets
            $project = $projectService->createProjectFromQuote($quote, $request->user());

            return back()->with('success', '¡Presupuesto aceptado! Se ha generado automáticamente el proyecto ' . $project->code . ' con sus tickets de trabajo.');
        } elseif ($validated['status'] === 'rejected') {
            $updateData['rejected_at'] = Carbon::now();
            $updateData['rejection_reason'] = $validated['rejection_reason'] ?? null;
            $quote->update($updateData);
        } else {
            $quote->update($updateData);
        }

        return back()->with('success', 'Estado del presupuesto actualizado a: ' . strtoupper($validated['status']));
    }
}
