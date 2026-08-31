<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Quote;
use App\Models\User;
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
        Carbon::setLocale('es');

        $year = (int) $request->input('year', Carbon::now()->year);
        $monthNum = (int) $request->input('month', Carbon::now()->month);

        // Validar rangos de mes y año
        if ($monthNum < 1 || $monthNum > 12) {
            $monthNum = Carbon::now()->month;
        }
        if ($year < 2020 || $year > 2035) {
            $year = Carbon::now()->year;
        }

        $monthStr = sprintf('%04d-%02d', $year, $monthNum);
        $startOfMonth = Carbon::createFromDate($year, $monthNum, 1)->startOfMonth();
        $endOfMonth = $startOfMonth->copy()->endOfMonth();

        // Consulta base de proyectos
        $projectsQuery = Project::with(['client', 'manager', 'quote.creator', 'tickets.assignments.user'])
            ->where(function ($q) use ($startOfMonth, $endOfMonth) {
                $q->whereBetween('due_date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
                    ->orWhereBetween('start_date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
                    ->orWhere(function ($subQ) use ($startOfMonth, $endOfMonth) {
                        $subQ->where('start_date', '<=', $startOfMonth->toDateString())
                            ->where('due_date', '>=', $endOfMonth->toDateString());
                    });
            });

        // Filtro por proyecto específico o término de búsqueda
        if ($request->filled('project_id')) {
            $projectsQuery->where('id', $request->project_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $projectsQuery->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhereHas('client', fn($cq) => $cq->where('company_name', 'like', "%{$search}%"));
            });
        }

        // Filtro por Vendedor (Creador de cotización o Project Manager)
        if ($request->filled('seller_id')) {
            $sellerId = $request->seller_id;
            $projectsQuery->where(function ($q) use ($sellerId) {
                $q->where('manager_id', $sellerId)
                    ->orWhereHas('quote', fn($qq) => $qq->where('created_by', $sellerId));
            });
        }

        $projects = $projectsQuery->get();

        // Cotizaciones que vencen en el mes
        $quotesQuery = Quote::with(['client', 'creator'])
            ->whereBetween('valid_until', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
            ->whereIn('status', ['sent', 'under_review']);

        if ($request->filled('seller_id')) {
            $quotesQuery->where('created_by', $request->seller_id);
        }

        $quotesExpiring = $quotesQuery->get();

        // Días de la semana en español (ISO: 1 = Lunes, 7 = Domingo)
        $dayNamesEs = [
            1 => 'Lunes',
            2 => 'Martes',
            3 => 'Miércoles',
            4 => 'Jueves',
            5 => 'Viernes',
            6 => 'Sábado',
            7 => 'Domingo',
        ];

        $dayShortNamesEs = [
            1 => 'Lun',
            2 => 'Mar',
            3 => 'Mié',
            4 => 'Jue',
            5 => 'Vie',
            6 => 'Sáb',
            7 => 'Dom',
        ];

        $monthNamesEs = [
            1 => 'Enero',
            2 => 'Febrero',
            3 => 'Marzo',
            4 => 'Abril',
            5 => 'Mayo',
            6 => 'Junio',
            7 => 'Julio',
            8 => 'Agosto',
            9 => 'Septiembre',
            10 => 'Octubre',
            11 => 'Noviembre',
            12 => 'Diciembre',
        ];

        // Rellenar días anteriores para alinear con el primer día de la semana (Lunes)
        $firstDayOfWeek = (int) $startOfMonth->isoWeekday(); // 1 = Lunes, 7 = Domingo
        $paddingDaysStart = $firstDayOfWeek - 1; // cuántos días vacíos antes del día 1

        $daysInMonth = [];

        // Días previos de relleno (del mes anterior)
        if ($paddingDaysStart > 0) {
            $prevMonthDay = $startOfMonth->copy()->subDays($paddingDaysStart);
            for ($i = 0; $i < $paddingDaysStart; $i++) {
                $daysInMonth[] = [
                    'date' => $prevMonthDay->toDateString(),
                    'day_number' => $prevMonthDay->day,
                    'day_name' => $dayShortNamesEs[$prevMonthDay->isoWeekday()],
                    'is_current_month' => false,
                    'is_weekend' => $prevMonthDay->isWeekend(),
                    'is_today' => $prevMonthDay->isToday(),
                    'daily_hours' => 0,
                    'load_level' => 'none',
                    'projects' => [],
                    'expiring_quotes' => [],
                ];
                $prevMonthDay->addDay();
            }
        }

        $currentDate = $startOfMonth->copy();

        while ($currentDate <= $endOfMonth) {
            $isWeekend = $currentDate->isWeekend();
            $dateStr = $currentDate->toDateString();
            $isoWeekday = (int) $currentDate->isoWeekday();

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
                            'client' => $prj->client->company_name ?? 'Sin Cliente',
                            'hours' => $hoursForDay,
                            'status' => $prj->status,
                            'is_due_date' => $dateStr === $prj->due_date->toDateString(),
                        ];
                    }
                }
            }

            // Nivel de carga
            $loadLevel = 'none';
            if (!$isWeekend) {
                if ($dailyHours === 0.0) {
                    $loadLevel = 'free';
                } elseif ($dailyHours < 6.0) {
                    $loadLevel = 'low';
                } elseif ($dailyHours <= 8.5) {
                    $loadLevel = 'optimal';
                } else {
                    $loadLevel = 'high';
                }
            }

            $daysInMonth[] = [
                'date' => $dateStr,
                'day_number' => $currentDate->day,
                'day_name' => $dayShortNamesEs[$isoWeekday],
                'is_current_month' => true,
                'is_weekend' => $isWeekend,
                'is_today' => $currentDate->isToday(),
                'daily_hours' => $dailyHours,
                'load_level' => $loadLevel,
                'projects' => $dayProjects,
                'expiring_quotes' => $quotesExpiring->where('valid_until', $dateStr)->values(),
            ];

            $currentDate->addDay();
        }

        // Rellenar días posteriores para completar cuadrícula de 7 columnas
        $totalCells = count($daysInMonth);
        $remainder = $totalCells % 7;
        if ($remainder > 0) {
            $paddingDaysEnd = 7 - $remainder;
            $nextMonthDay = $endOfMonth->copy()->addDay();
            for ($i = 0; $i < $paddingDaysEnd; $i++) {
                $daysInMonth[] = [
                    'date' => $nextMonthDay->toDateString(),
                    'day_number' => $nextMonthDay->day,
                    'day_name' => $dayShortNamesEs[$nextMonthDay->isoWeekday()],
                    'is_current_month' => false,
                    'is_weekend' => $nextMonthDay->isWeekend(),
                    'is_today' => $nextMonthDay->isToday(),
                    'daily_hours' => 0,
                    'load_level' => 'none',
                    'projects' => [],
                    'expiring_quotes' => [],
                ];
                $nextMonthDay->addDay();
            }
        }

        // Listado de proyectos y vendedores para los filtros
        $allProjects = Project::select('id', 'name', 'code')->orderBy('name')->get();
        $sellers = User::whereHas('roles', function ($q) {
            $q->whereIn('name', ['vendedor', 'super_admin']);
        })->select('id', 'name', 'email')->orderBy('name')->get();

        $monthNameEs = $monthNamesEs[$monthNum] . ' ' . $year;

        $currentMonthDays = collect($daysInMonth)->where('is_current_month', true);

        return Inertia::render('Calendar/Index', [
            'year' => $year,
            'month' => $monthNum,
            'monthName' => $monthNameEs,
            'daysInMonth' => $daysInMonth,
            'allProjects' => $allProjects,
            'sellers' => $sellers,
            'filters' => [
                'year' => $year,
                'month' => $monthNum,
                'project_id' => $request->project_id ? (int) $request->project_id : null,
                'seller_id' => $request->seller_id ? (int) $request->seller_id : null,
                'search' => $request->search ?? '',
            ],
            'summary' => [
                'total_business_days' => $currentMonthDays->where('is_weekend', false)->count(),
                'avg_daily_load' => round($currentMonthDays->where('is_weekend', false)->avg('daily_hours'), 1),
                'active_projects_count' => $projects->count(),
            ],
        ]);
    }
}
