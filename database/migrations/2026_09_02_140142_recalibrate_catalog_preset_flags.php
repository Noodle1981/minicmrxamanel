<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Quitar módulos de Zona Roja de sus presets
        // Telemetría en tiempo real: fuera de Minería
        DB::table('features')->where('slug', 'iot-sensors-mining')->update([
            'is_preset_mining' => false,
            'is_recommended' => false,
        ]);

        // GIS Satelital y Geofencing: fuera de Minería
        DB::table('features')->where('slug', 'gis-geofencing-mining')->update([
            'is_preset_mining' => false,
            'is_recommended' => false,
        ]);

        // Sincronización Offline-First: fuera de Minería, Medio Ambiente e Industria
        DB::table('features')->where('slug', 'offline-sync-mobile')->update([
            'is_preset_mining' => false,
            'is_preset_environment' => false,
            'is_preset_industry' => false,
            'is_recommended' => false,
        ]);

        // Integración Logística: fuera de Comercio
        DB::table('features')->where('slug', 'logistics-shipping-api')->update([
            'is_preset_commerce' => false,
            'is_recommended' => false,
        ]);

        // Chatbot WhatsApp: fuera de Comercio y Servicios
        DB::table('features')->where('slug', 'ai-chatbot-whatsapp')->update([
            'is_preset_commerce' => false,
            'is_preset_services' => false,
            'is_recommended' => false,
        ]);

        // Sensores IoT OEE de Planta: fuera de Industria
        DB::table('features')->where('slug', 'iot-oee-factory-sensors')->update([
            'is_preset_industry' => false,
            'is_recommended' => false,
        ]);

        // 2. Módulos Zona Amarilla: mantener en preset pero marcar is_recommended = false
        DB::table('features')->where('slug', 'payment-gateway-integration')->update([
            'is_recommended' => false,
        ]);

        DB::table('features')->where('slug', 'afip-invoicing-integration')->update([
            'is_recommended' => false,
        ]);

        DB::table('features')->where('slug', 'production-orders-traceability')->update([
            'is_recommended' => false,
        ]);

        DB::table('features')->where('slug', 'service-contracts-recurring-billing')->update([
            'is_recommended' => false,
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('features')->where('slug', 'iot-sensors-mining')->update([
            'is_preset_mining' => true,
            'is_recommended' => true,
        ]);

        DB::table('features')->where('slug', 'gis-geofencing-mining')->update([
            'is_preset_mining' => true,
        ]);

        DB::table('features')->where('slug', 'offline-sync-mobile')->update([
            'is_preset_mining' => true,
            'is_preset_environment' => true,
            'is_preset_industry' => true,
            'is_recommended' => true,
        ]);

        DB::table('features')->where('slug', 'logistics-shipping-api')->update([
            'is_preset_commerce' => true,
        ]);

        DB::table('features')->where('slug', 'ai-chatbot-whatsapp')->update([
            'is_preset_commerce' => true,
            'is_preset_services' => true,
        ]);

        DB::table('features')->where('slug', 'iot-oee-factory-sensors')->update([
            'is_preset_industry' => true,
        ]);

        DB::table('features')->where('slug', 'payment-gateway-integration')->update([
            'is_recommended' => true,
        ]);

        DB::table('features')->where('slug', 'afip-invoicing-integration')->update([
            'is_recommended' => true,
        ]);

        DB::table('features')->where('slug', 'production-orders-traceability')->update([
            'is_recommended' => true,
        ]);

        DB::table('features')->where('slug', 'service-contracts-recurring-billing')->update([
            'is_recommended' => true,
        ]);
    }
};
