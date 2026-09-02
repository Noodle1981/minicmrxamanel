<?php

namespace Database\Seeders;

use App\Models\CommercialPack;
use App\Models\Feature;
use Illuminate\Database\Seeder;

class CommercialPackSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $coreSlugs = [
            'auth-multi-role-2fa',
            'audit-logs-compliance',
            'notifications-multi-channel',
            'executive-dashboard-kpis',
            'cloud-infra-ssl-backups',
        ];

        $packsData = [
            [
                'pack' => [
                    'name' => 'Comercio y Distribución B2B',
                    'slug' => 'comercio-b2b',
                    'description' => 'Solución integral para mayoristas, distribuidoras y comercios con venta recurrente por volumen. Incluye catálogo interactivo, cobros online con webhooks, facturación automática con AFIP y control de depósitos.',
                    'target_audience' => 'Mayoristas, distribuidoras, comercios con venta por volumen',
                    'total_hours' => 202.00,
                    'price_min_usd' => 4500.00,
                    'price_max_usd' => 5200.00,
                    'monthly_maintenance_usd' => 320.00,
                    'is_active' => true,
                    'sort_order' => 1,
                ],
                'mandatory_slugs' => $coreSlugs,
                'additional_slugs' => [
                    'catalog-cart-commerce',
                    'raw-materials-multi-warehouse',
                    'payment-gateway-integration',
                    'afip-invoicing-integration',
                ],
            ],
            [
                'pack' => [
                    'name' => 'Industria y Control de Planta',
                    'slug' => 'industria-planta',
                    'description' => 'Digitalización operativa completa para fábricas, bodegas y plantas industriales. Control de materias primas, trazabilidad con códigos QR en línea, ensayos de calidad ISO y mantenimiento preventivo de máquinas.',
                    'target_audience' => 'Fábricas, bodegas, talleres metalmecánicos, plantas de áridos',
                    'total_hours' => 268.00,
                    'price_min_usd' => 6200.00,
                    'price_max_usd' => 7200.00,
                    'monthly_maintenance_usd' => 420.00,
                    'is_active' => true,
                    'sort_order' => 2,
                ],
                'mandatory_slugs' => $coreSlugs,
                'additional_slugs' => [
                    'raw-materials-multi-warehouse',
                    'production-orders-traceability',
                    'plant-quality-control',
                    'cmms-machine-maintenance',
                    'digital-signature-service-orders',
                    'contractors-epp-management',
                ],
            ],
            [
                'pack' => [
                    'name' => 'Gestión de Servicios y Consultoría',
                    'slug' => 'servicios-consultoria',
                    'description' => 'Plataforma para empresas que venden horas profesionales o abonos mensuales. Mesa de ayuda con tickets SLA, registro de horas por colaborador, contratos recurrentes y actas firmadas en tablet.',
                    'target_audience' => 'Empresas de mantenimiento, estudios contables/jurídicos, consultoras técnicas',
                    'total_hours' => 238.00,
                    'price_min_usd' => 5200.00,
                    'price_max_usd' => 6200.00,
                    'monthly_maintenance_usd' => 350.00,
                    'is_active' => true,
                    'sort_order' => 3,
                ],
                'mandatory_slugs' => $coreSlugs,
                'additional_slugs' => [
                    'client-portal-helpdesk-sla',
                    'time-tracking-billable-hours',
                    'service-contracts-recurring-billing',
                    'digital-signature-service-orders',
                    'appointment-booking-calendar',
                ],
            ],
            [
                'pack' => [
                    'name' => 'Cumplimiento Ambiental y Licencias',
                    'slug' => 'cumplimiento-ambiental',
                    'description' => 'Diseñado para consultoras y operadores sujetos a auditorías ambientales periódicas. Registro de muestras de agua/aire/suelo, matriz de resoluciones legales y generación formal de reportes de huella de carbono en PDF.',
                    'target_audience' => 'Consultoras ambientales, petroleras, mineras, plantas con inspecciones',
                    'total_hours' => 186.00,
                    'price_min_usd' => 4200.00,
                    'price_max_usd' => 4800.00,
                    'monthly_maintenance_usd' => 300.00,
                    'is_active' => true,
                    'sort_order' => 4,
                ],
                'mandatory_slugs' => $coreSlugs,
                'additional_slugs' => [
                    'environmental-measurements',
                    'environmental-legal-matrix',
                    'environmental-reports-carbon',
                ],
            ],
        ];

        foreach ($packsData as $data) {
            $pack = CommercialPack::updateOrCreate(
                ['slug' => $data['pack']['slug']],
                $data['pack']
            );

            // Sincronizar features
            $syncData = [];

            $mandatoryFeatures = Feature::whereIn('slug', $data['mandatory_slugs'])->get();
            foreach ($mandatoryFeatures as $feat) {
                $syncData[$feat->id] = ['is_mandatory' => true];
            }

            $additionalFeatures = Feature::whereIn('slug', $data['additional_slugs'])->get();
            foreach ($additionalFeatures as $feat) {
                $syncData[$feat->id] = ['is_mandatory' => false];
            }

            $pack->features()->sync($syncData);
        }
    }
}
