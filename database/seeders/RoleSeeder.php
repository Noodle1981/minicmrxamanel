<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'super_admin',
                'display_name' => 'Super Administrador',
                'description' => 'Acceso total al sistema, métricas financieras, configuración de parámetros y gestión de usuarios.',
            ],
            [
                'name' => 'vendedor',
                'display_name' => 'Ejecutivo Comercial / Ventas',
                'description' => 'Alta de prospectos, cotización de presupuestos interactivos y seguimiento comercial de clientes.',
            ],
            [
                'name' => 'desarrollador',
                'display_name' => 'Desarrollador Full-Stack',
                'description' => 'Miembro del equipo técnico para construcción de features, integraciones y resolución de tickets.',
            ],
            [
                'name' => 'disenador',
                'display_name' => 'Diseñador UI/UX',
                'description' => 'Diseño de interfaces, wireframes y assets visuales bajo la identidad de marca.',
            ],
            [
                'name' => 'qa_tester',
                'display_name' => 'QA / Testing & Automatización',
                'description' => 'Ejecución de planes de prueba, control de calidad, verificación de endpoints y validación de aceptación.',
            ],
            [
                'name' => 'validador',
                'display_name' => 'Usuario Validador / Tech Lead',
                'description' => 'Aprobación final de entregables, revisión de arquitectura y validación de puesta en producción.',
            ],
        ];

        foreach ($roles as $roleData) {
            Role::firstOrCreate(['name' => $roleData['name']], $roleData);
        }
    }
}
