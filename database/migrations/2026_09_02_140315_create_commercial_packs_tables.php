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
        Schema::create('commercial_packs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('target_audience')->nullable();
            $table->decimal('total_hours', 8, 2)->default(0);
            $table->decimal('price_min_usd', 10, 2)->default(0);
            $table->decimal('price_max_usd', 10, 2)->default(0);
            $table->decimal('monthly_maintenance_usd', 10, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('commercial_pack_feature', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commercial_pack_id')->constrained('commercial_packs')->cascadeOnDelete();
            $table->foreignId('feature_id')->constrained('features')->cascadeOnDelete();
            $table->boolean('is_mandatory')->default(false);
            $table->timestamps();

            $table->unique(['commercial_pack_id', 'feature_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commercial_pack_feature');
        Schema::dropIfExists('commercial_packs');
    }
};
