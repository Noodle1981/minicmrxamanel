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
        // 1. Roles
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // super_admin, vendedor, cliente, desarrollador, disenador, qa_tester, validador
            $table->string('display_name');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 2. Role User (Pivote para multi-rol flexible)
        Schema::create('role_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('role_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['user_id', 'role_id']);
        });

        // 3. Modificación de Users
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->string('avatar_url')->nullable()->after('phone');
            $table->boolean('is_active')->default(true)->after('avatar_url');
        });

        // 4. Clientes (Mini-CRM)
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete(); // Para acceso al portal cliente
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete(); // Vendedor que registró
            $table->string('company_name');
            $table->string('contact_name');
            $table->string('email')->index();
            $table->string('phone')->nullable();
            $table->string('industry')->default('mineria')->index(); // mineria, medio_ambiente, comercio, servicios, otro
            $table->string('cuit_tax_id')->nullable();
            $table->string('address')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 5. Tipos de Software
        Schema::create('software_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->decimal('base_hours_dev', 8, 2)->default(0);
            $table->decimal('base_hours_qa', 8, 2)->default(0);
            $table->decimal('base_price_infrastructure', 10, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // 6. Features / Módulos Técnicos (CPQ)
        Schema::create('features', function (Blueprint $table) {
            $table->id();
            $table->foreignId('software_type_id')->nullable()->constrained()->nullOnDelete();
            $table->string('category')->index(); // Seguridad & Acceso, Monitoreo & Telemetría, Gestión & Operaciones, Integraciones & APIs, etc.
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('hours_dev', 6, 2)->default(0); // Horas de codificación base
            $table->decimal('hours_integration', 6, 2)->default(0); // Horas de arquitectura e integración
            $table->decimal('hours_testing_qa', 6, 2)->default(0); // Horas de testing, QA y validación
            $table->decimal('cost_setup_infra', 10, 2)->default(0); // Costo inicial de setup/infra
            $table->decimal('cost_monthly_infra', 10, 2)->default(0); // Costo mensual estimado de infraestructura
            $table->boolean('is_preset_mining')->default(false)->index();
            $table->boolean('is_preset_environment')->default(false)->index();
            $table->boolean('is_preset_commerce')->default(false)->index();
            $table->boolean('is_recommended')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 7. Presupuestos / Cotizaciones (Quotes)
        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->string('quote_number')->unique();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->foreignId('software_type_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->string('title');
            $table->string('preset_used')->nullable(); // mineria, medio_ambiente, comercio, personalizado
            $table->string('status')->default('draft')->index(); // draft, sent, under_review, accepted, rejected, expired
            $table->string('currency', 3)->default('USD');
            $table->decimal('hourly_rate', 8, 2)->default(35.00);
            $table->decimal('total_hours_dev', 8, 2)->default(0);
            $table->decimal('total_hours_integration', 8, 2)->default(0);
            $table->decimal('total_hours_qa', 8, 2)->default(0);
            $table->decimal('total_hours', 8, 2)->default(0);
            $table->decimal('subtotal_development', 12, 2)->default(0);
            $table->decimal('subtotal_infrastructure_setup', 12, 2)->default(0);
            $table->decimal('subtotal_infrastructure_monthly', 12, 2)->default(0);
            $table->decimal('discount_percentage', 5, 2)->default(0);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->decimal('team_capacity_hours_per_day', 5, 2)->default(8.00);
            $table->integer('estimated_business_days')->default(1);
            $table->date('estimated_start_date')->nullable();
            $table->date('estimated_delivery_date')->nullable();
            $table->text('notes')->nullable();
            $table->text('terms_conditions')->nullable();
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->date('valid_until')->nullable();
            $table->timestamps();
        });

        // 8. Ítems del Presupuesto (Quote Items)
        Schema::create('quote_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quote_id')->constrained()->cascadeOnDelete();
            $table->foreignId('feature_id')->nullable()->constrained()->nullOnDelete();
            $table->string('category');
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('hours_dev', 6, 2)->default(0);
            $table->decimal('hours_integration', 6, 2)->default(0);
            $table->decimal('hours_testing_qa', 6, 2)->default(0);
            $table->decimal('total_hours', 6, 2)->default(0);
            $table->decimal('cost_setup_infra', 10, 2)->default(0);
            $table->decimal('cost_monthly_infra', 10, 2)->default(0);
            $table->decimal('price', 10, 2)->default(0);
            $table->timestamps();
        });

        // 9. Proyectos (Generados a partir de cotizaciones aceptadas)
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quote_id')->nullable()->unique()->constrained()->nullOnDelete();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->foreignId('manager_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('status')->default('pending_start')->index(); // pending_start, in_development, testing_validation, delivered, paused, cancelled
            $table->string('priority')->default('medium')->index(); // low, medium, high, critical
            $table->date('start_date')->nullable();
            $table->date('due_date')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->integer('progress_percentage')->default(0);
            $table->timestamps();
        });

        // 10. Tickets de Trabajo Operativo
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('quote_item_id')->nullable()->constrained()->nullOnDelete();
            $table->string('ticket_number');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('status')->default('backlog')->index(); // backlog, todo, in_progress, testing_qa, validated, done
            $table->string('type')->default('feature')->index(); // feature, bug, integration, infrastructure, design
            $table->string('priority')->default('medium')->index(); // low, medium, high, urgent
            $table->decimal('estimated_hours', 6, 2)->default(0);
            $table->decimal('logged_hours', 6, 2)->default(0);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // 11. Asignaciones de Tickets (Multi-rol flexible)
        Schema::create('ticket_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('role_in_ticket')->default('desarrollador'); // desarrollador, disenador, qa_tester, validador
            $table->timestamp('assigned_at')->useCurrent();
            $table->timestamps();
            $table->unique(['ticket_id', 'user_id', 'role_in_ticket']);
        });

        // 12. Comentarios y Notas Internas (Polimórfico)
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->morphs('commentable'); // Ticket, Quote, Project
            $table->text('content');
            $table->boolean('is_internal')->default(false); // false = visible para cliente, true = solo equipo interno
            $table->timestamps();
        });

        // 13. Archivos Adjuntos (Polimórfico)
        Schema::create('attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->morphs('attachable'); // Ticket, Quote, Project
            $table->string('file_name');
            $table->string('file_path');
            $table->unsignedBigInteger('file_size');
            $table->string('mime_type');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attachments');
        Schema::dropIfExists('comments');
        Schema::dropIfExists('ticket_assignments');
        Schema::dropIfExists('tickets');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('quote_items');
        Schema::dropIfExists('quotes');
        Schema::dropIfExists('features');
        Schema::dropIfExists('software_types');
        Schema::dropIfExists('clients');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'avatar_url', 'is_active']);
        });

        Schema::dropIfExists('role_user');
        Schema::dropIfExists('roles');
    }
};
