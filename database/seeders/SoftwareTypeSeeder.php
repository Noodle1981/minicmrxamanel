<?php

namespace Database\Seeders;

use App\Models\SoftwareType;
use Illuminate\Database\Seeder;

class SoftwareTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            [
                'name' => 'Plataforma IoT & Telemetría Minera / HSE',
                'slug' => 'iot-mineria',
                'description' => 'Sistema web y móvil para captura de sensores, alertas críticas en tiempo real, mapas GIS y control ambiental en faena.',
                'icon' => 'HardHat',
                'base_hours_dev' => 24,
                'base_hours_qa' => 16,
                'base_price_infrastructure' => 180.00,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'Plataforma Web SaaS / Dashboard Administrativo',
                'slug' => 'saas-web',
                'description' => 'Aplicación web completa multi-tenant con paneles analíticos, gestión de usuarios, roles e integraciones API.',
                'icon' => 'LayoutDashboard',
                'base_hours_dev' => 20,
                'base_hours_qa' => 12,
                'base_price_infrastructure' => 90.00,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'Sistema de Gestión Operativa / ERP a Medida',
                'slug' => 'gestion-erp',
                'description' => 'Software a medida para automatizar logística, control de contratistas, inventario, RRHH y certificaciones ISO.',
                'icon' => 'Building2',
                'base_hours_dev' => 28,
                'base_hours_qa' => 18,
                'base_price_infrastructure' => 120.00,
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => 'E-Commerce & Portal B2B Transaccional',
                'slug' => 'ecommerce',
                'description' => 'Tienda online completa con pasarelas de pago, cálculo de envíos, gestión de catálogo y stock en tiempo real.',
                'icon' => 'ShoppingCart',
                'base_hours_dev' => 22,
                'base_hours_qa' => 14,
                'base_price_infrastructure' => 100.00,
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => 'App Móvil de Inspecciones y Operaciones (Offline-First)',
                'slug' => 'mobile-app',
                'description' => 'Aplicación móvil para operarios en terreno con sincronización offline, captura fotográfica y geolocalización GPS.',
                'icon' => 'Smartphone',
                'base_hours_dev' => 30,
                'base_hours_qa' => 20,
                'base_price_infrastructure' => 150.00,
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => 'Portal Corporativo & Lead Generation',
                'slug' => 'landing-corporate',
                'description' => 'Sitio web institucional de alto impacto visual con diseño Aurora Glass, formularios inteligentes y optimización SEO/Speed.',
                'icon' => 'Globe',
                'base_hours_dev' => 12,
                'base_hours_qa' => 8,
                'base_price_infrastructure' => 50.00,
                'is_active' => true,
                'sort_order' => 6,
            ],
        ];

        foreach ($types as $typeData) {
            SoftwareType::firstOrCreate(['slug' => $typeData['slug']], $typeData);
        }
    }
}
