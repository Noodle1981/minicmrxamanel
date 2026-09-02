<?php

namespace Tests\Feature;

use App\Models\Feature;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CatalogExportTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_export_catalog(): void
    {
        $response = $this->get(route('catalog.export'));

        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_user_can_export_catalog_as_csv(): void
    {
        $user = User::factory()->create();
        Feature::factory()->create([
            'name' => 'Módulo General',
            'category' => 'Core',
            'hours_dev' => 25,
            'hours_integration' => 5,
            'hours_testing_qa' => 10,
        ]);

        $response = $this->actingAs($user)->get(route('catalog.export', ['format' => 'csv']));

        $response->assertOk();
        $response->assertHeader('content-type', 'text/csv; charset=UTF-8');
        $content = $response->streamedContent();

        $this->assertStringContainsString('Módulo General', $content);
        $this->assertStringContainsString('Core', $content);
        $this->assertStringContainsString('Horas Dev', $content);
    }

    public function test_export_filters_by_preset(): void
    {
        $user = User::factory()->create();
        Feature::factory()->environment()->create([
            'name' => 'Monitoreo Ambiental IoT',
        ]);
        Feature::factory()->mining()->create([
            'name' => 'Telemetría de Flota Minera',
        ]);

        $response = $this->actingAs($user)->get(route('catalog.export', [
            'preset' => 'environment',
            'format' => 'csv',
        ]));

        $response->assertOk();
        $content = $response->streamedContent();

        $this->assertStringContainsString('Monitoreo Ambiental IoT', $content);
        $this->assertStringNotContainsString('Telemetría de Flota Minera', $content);
    }

    public function test_export_filters_by_category_and_preset_and_search(): void
    {
        $user = User::factory()->create();
        Feature::factory()->environment()->create([
            'name' => 'Sensor de Calidad de Aire',
            'category' => 'Monitoreo',
        ]);
        Feature::factory()->environment()->create([
            'name' => 'Reportes de Emisiones',
            'category' => 'Cumplimiento',
        ]);

        $response = $this->actingAs($user)->get(route('catalog.export', [
            'preset' => 'environment',
            'category' => 'Monitoreo',
            'search' => 'Sensor',
            'format' => 'csv',
        ]));

        $response->assertOk();
        $content = $response->streamedContent();

        $this->assertStringContainsString('Sensor de Calidad de Aire', $content);
        $this->assertStringNotContainsString('Reportes de Emisiones', $content);
    }

    public function test_export_can_return_json(): void
    {
        $user = User::factory()->create();
        Feature::factory()->create([
            'name' => 'Gestión de Contratos',
            'category' => 'Legal',
            'hours_dev' => 15,
        ]);

        $response = $this->actingAs($user)->get(route('catalog.export', [
            'format' => 'json',
        ]));

        $response->assertOk();
        $response->assertJsonStructure([
            'metadata' => [
                'generated_at',
                'total_features',
                'filters_applied',
                'summary' => [
                    'total_hours_dev',
                    'total_hours_integration',
                    'total_hours_qa',
                    'total_hours',
                    'total_setup_cost',
                    'total_monthly_cost',
                ],
            ],
            'features' => [
                '*' => [
                    'id',
                    'category',
                    'name',
                    'software_type',
                    'description',
                    'hours_dev',
                    'hours_integration',
                    'hours_testing_qa',
                    'total_hours',
                    'cost_setup_infra_usd',
                    'cost_monthly_infra_usd',
                    'presets',
                    'is_active',
                ],
            ],
        ]);
    }

    public function test_export_can_return_prompt_markdown(): void
    {
        $user = User::factory()->create();
        Feature::factory()->create([
            'name' => 'Módulo de Inventario',
            'category' => 'Operaciones',
        ]);

        $response = $this->actingAs($user)->get(route('catalog.export', [
            'format' => 'prompt',
        ]));

        $response->assertOk();
        $response->assertHeader('content-type', 'text/markdown; charset=UTF-8');
        $content = $response->streamedContent();

        $this->assertStringContainsString('Prompt de Calibración de Horas y Precios de Catálogo', $content);
        $this->assertStringContainsString('Módulo de Inventario', $content);
    }
}
