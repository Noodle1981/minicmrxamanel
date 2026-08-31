<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Quote;
use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CalendarController extends Controller
{
    /**
     * Calendario de Disponibilidad Laboral y Carga de Trabajo (Lunes a Viernes)
     */
    public function index(Request $request): Response
    {
        $month = $request->input('month', Carbon::now()->format('Y-m'));
        $startOfMonth = Carbon::parse($month . '-01')->startOfMonth();
        $endOfMonth = $startOfMonth->copy()->endOfMonth();

        // Proyectos activos con entregas o desarrollo en este mes
        $projects = Project::with(['client', 'tickets.assignments.user'])
            ->where(function ($q) use ($startOfMonth, $endOfMonth) {
                $q->whereBetween('due_date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
                    ->orWhereBetween('start_date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
                    ->orWhere(function ($subQ) use ($startOfMonth, $endOfMonth) {
                        $subQ->where('start_date', '<=', $startOfMonth->toDateString())
                            ->where('due_date', '>=', $endOfMonth->toDateString());
                    });
            })
            ->get();

        // Cotizaciones pendientes de vencer en este mes
        $quotesExpiring = Quote::with('client')
            ->whereBetween('valid_until', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
            ->whereIn('status', ['sent', 'under_review'])
            ->get();

        // Generar matriz de días del mes con cálculo de horas asignadas
        $daysInMonth = [];
        $currentDate = $startOfMonth->copy();

        // Capacidad base del equipo (ej. 8 hs/día)
        $dailyCapacity = 8.0;

        while ($currentDate <= $endOfMonth) {
            $isWeekend = $currentDate->isWeekend();
            $dateStr = $currentDate->toDateString();

            // Calcular carga diaria en base a proyectos activos en esa fecha
            $dailyHours = 0.0;
            $dayProjects = [];

            if (!$isWeekend) {
                foreach ($projects as $prj) {
                    $pStart = Carbon::parse($prj->start_date);
                    $pDue = Carbon::parse($prj->due_date);

                    if ($currentDate->between($pStart, $pDue)) {
                        $totalPrjHours = (float) $prj->tickets->sum('estimated_hours');
                        $prjDays = max(1, $pStart->diffInDaysFiltered(fn(Carbon $d) => !$d->isWeekend(), $pDue));
                        $hoursForDay = round($totalPrjHours / $prjDays, 1);
                        $dailyHours += $hoursForDay;

                        $dayProjects[] = [
                            'id' => $prj->id,
                            'name' => $prj->name,
                            'code' => $prj->code,
                            'client' => $prj->client->company_name,
                            'hours' => $hoursForDay,
                            'status' => $prj->status,
                            'is_due_date' => $dateStr === $prj->due_date,
                        ];
                    }
                }
            }

            // Nivel de carga
            $loadLevel = 'none'; // fin de semana o sin carga
            if (!$isWeekend) {
                if ($dailyHours === 0.0) {
                    $loadLevel = 'free'; // disponible
                } elseif ($dailyHours < 6.0) {
                    $loadLevel = 'low';
                } elseif ($dailyHours <= 8.5) {
                    $loadLevel = 'optimal';
                } else {
                    $loadLevel = 'high'; // sobrecarga
                }
            }

            $daysInMonth[] = [
                'date' => $dateStr,
                'day_number' => $currentDate->day,
                'day_name' => $currentDate->translatedFormat('D'),
                'is_weekend' => $isWeekend,
                'is_today' => $currentDate->isToday(),
                'daily_hours' => $dailyHours,
                'load_level' => $loadLevel,
                'projects' => $dayProjects,
                'expiring_quotes' => $quotesExpiring->where('valid_until', $dateStr)->values(),
            ];

            $currentDate->addDay();
        }

        return Inertia::render('Calendar/Index', [
            'month' => $month,
            'monthName' => $startOfMonth->translatedFormat('F Y'),
            'daysInMonth' => $daysInMonth,
            'projects' => $projects,
            'summary' => [
                'total_business_days' => collect($daysInMonth)->where('is_weekend', false)->count(),
                'avg_daily_load' => round(collect($daysInMonth)->where('is_weekend', false)->avg('daily_hours'), 1),
                'active_projects_count' => $projects->count(),
            ],
        ]);
    }
}
