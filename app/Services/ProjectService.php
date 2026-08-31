<?php

namespace App\Services;

use App\Models\Project;
use App\Models\Quote;
use App\Models\Ticket;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ProjectService
{
    /**
     * Genera un proyecto operativo y sus tickets a partir de una cotización aprobada.
     */
    public function createProjectFromQuote(Quote $quote, ?User $manager = null): Project
    {
        return DB::transaction(function () use ($quote, $manager) {
            // Si ya existe un proyecto para esta cotización, retornarlo
            if ($quote->project) {
                return $quote->project;
            }

            // 1. Generar código de proyecto (ej. PRJ-2026-0001)
            $year = date('Y');
            $lastProject = Project::whereYear('created_at', $year)->orderBy('id', 'desc')->first();
            $nextNum = 1;
            if ($lastProject && preg_match('/PRJ-' . $year . '-(\d+)/', $lastProject->code, $m)) {
                $nextNum = (int) $m[1] + 1;
            }
            $projectCode = sprintf('PRJ-%s-%04d', $year, $nextNum);

            // 2. Crear Proyecto
            $project = Project::create([
                'quote_id' => $quote->id,
                'client_id' => $quote->client_id,
                'manager_id' => $manager ? $manager->id : $quote->created_by,
                'code' => $projectCode,
                'name' => $quote->title,
                'description' => "Proyecto originado a partir del presupuesto {$quote->quote_number}. Tipo: {$quote->software_type->name}.",
                'status' => 'pending_start',
                'priority' => 'high',
                'start_date' => $quote->estimated_start_date ?? Carbon::now()->toDateString(),
                'due_date' => $quote->estimated_delivery_date ?? Carbon::now()->addDays($quote->estimated_business_days)->toDateString(),
                'progress_percentage' => 0,
            ]);

            // 3. Generar Tickets a partir de los QuoteItems
            $quote->loadMissing('items.feature');
            $ticketOrder = 1;

            foreach ($quote->items as $item) {
                $ticketType = 'feature';
                if (stripos($item->category, 'Infraestructura') !== false || stripos($item->category, 'DevOps') !== false) {
                    $ticketType = 'infrastructure';
                } elseif (stripos($item->category, 'Integraciones') !== false || stripos($item->category, 'API') !== false) {
                    $ticketType = 'integration';
                } elseif (stripos($item->category, 'Diseño') !== false || stripos($item->category, 'UI') !== false) {
                    $ticketType = 'design';
                }

                $ticketNumber = sprintf('%s-T%02d', $project->code, $ticketOrder);

                Ticket::create([
                    'project_id' => $project->id,
                    'quote_item_id' => $item->id,
                    'ticket_number' => $ticketNumber,
                    'title' => $item->name,
                    'description' => $item->description ?: "Implementación y validación del módulo: {$item->name} ({$item->hours_dev}h Dev + {$item->hours_integration}h Int + {$item->hours_testing_qa}h QA).",
                    'status' => 'todo',
                    'type' => $ticketType,
                    'priority' => 'medium',
                    'estimated_hours' => $item->total_hours,
                    'logged_hours' => 0,
                    'sort_order' => $ticketOrder,
                ]);

                $ticketOrder++;
            }

            return $project;
        });
    }

    /**
     * Recalcula el porcentaje de avance de un proyecto en base a sus tickets completados.
     */
    public function recalculateProgress(Project $project): int
    {
        $totalTickets = $project->tickets()->count();
        if ($totalTickets === 0) {
            return 0;
        }

        $doneTickets = $project->tickets()->where('status', 'done')->count();
        $validatedTickets = $project->tickets()->where('status', 'validated')->count();
        $inProgressTickets = $project->tickets()->where('status', 'in_progress')->count();
        $testingTickets = $project->tickets()->where('status', 'testing_qa')->count();

        // Ponderación de avance
        $score = ($doneTickets * 1.0) + ($validatedTickets * 0.9) + ($testingTickets * 0.75) + ($inProgressTickets * 0.4);
        $percentage = (int) min(100, round(($score / $totalTickets) * 100));

        $status = $project->status;
        if ($percentage === 100) {
            $status = 'delivered';
        } elseif ($percentage > 0 && $status === 'pending_start') {
            $status = 'in_development';
        }

        $project->update([
            'progress_percentage' => $percentage,
            'status' => $status,
        ]);

        return $percentage;
    }
}
