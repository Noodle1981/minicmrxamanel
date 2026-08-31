<?php

namespace App\Http\Controllers;

use App\Models\Feature;
use App\Models\SoftwareType;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    /**
     * Catálogo de Módulos y Matriz de Esfuerzo IA
     */
    public function index(Request $request): Response
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
