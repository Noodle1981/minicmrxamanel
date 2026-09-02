<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('features', function (Blueprint $table) {
            $table->string('feasibility_status')->default('verde')->after('is_recommended')->index();
            $table->text('feasibility_condition')->nullable()->after('feasibility_status');
            $table->text('contingency_script')->nullable()->after('feasibility_condition');
        });

        // 1. ZONA AMARILLA (Precaución / Requiere Aprobación o Condiciones)
        DB::table('features')->where('slug', 'payment-gateway-integration')->update([
            'feasibility_status' => 'amarillo',
            'feasibility_condition' => 'Requiere cuenta bancaria o de Mercado Pago / Stripe validada y con credenciales de producción provistas por el cliente.',
        ]);

        DB::table('features')->where('slug', 'afip-invoicing-integration')->update([
            'feasibility_status' => 'amarillo',
            'feasibility_condition' => 'El cliente debe proveer CUIT, clave fiscal y delegar certificados fiscales (CSR/alias fiscal en AFIP) a tiempo.',
        ]);

        DB::table('features')->where('slug', 'production-orders-traceability')->update([
            'feasibility_status' => 'amarillo',
            'feasibility_condition' => 'Exige mapeo previo de los estados de fabricación y flujos operativos de planta antes de iniciar el desarrollo.',
        ]);

        DB::table('features')->where('slug', 'service-contracts-recurring-billing')->update([
            'feasibility_status' => 'amarillo',
            'feasibility_condition' => 'Exige definición clara de días de corte, políticas de recargo por mora y ciclos de facturación acordados.',
        ]);

        DB::table('features')->where('slug', 'appointment-booking-calendar')->update([
            'feasibility_status' => 'amarillo',
            'feasibility_condition' => 'Solo turnos en plataforma interna con exportación de archivos .ics; no incluye sincronización bidireccional compleja con APIs de calendarios externos.',
        ]);

        // 2. ZONA ROJA (Prohibido Vender / Rechazo Obligatorio - Alto Riesgo Técnico)
        DB::table('features')->where('slug', 'iot-sensors-mining')->update([
            'feasibility_status' => 'rojo',
            'contingency_script' => 'Nosotros implementamos el sistema de gestión operativa (CMMS y Calidad). Los operarios registran paradas y métricas desde tablets en planta en 5 segundos. No realizamos cableado ni conexiones eléctricas a PLC para no alterar las garantías de sus maquinarias.',
        ]);

        DB::table('features')->where('slug', 'gis-geofencing-mining')->update([
            'feasibility_status' => 'rojo',
            'contingency_script' => 'El cálculo cartográfico satelital en tiempo real presenta desvíos por cobertura GPS de faena y costos elevados por peticiones de APIs. Proveemos geolocalización por puntos de control fijos y registro de coordenadas al inicio/fin de turnos.',
        ]);

        DB::table('features')->where('slug', 'offline-sync-mobile')->update([
            'feasibility_status' => 'rojo',
            'contingency_script' => 'Nuestra plataforma está optimizada para cargar de forma ultra liviana con conexión móvil 3G/4G. Para zonas sin señal, implementamos un esquema ágil donde el técnico completa la planilla base y la sube en un clic al retornar al campamento o zona Wi-Fi, asegurando que ningún dato se sobreescriba ni se pierda.',
        ]);

        DB::table('features')->where('slug', 'logistics-shipping-api')->update([
            'feasibility_status' => 'rojo',
            'contingency_script' => 'Para evitar que una caída del servidor del correo te deje sin ventas en el checkout, configuramos un cotizador por zonas y código postal con tarifas preestablecidas o retiro en sucursal. Es mucho más rápido y no frustra al comprador.',
        ]);

        DB::table('features')->where('slug', 'ai-chatbot-whatsapp')->update([
            'feasibility_status' => 'rojo',
            'contingency_script' => 'Para proteger tu línea comercial contra bloqueos de Meta y evitar costos sorpresa por mensaje, integramos un botón directo a WhatsApp con mensaje predeterminado y un motor de notificaciones automáticas por Email y Web Push para que no pierdas ninguna consulta.',
        ]);

        DB::table('features')->where('slug', 'iot-oee-factory-sensors')->update([
            'feasibility_status' => 'rojo',
            'contingency_script' => 'Nosotros implementamos el sistema de gestión operativa (CMMS y Calidad). Los operarios registran paradas y métricas desde tablets en planta en 5 segundos. No realizamos cableado ni conexiones eléctricas a PLC para no alterar las garantías de sus maquinarias.',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('features', function (Blueprint $table) {
            $table->dropColumn(['feasibility_status', 'feasibility_condition', 'contingency_script']);
        });
    }
};
