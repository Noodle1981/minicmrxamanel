<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Project;
use App\Models\Ticket;
use App\Models\TicketAssignment;
use App\Models\User;
use App\Services\ProjectService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    protected ProjectService $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    /**
     * Tablero Kanban de Tickets y Tareas Técnicas
     */
    public function index(Request $request): Response
    {
        $query = Ticket::with(['project.client', 'assignments.user', 'assignees', 'comments.user'])
            ->orderBy('sort_order');

        // Filtro por proyecto
        if ($request->filled('project_id')) {
            $query->where('project_id', $request->project_id);
        }

        // Filtro por prioridad
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        // Filtro por tipo
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filtro por asignado
        if ($request->filled('user_id')) {
            $userId = $request->user_id;
            $query->whereHas('assignments', function ($aq) use ($userId) {
                $aq->where('user_id', $userId);
            });
        }

        $allTickets = $query->get();

        // Agrupar por columnas de Kanban
        $columns = [
            'backlog' => $allTickets->where('status', 'backlog')->values(),
            'todo' => $allTickets->where('status', 'todo')->values(),
            'in_progress' => $allTickets->where('status', 'in_progress')->values(),
            'testing_qa' => $allTickets->where('status', 'testing_qa')->values(),
            'validated' => $allTickets->where('status', 'validated')->values(),
            'done' => $allTickets->where('status', 'done')->values(),
        ];

        $projects = Project::select('id', 'name', 'code')->orderBy('name')->get();
        $technicalUsers = User::whereHas('roles', function ($q) {
            $q->whereIn('name', ['desarrollador', 'disenador', 'qa_tester', 'validador', 'super_admin']);
        })->with('roles')->get();

        return Inertia::render('Tickets/Index', [
            'columns' => $columns,
            'projects' => $projects,
            'technicalUsers' => $technicalUsers,
            'filters' => $request->only(['project_id', 'priority', 'type', 'user_id']),
            'metrics' => [
                'total_tickets' => $allTickets->count(),
                'in_progress_count' => $allTickets->where('status', 'in_progress')->count(),
                'testing_count' => $allTickets->where('status', 'testing_qa')->count(),
                'done_count' => $allTickets->where('status', 'done')->count(),
            ],
        ]);
    }

    /**
     * Actualizar estado o datos de un ticket
     */
    public function update(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'status' => 'nullable|in:backlog,todo,in_progress,testing_qa,validated,done',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'logged_hours' => 'nullable|numeric|min:0',
            'estimated_hours' => 'nullable|numeric|min:0',
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        $ticket->update(array_filter($validated, fn($v) => !is_null($v)));

        // Recalcular avance del proyecto padre
        $this->projectService->recalculateProgress($ticket->project);

        return back()->with('success', 'Ticket ' . $ticket->ticket_number . ' actualizado.');
    }

    /**
     * Asignar usuario con rol específico a un ticket
     */
    public function assign(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_in_ticket' => 'required|in:desarrollador,disenador,qa_tester,validador',
        ]);

        TicketAssignment::updateOrCreate(
            [
                'ticket_id' => $ticket->id,
                'user_id' => $validated['user_id'],
                'role_in_ticket' => $validated['role_in_ticket'],
            ],
            [
                'assigned_at' => now(),
            ]
        );

        return back()->with('success', 'Asignación técnica guardada.');
    }

    /**
     * Desasignar miembro de un ticket
     */
    public function unassign(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'assignment_id' => 'required|exists:ticket_assignments,id',
        ]);

        TicketAssignment::where('id', $validated['assignment_id'])
            ->where('ticket_id', $ticket->id)
            ->delete();

        return back()->with('success', 'Asignación removida.');
    }

    /**
     * Agregar nota o comentario técnico al ticket
     */
    public function addComment(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:2000',
            'is_internal' => 'nullable|boolean',
        ]);

        Comment::create([
            'user_id' => $request->user()->id,
            'commentable_type' => Ticket::class,
            'commentable_id' => $ticket->id,
            'content' => $validated['content'],
            'is_internal' => $validated['is_internal'] ?? true,
        ]);

        return back()->with('success', 'Nota registrada en el ticket.');
    }
}
