<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superAdminRole = Role::where('name', 'super_admin')->first();
        $vendedorRole = Role::where('name', 'vendedor')->first();
        $clienteRole = Role::where('name', 'cliente')->first();
        $devRole = Role::where('name', 'desarrollador')->first();
        $qaRole = Role::where('name', 'qa_tester')->first();
        $designerRole = Role::where('name', 'disenador')->first();
        $validadorRole = Role::where('name', 'validador')->first();

        // 1. Super Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@grupoxamanen.com.ar'],
            [
                'name' => 'Administrador Xamanen',
                'password' => Hash::make('password'),
                'phone' => '+54 264 465-5342',
                'is_active' => true,
            ]
        );
        $admin->roles()->syncWithoutDetaching([$superAdminRole->id]);

        // 2. Vendedor
        $vendedor = User::firstOrCreate(
            ['email' => 'ventas@grupoxamanen.com.ar'],
            [
                'name' => 'Marcos Ventas',
                'password' => Hash::make('password'),
                'phone' => '+54 264 555-0199',
                'is_active' => true,
            ]
        );
        $vendedor->roles()->syncWithoutDetaching([$vendedorRole->id]);

        // 3. Usuario Técnico Multi-Rol (Desarrollador + QA + Validador)
        $techLead = User::firstOrCreate(
            ['email' => 'tech@grupoxamanen.com.ar'],
            [
                'name' => 'Agustín Tech Lead',
                'password' => Hash::make('password'),
                'phone' => '+54 264 555-0233',
                'is_active' => true,
            ]
        );
        $techLead->roles()->syncWithoutDetaching([
            $devRole->id,
            $qaRole->id,
            $validadorRole->id,
        ]);

        // 4. Diseñador UI/UX
        $designer = User::firstOrCreate(
            ['email' => 'design@grupoxamanen.com.ar'],
            [
                'name' => 'Lucía Diseñadora',
                'password' => Hash::make('password'),
                'phone' => '+54 264 555-0488',
                'is_active' => true,
            ]
        );
        $designer->roles()->syncWithoutDetaching([$designerRole->id]);

        // 5. Usuario Cliente
        $clienteUser = User::firstOrCreate(
            ['email' => 'contacto@mineraandina.com'],
            [
                'name' => 'Ing. Carlos Mendoza',
                'password' => Hash::make('password'),
                'phone' => '+54 264 421-9988',
                'is_active' => true,
            ]
        );
        $clienteUser->roles()->syncWithoutDetaching([$clienteRole->id]);
    }
}
