<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Project;
use App\Models\User;
use App\Services\ProjectService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    protected ProjectService $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    /**
     * Listado de Proyectos Operativos
     */
    public function index(Request $request): Response
    {
        $query = Project::with(['client', 'manager', 'quote.softwareType'])
            ->withCount([
                'tickets',
                'tickets as completed_tickets_count' => function ($q) {
                    $q->where('status', 'done');
                },
            ])
            ->latest();

        // Filtro por estado
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filtro por cliente
        if ($request->filled('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        // Búsqueda
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%")
                    ->orWhereHas('client', function ($cq) use ($search) {
                        $cq->where('company_name', 'like', "%{$search}%");
                    });
            });
        }

        $projects = $query->paginate(10)->withQueryString();

        $metrics = [
            'total_projects' => Project::count(),
            'in_development' => Project::where('status', 'in_development')->count(),
            'testing_validation' => Project::where('status', 'testing_validation')->count(),
            'delivered' => Project::where('status', 'delivered')->count(),
        ];

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'filters' => $request->only(['status', 'client_id', 'search']),
            'clients' => Client::select('id', 'company_name')->orderBy('company_name')->get(),
            'metrics' => $metrics,
        ]);
    }

    /**
     * Ficha Integral del Proyecto (Detalle, tickets, equipo y comentarios)
     */
    public function show(Project $project): Response
    {
        $project->load([
            'client',
            'manager',
            'quote.items.feature',
            'tickets' => function ($q) {
                $q->with(['assignments.user', 'assignees'])->orderBy('sort_order');
            },
            'comments.user',
            'attachments.user',
        ]);

        // Recalcular horas totales y registradas
        $totalEstimatedHours = (float) $project->tickets->sum('estimated_hours');
        $totalLoggedHours = (float) $project->tickets->sum('logged_hours');

        // Usuarios técnicos para modal de asignación
        $technicalUsers = User::whereHas('roles', function ($q) {
            $q->whereIn('name', ['desarrollador', 'disenador', 'qa_tester', 'validador', 'super_admin']);
        })->with('roles')->get();

        return Inertia::render('Projects/Show', [
            'project' => $project,
            'stats' => [
                'total_tickets' => $project->tickets->count(),
                'done_tickets' => $project->tickets->where('status', 'done')->count(),
                'total_estimated_hours' => $totalEstimatedHours,
                'total_logged_hours' => $totalLoggedHours,
            ],
            'technicalUsers' => $technicalUsers,
        ]);
    }

    /**
     * Actualizar estado del proyecto
     */
    public function updateStatus(Request $request, Project $project)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending_start,in_development,testing_validation,delivered,paused,cancelled',
            'priority' => 'nullable|in:low,medium,high,critical',
            'progress_percentage' => 'nullable|integer|min:0|max:100',
        ]);

        $project->update($validated);

        return back()->with('success', 'Estado del proyecto actualizado.');
    }
}
