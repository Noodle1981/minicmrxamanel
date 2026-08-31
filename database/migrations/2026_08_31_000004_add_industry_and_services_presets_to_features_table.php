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
            $table->boolean('is_preset_industry')->default(false)->after('is_preset_commerce')->index();
            $table->boolean('is_preset_services')->default(false)->after('is_preset_industry')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('features', function (Blueprint $table) {
            $table->dropColumn(['is_preset_industry', 'is_preset_services']);
        });
    }
};
