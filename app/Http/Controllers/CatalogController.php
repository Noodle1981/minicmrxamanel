<?php

namespace App\Http\Controllers;

use App\Models\Feature;
use App\Models\SoftwareType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CatalogController extends Controller
{
    /**
     * Catálogo de Módulos y Matriz de Esfuerzo IA
     */
    public function index(Request $request): Response
    {
        $query = $this->buildCatalogQuery($request);

        $features = $query->paginate(15)->withQueryString();
        $softwareTypes = SoftwareType::all();

        // Categorías únicas
        $categories = Feature::distinct()->pluck('category')->filter()->values();

        $metrics = [
            'total_features' => Feature::count(),
            'mining_preset_count' => Feature::where('is_preset_mining', true)->count(),
            'environment_preset_count' => Feature::where('is_preset_environment', true)->count(),
            'commerce_preset_count' => Feature::where('is_preset_commerce', true)->count(),
            'industry_preset_count' => Feature::where('is_preset_industry', true)->count(),
            'services_preset_count' => Feature::where('is_preset_services', true)->count(),
            'avg_dev_hours' => round(Feature::avg('hours_dev'), 1),
            'avg_qa_hours' => round(Feature::avg('hours_testing_qa'), 1),
        ];

        return Inertia::render('Catalog/Index', [
            'features' => $features,
            'softwareTypes' => $softwareTypes,
            'categories' => $categories,
            'filters' => $request->only(['category', 'preset', 'search']),
            'metrics' => $metrics,
        ]);
    }

    /**
     * Exportar módulos filtrados del catálogo (CSV, JSON o Prompt Markdown)
     */
    public function export(Request $request): StreamedResponse|JsonResponse
    {
        $format = strtolower((string) $request->input('format', 'csv'));
        $features = $this->buildCatalogQuery($request)->get();

        $presetSlug = $request->filled('preset') ? Str::slug((string) $request->preset) : 'todos';
        $categorySlug = $request->filled('category') ? Str::slug((string) $request->category) : 'todas';
        $date = now()->format('Y-m-d_His');
        $baseFilename = "catalogo_modulos_{$presetSlug}_{$categorySlug}_{$date}";

        if ($format === 'json') {
            $data = [
                'metadata' => [
                    'generated_at' => now()->toIso8601String(),
                    'total_features' => $features->count(),
                    'filters_applied' => [
                        'preset' => $request->input('preset', 'todos'),
                        'category' => $request->input('category', 'todas'),
                        'search' => $request->input('search', ''),
                    ],
                    'summary' => [
                        'total_hours_dev' => round((float) $features->sum('hours_dev'), 2),
                        'total_hours_integration' => round((float) $features->sum('hours_integration'), 2),
                        'total_hours_qa' => round((float) $features->sum('hours_testing_qa'), 2),
                        'total_hours' => round((float) $features->sum(fn (Feature $f) => $f->total_hours), 2),
                        'total_setup_cost' => round((float) $features->sum('cost_setup_infra'), 2),
                        'total_monthly_cost' => round((float) $features->sum('cost_monthly_infra'), 2),
                    ],
                ],
                'features' => $features->map(function (Feature $feature): array {
                    $presets = [];
                    if ($feature->is_preset_mining) {
                        $presets[] = 'Minería & HSE';
                    }
                    if ($feature->is_preset_environment) {
                        $presets[] = 'Medio Ambiente';
                    }
                    if ($feature->is_preset_commerce) {
                        $presets[] = 'Comercio & B2B';
                    }
                    if ($feature->is_preset_industry) {
                        $presets[] = 'Industria & Planta';
                    }
                    if ($feature->is_preset_services) {
                        $presets[] = 'Servicios & Consultoría';
                    }

                    return [
                        'id' => $feature->id,
                        'category' => $feature->category,
                        'name' => $feature->name,
                        'software_type' => $feature->softwareType?->name ?? 'General',
                        'description' => $feature->description,
                        'hours_dev' => (float) $feature->hours_dev,
                        'hours_integration' => (float) $feature->hours_integration,
                        'hours_testing_qa' => (float) $feature->hours_testing_qa,
                        'total_hours' => (float) $feature->total_hours,
                        'cost_setup_infra_usd' => (float) $feature->cost_setup_infra,
                        'cost_monthly_infra_usd' => (float) $feature->cost_monthly_infra,
                        'presets' => $presets,
                        'feasibility_status' => $feature->feasibility_status ?? 'verde',
                        'feasibility_condition' => $feature->feasibility_condition,
                        'contingency_script' => $feature->contingency_script,
                        'is_active' => (bool) $feature->is_active,
                    ];
                }),
            ];

            return response()->json($data, 200, [
                'Content-Disposition' => "attachment; filename=\"{$baseFilename}.json\"",
            ]);
        }

        if ($format === 'prompt' || $format === 'markdown') {
            $headers = [
                'Content-Type' => 'text/markdown; charset=UTF-8',
                'Content-Disposition' => "attachment; filename=\"{$baseFilename}.md\"",
            ];

            return response()->stream(function () use ($features, $request): void {
                $handle = fopen('php://output', 'w');
                fwrite($handle, "# Prompt de Calibración de Horas y Precios de Catálogo\n\n");
                fwrite($handle, 'Eres un arquitecto de software senior y especialista en estimación técnica de proyectos. ');
                fwrite($handle, 'A continuación se presenta el catálogo de módulos filtrados');
                if ($request->filled('preset')) {
                    fwrite($handle, " para el preset industrial: **{$request->preset}**");
                }
                if ($request->filled('category')) {
                    fwrite($handle, " en la categoría: **{$request->category}**");
                }
                fwrite($handle, ".\n\n");

                fwrite($handle, "## Módulos del Catálogo con Semáforo de Factibilidad:\n");
                foreach ($features as $f) {
                    $statusEmoji = match ($f->feasibility_status) {
                        'rojo' => '🔴 ZONA ROJA (No viable / Prohibido vender)',
                        'amarillo' => '🟡 ZONA AMARILLA (Requiere condiciones)',
                        default => '🟢 ZONA VERDE (Viable)',
                    };

                    fwrite($handle, "- **{$f->name}** [{$statusEmoji}] (ID: {$f->id}, Cat: {$f->category})\n");
                    fwrite($handle, "  - Horas: Dev: {$f->hours_dev}h | Int: {$f->hours_integration}h | QA: {$f->hours_testing_qa}h | Total: {$f->total_hours}h\n");
                    fwrite($handle, "  - Infra: Setup: \${$f->cost_setup_infra} | Mensual: \${$f->cost_monthly_infra}\n");
                    if ($f->feasibility_condition) {
                        fwrite($handle, "  - Condición requerida: {$f->feasibility_condition}\n");
                    }
                    if ($f->contingency_script) {
                        fwrite($handle, "  - Argumentario de venta si lo piden: \"{$f->contingency_script}\"\n");
                    }
                    fwrite($handle, "  - Descripción: {$f->description}\n\n");
                }
                fwrite($handle, "\n## Formato de Respuesta Esperado\n");
                fwrite($handle, "Genera una tabla o JSON con las horas ajustadas sugeridas y una breve justificación por módulo.\n");
                fclose($handle);
            }, 200, $headers);
        }

        // CSV por defecto
        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$baseFilename}.csv\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        return response()->stream(function () use ($features): void {
            $handle = fopen('php://output', 'w');

            // BOM UTF-8 para apertura directa y limpia en Microsoft Excel
            fwrite($handle, "\xEF\xBB\xBF");

            fputcsv($handle, [
                'ID',
                'Categoría',
                'Módulo',
                'Tipo Software',
                'Semáforo Factibilidad',
                'Condición Requerida',
                'Argumentario Contingencia',
                'Descripción',
                'Horas Dev',
                'Horas Integración',
                'Horas QA',
                'Horas Totales',
                'Costo Setup Infra (USD)',
                'Costo Mensual Infra (USD)',
                'Presets Industriales',
                'Estado',
            ]);

            foreach ($features as $feature) {
                $presets = [];
                if ($feature->is_preset_mining) {
                    $presets[] = 'Minería & HSE';
                }
                if ($feature->is_preset_environment) {
                    $presets[] = 'Medio Ambiente';
                }
                if ($feature->is_preset_commerce) {
                    $presets[] = 'Comercio & B2B';
                }
                if ($feature->is_preset_industry) {
                    $presets[] = 'Industria & Planta';
                }
                if ($feature->is_preset_services) {
                    $presets[] = 'Servicios & Consultoría';
                }

                $statusLabel = match ($feature->feasibility_status) {
                    'rojo' => '🔴 Zona Roja (No Viable)',
                    'amarillo' => '🟡 Zona Amarilla (Condicionado)',
                    default => '🟢 Zona Verde (Viable)',
                };

                fputcsv($handle, [
                    $feature->id,
                    $feature->category,
                    $feature->name,
                    $feature->softwareType?->name ?? 'General',
                    $statusLabel,
                    $feature->feasibility_condition ?? '',
                    $feature->contingency_script ?? '',
                    $feature->description ?? '',
                    $feature->hours_dev,
                    $feature->hours_integration,
                    $feature->hours_testing_qa,
                    $feature->total_hours,
                    $feature->cost_setup_infra,
                    $feature->cost_monthly_infra,
                    implode(', ', $presets),
                    $feature->is_active ? 'Activo' : 'Inactivo',
                ]);
            }

            fclose($handle);
        }, 200, $headers);
    }

    /**
     * Construir consulta con los filtros activos del catálogo
     *
     * @return Builder<Feature>
     */
    protected function buildCatalogQuery(Request $request): Builder
    {
        $query = Feature::with('softwareType')->orderBy('category')->orderBy('name');

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('preset')) {
            $preset = $request->preset;
            if ($preset === 'mining') {
                $query->where('is_preset_mining', true);
            } elseif ($preset === 'environment') {
                $query->where('is_preset_environment', true);
            } elseif ($preset === 'commerce') {
                $query->where('is_preset_commerce', true);
            } elseif ($preset === 'industry') {
                $query->where('is_preset_industry', true);
            } elseif ($preset === 'services') {
                $query->where('is_preset_services', true);
            }
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%");
            });
        }

        return $query;
    }

    /**
     * Guardar nuevo módulo en el catálogo
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:100',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'hours_dev' => 'required|numeric|min:0',
            'hours_integration' => 'required|numeric|min:0',
            'hours_testing_qa' => 'required|numeric|min:0',
            'cost_setup_infra' => 'required|numeric|min:0',
            'cost_monthly_infra' => 'required|numeric|min:0',
            'is_preset_mining' => 'nullable|boolean',
            'is_preset_environment' => 'nullable|boolean',
            'is_preset_commerce' => 'nullable|boolean',
            'is_preset_industry' => 'nullable|boolean',
            'is_preset_services' => 'nullable|boolean',
            'software_type_id' => 'nullable|exists:software_types,id',
        ]);

        $slug = Str::slug($validated['name']);
        $originalSlug = $slug;
        $count = 1;
        while (Feature::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        $feature = Feature::create([
            'software_type_id' => $validated['software_type_id'] ?? null,
            'category' => $validated['category'],
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'hours_dev' => $validated['hours_dev'],
            'hours_integration' => $validated['hours_integration'],
            'hours_testing_qa' => $validated['hours_testing_qa'],
            'cost_setup_infra' => $validated['cost_setup_infra'],
            'cost_monthly_infra' => $validated['cost_monthly_infra'],
            'is_preset_mining' => $validated['is_preset_mining'] ?? false,
            'is_preset_environment' => $validated['is_preset_environment'] ?? false,
            'is_preset_commerce' => $validated['is_preset_commerce'] ?? false,
            'is_preset_industry' => $validated['is_preset_industry'] ?? false,
            'is_preset_services' => $validated['is_preset_services'] ?? false,
            'is_active' => true,
        ]);

        return back()->with('success', "Módulo '{$feature->name}' creado exitosamente en el catálogo.");
    }

    /**
     * Actualizar módulo y horas de la matriz IA
     */
    public function update(Request $request, Feature $feature)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:100',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'hours_dev' => 'required|numeric|min:0',
            'hours_integration' => 'required|numeric|min:0',
            'hours_testing_qa' => 'required|numeric|min:0',
            'cost_setup_infra' => 'required|numeric|min:0',
            'cost_monthly_infra' => 'required|numeric|min:0',
            'is_preset_mining' => 'nullable|boolean',
            'is_preset_environment' => 'nullable|boolean',
            'is_preset_commerce' => 'nullable|boolean',
            'is_preset_industry' => 'nullable|boolean',
            'is_preset_services' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'software_type_id' => 'nullable|exists:software_types,id',
        ]);

        $feature->update([
            'software_type_id' => $validated['software_type_id'] ?? $feature->software_type_id,
            'category' => $validated['category'],
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'hours_dev' => $validated['hours_dev'],
            'hours_integration' => $validated['hours_integration'],
            'hours_testing_qa' => $validated['hours_testing_qa'],
            'cost_setup_infra' => $validated['cost_setup_infra'],
            'cost_monthly_infra' => $validated['cost_monthly_infra'],
            'is_preset_mining' => $validated['is_preset_mining'] ?? false,
            'is_preset_environment' => $validated['is_preset_environment'] ?? false,
            'is_preset_commerce' => $validated['is_preset_commerce'] ?? false,
            'is_preset_industry' => $validated['is_preset_industry'] ?? false,
            'is_preset_services' => $validated['is_preset_services'] ?? false,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return back()->with('success', "Módulo '{$feature->name}' actualizado.");
    }
}
