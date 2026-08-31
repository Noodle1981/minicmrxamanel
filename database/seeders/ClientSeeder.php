<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\User;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $vendedor = User::where('email', 'ventas@grupoxamanen.com.ar')->first();
        $clienteUser = User::where('email', 'contacto@mineraandina.com')->first();

        $clients = [
            [
                'user_id' => $clienteUser ? $clienteUser->id : null,
                'created_by' => $vendedor ? $vendedor->id : null,
                'company_name' => 'Minera Los Andes S.A.',
                'contact_name' => 'Ing. Carlos Mendoza',
                'email' => 'contacto@mineraandina.com',
                'phone' => '+54 264 421-9988',
                'industry' => 'mineria',
                'cuit_tax_id' => '30-71458962-4',
                'address' => 'Av. Libertador San Martín 1540, San Juan',
                'notes' => 'Requiere plataforma de telemetría de flota de camiones y monitoreo de polvos en faena cordillerana.',
            ],
            [
                'user_id' => null,
                'created_by' => $vendedor ? $vendedor->id : null,
                'company_name' => 'EcoGestión San Juan Consultora Ambiental',
                'contact_name' => 'Lic. Mariana Fernández',
                'email' => 'mfernandez@ecogestionsj.com.ar',
                'phone' => '+54 264 492-3341',
                'industry' => 'medio_ambiente',
                'cuit_tax_id' => '30-70899451-2',
                'address' => 'Calle Laprida 450 Oeste, San Juan',
                'notes' => 'Necesitan software de matrices legales ambientales y generación de informes de huella hídrica y de carbono.',
            ],
            [
                'user_id' => null,
                'created_by' => $vendedor ? $vendedor->id : null,
                'company_name' => 'Ferretería Industrial Cuyo SRL',
                'contact_name' => 'Esteban Garay',
                'email' => 'ventas@ferreteriacuyo.com',
                'phone' => '+54 264 420-1122',
                'industry' => 'comercio',
                'cuit_tax_id' => '30-65882194-9',
                'address' => 'Lateral de Circunvalación 890, Santa Lucía, San Juan',
                'notes' => 'B2B E-commerce con listas de precios diferenciadas por gremio e integración de facturación AFIP.',
            ],
        ];

        foreach ($clients as $clientData) {
            Client::firstOrCreate(['email' => $clientData['email']], $clientData);
        }
    }
}
