import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Project, Ticket, TicketStatus, User } from '@/types';
import {
    CheckSquare,
    Filter,
    Clock,
    UserCircle,
    Plus,
    Building2,
    CheckCircle2,
    AlertCircle,
    UserPlus,
    MessageSquare,
    MoreVertical,
    Layers,
    ChevronRight,
    Send,
    Edit,
    Trash2,
    X,
    Sparkles,
    Tag,
    FolderKanban,
    AlertTriangle,
} from 'lucide-react';

interface KanbanColumns {
    backlog?: Ticket[];
    todo: Ticket[];
    in_progress: Ticket[];
    testing_qa: Ticket[];
    validated: Ticket[];
    done: Ticket[];
}

interface IndexProps {
    columns: KanbanColumns;
    projects: { id: number; name: string; code: string }[];
    technicalUsers: User[];
    filters: {
        project_id?: string;
        priority?: string;
        type?: string;
        user_id?: string;
    };
    metrics: {
        total_tickets: number;
        in_progress_count: number;
        testing_count: number;
        done_count: number;
    };
}

export default function Index({ columns, projects, technicalUsers, filters, metrics }: IndexProps) {
    const [selectedProject, setSelectedProject] = useState(filters.project_id || '');
    const [selectedUser, setSelectedUser] = useState(filters.user_id || '');

    // Modales de interacción
    const [createEditModalOpen, setCreateEditModalOpen] = useState(false);
    const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [logHoursModalOpen, setLogHoursModalOpen] = useState(false);
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

    // Formulario de Creación / Edición de Ticket
    const { data: ticketForm, setData: setTicketForm, post: postTicket, patch: patchTicket, processing: ticketProcessing, errors: ticketErrors, reset: resetTicketForm } = useForm({
        project_id: projects[0]?.id ? String(projects[0].id) : '',
        title: '',
        description: '',
        type: 'feature' as 'feature' | 'bug' | 'refactor' | 'design' | 'dev' | 'test' | 'integration' | 'infrastructure',
        priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
        status: 'todo' as TicketStatus,
        estimated_hours: 8,
        logged_hours: 0,
        user_id: '',
        role_in_ticket: 'desarrollador' as 'desarrollador' | 'disenador' | 'qa_tester' | 'validador',
    });

    // Estados de modales secundarios
    const [assignUserId, setAssignUserId] = useState(technicalUsers[0]?.id ? String(technicalUsers[0].id) : '');
    const [assignRole, setAssignRole] = useState<'desarrollador' | 'disenador' | 'qa_tester' | 'validador'>('desarrollador');
    const [loggedHoursInput, setLoggedHoursInput] = useState(0);
    const [commentInput, setCommentInput] = useState('');

    const handleFilterChange = (projId: string, uId: string) => {
        setSelectedProject(projId);
        setSelectedUser(uId);
        router.get(
            route('tickets.index'),
            { project_id: projId, user_id: uId },
            { preserveState: true }
        );
    };

    const openCreateModal = () => {
        setEditingTicket(null);
        resetTicketForm();
        setTicketForm({
            project_id: projects[0]?.id ? String(projects[0].id) : '',
            title: '',
            description: '',
            type: 'feature',
            priority: 'medium',
            status: 'todo',
            estimated_hours: 8,
            logged_hours: 0,
            user_id: technicalUsers[0]?.id ? String(technicalUsers[0].id) : '',
            role_in_ticket: 'desarrollador',
        });
        setCreateEditModalOpen(true);
    };

    const openEditModal = (ticket: Ticket) => {
        setEditingTicket(ticket);
        setTicketForm({
            project_id: String(ticket.project_id),
            title: ticket.title,
            description: ticket.description || '',
            type: (ticket.type as any) || 'feature',
            priority: ticket.priority,
            status: ticket.status,
            estimated_hours: Number(ticket.estimated_hours) || 0,
            logged_hours: Number(ticket.logged_hours) || 0,
            user_id: '',
            role_in_ticket: 'desarrollador',
        });
        setCreateEditModalOpen(true);
    };

    const handleTicketSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTicket) {
            patchTicket(route('tickets.update', editingTicket.id), {
                onSuccess: () => {
                    setCreateEditModalOpen(false);
                    setEditingTicket(null);
                },
            });
        } else {
            postTicket(route('tickets.store'), {
                onSuccess: () => {
                    setCreateEditModalOpen(false);
                },
            });
        }
    };

    const handleDeleteTicket = (ticket: Ticket) => {
        if (confirm(`¿Estás seguro de eliminar el ticket ${ticket.ticket_number}?`)) {
            router.delete(route('tickets.destroy', ticket.id), { preserveState: true });
        }
    };

    const handleStatusMove = (ticket: Ticket, newStatus: TicketStatus) => {
        router.patch(route('tickets.update', ticket.id), { status: newStatus }, { preserveState: true });
    };

    const handleAssignSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeTicket) return;

        router.post(
            route('tickets.assign', activeTicket.id),
            {
                user_id: assignUserId,
                role_in_ticket: assignRole,
            },
            {
                onSuccess: () => {
                    setAssignModalOpen(false);
                    setActiveTicket(null);
                },
                preserveState: true,
            }
        );
    };

    const handleLogHoursSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeTicket) return;

        router.patch(
            route('tickets.update', activeTicket.id),
            {
                logged_hours: loggedHoursInput,
            },
            {
                onSuccess: () => {
                    setLogHoursModalOpen(false);
                    setActiveTicket(null);
                },
                preserveState: true,
            }
        );
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeTicket || !commentInput.trim()) return;

        router.post(
            route('tickets.comments.store', activeTicket.id),
            {
                content: commentInput,
                is_internal: true,
            },
            {
                onSuccess: () => {
                    setCommentInput('');
                    setCommentModalOpen(false);
                    setActiveTicket(null);
                },
                preserveState: true,
            }
        );
    };

    const columnDefs: { id: keyof KanbanColumns; title: string; color: string; badgeColor: string }[] = [
        { id: 'todo', title: 'Por Iniciar', color: 'border-white/20', badgeColor: 'bg-white/10 text-white/80' },
        { id: 'in_progress', title: 'En Desarrollo', color: 'border-[#3C84CE]/50', badgeColor: 'bg-[#3C84CE]/20 text-[#30EEE2]' },
        { id: 'testing_qa', title: 'Testing & QA', color: 'border-amber-500/50', badgeColor: 'bg-amber-500/20 text-amber-300' },
        { id: 'validated', title: 'Validado Tech Lead', color: 'border-teal-500/50', badgeColor: 'bg-teal-500/20 text-teal-300' },
        { id: 'done', title: 'Completado', color: 'border-emerald-500/50', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
    ];

    const priorityBadges: Record<string, { label: string; class: string }> = {
        low: { label: 'Baja', class: 'bg-white/5 text-white/50 border-white/10' },
        medium: { label: 'Media', class: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
        high: { label: 'Alta', class: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
        urgent: { label: 'Urgente', class: 'bg-rose-500/20 text-rose-300 border-rose-500/30 font-bold' },
    };

    const typeBadges: Record<string, string> = {
        feature: 'bg-[#30EEE2]/10 text-[#30EEE2] border-[#30EEE2]/30',
        bug: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        dev: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        design: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
        test: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        refactor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        integration: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
        infrastructure: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    };

    const roleBadgeColor: Record<string, string> = {
        desarrollador: 'text-indigo-300 bg-indigo-500/20 border-indigo-500/40',
        disenador: 'text-pink-300 bg-pink-500/20 border-pink-500/40',
        qa_tester: 'text-amber-300 bg-amber-500/20 border-amber-500/40',
        validador: 'text-teal-300 bg-teal-500/20 border-teal-500/40',
    };

    return (
        <AppLayout
            header={
                <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-[#30EEE2]/10 border border-[#30EEE2]/20 shrink-0">
                        <CheckSquare className="w-5 h-5 text-[#30EEE2]" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-sm sm:text-xl font-heading font-bold text-white leading-tight truncate">
                            Tablero Kanban de Tickets & Sprints
                        </h2>
                        <p className="text-xs text-white/50 hidden sm:block truncate">
                            Asignación multi-rol (Dev, QA, UI/UX, Validador) y avance operativo
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Tablero Kanban de Tickets" />

            {/* Barra de Acciones y Filtros del Tablero */}
            <div className="glass-panel p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm font-heading font-bold text-white">Filtros & Gestión de Tickets</h3>
                    <p className="text-xs text-white/50">Crea tareas técnicas o filtra por proyecto y especialista</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <select
                        value={selectedProject}
                        onChange={(e) => handleFilterChange(e.target.value, selectedUser)}
                        className="input-xamanen text-xs py-2 bg-[#101522]"
                    >
                        <option value="">Todos los Proyectos</option>
                        {projects.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.code} - {p.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedUser}
                        onChange={(e) => handleFilterChange(selectedProject, e.target.value)}
                        className="input-xamanen text-xs py-2 bg-[#101522]"
                    >
                        <option value="">Todos los Asignados</option>
                        {technicalUsers.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="btn-xamanen-primary text-xs py-2 px-3.5 shadow-lg flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Crear Nuevo Ticket
                    </button>
                </div>
            </div>

            {/* Columnas Kanban */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
                {columnDefs.map((col) => {
                    const ticketsInCol = columns[col.id] || [];

                    return (
                        <div
                            key={col.id}
                            className="glass-panel p-3.5 flex flex-col max-h-[calc(100vh-210px)] overflow-hidden"
                        >
                            {/* Cabecera de Columna */}
                            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 shrink-0">
                                <span className="font-heading font-bold text-xs text-white flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${col.id === 'done' ? 'bg-emerald-400' : col.id === 'in_progress' ? 'bg-[#30EEE2]' : col.id === 'testing_qa' ? 'bg-amber-400' : 'bg-white/40'}`}></span>
                                    {col.title}
                                </span>
                                <span
                                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${col.badgeColor}`}
                                >
                                    {ticketsInCol.length}
                                </span>
                            </div>

                            {/* Lista de Tarjetas con Scroll */}
                            <div className="space-y-3 overflow-y-auto pr-1 flex-1 custom-scrollbar">
                                {ticketsInCol.length > 0 ? (
                                    ticketsInCol.map((ticket) => {
                                        const prio = priorityBadges[ticket.priority] || priorityBadges.medium;
                                        const typeClass = typeBadges[ticket.type] || typeBadges.feature;

                                        return (
                                            <div
                                                key={ticket.id}
                                                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#30EEE2]/40 transition-all space-y-2.5 group"
                                            >
                                                {/* Header de la tarjeta */}
                                                <div className="flex items-center justify-between text-[10px]">
                                                    <span className="font-mono font-bold text-[#30EEE2]">
                                                        {ticket.ticket_number}
                                                    </span>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${prio.class}`}>
                                                            {prio.label}
                                                        </span>
                                                        <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold uppercase ${typeClass}`}>
                                                            {ticket.type}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Título y Proyecto */}
                                                <div>
                                                    <h4 className="text-xs font-bold text-white leading-snug">
                                                        {ticket.title}
                                                    </h4>
                                                    <span className="text-[10px] text-white/40 block mt-0.5 truncate">
                                                        {ticket.project?.name || 'Proyecto'}
                                                    </span>
                                                </div>

                                                {/* Horas & Progreso */}
                                                <div className="flex items-center justify-between text-[10px] text-white/60 bg-white/[0.02] p-1.5 rounded-lg border border-white/5">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3 text-[#30EEE2]" />
                                                        {Number(ticket.logged_hours || 0)}h / {Number(ticket.estimated_hours || 0)}h
                                                    </span>
                                                    <span className="font-mono text-white/40">
                                                        {ticket.estimated_hours ? Math.round((Number(ticket.logged_hours) / Number(ticket.estimated_hours)) * 100) : 0}%
                                                    </span>
                                                </div>

                                                {/* Asignados */}
                                                <div className="flex flex-wrap items-center gap-1">
                                                    {ticket.assignments && ticket.assignments.length > 0 ? (
                                                        ticket.assignments.map((asg) => (
                                                            <span
                                                                key={asg.id}
                                                                className={`inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded border ${roleBadgeColor[asg.role_in_ticket] || 'text-white/60 bg-white/5 border-white/10'}`}
                                                                title={`${asg.user?.name} (${asg.role_in_ticket})`}
                                                            >
                                                                <UserCircle className="w-2.5 h-2.5" />
                                                                {asg.user?.name.split(' ')[0]}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-[10px] text-white/30 italic">
                                                            Sin asignar
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Barra de Acciones de Tarjeta */}
                                                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-1">
                                                    {/* Selector de Estado Rápido */}
                                                    <select
                                                        value={ticket.status}
                                                        onChange={(e) => handleStatusMove(ticket, e.target.value as TicketStatus)}
                                                        className="text-[10px] py-1 px-1.5 rounded-lg bg-[#101522] border border-white/10 text-white/80 focus:border-[#30EEE2]"
                                                    >
                                                        <option value="todo">Por Iniciar</option>
                                                        <option value="in_progress">En Desarrollo</option>
                                                        <option value="testing_qa">Testing QA</option>
                                                        <option value="validated">Validado</option>
                                                        <option value="done">Completado</option>
                                                    </select>

                                                    <div className="flex items-center gap-1">
                                                        {/* Editar */}
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditModal(ticket)}
                                                            className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/5 transition-colors"
                                                            title="Editar Ticket"
                                                        >
                                                            <Edit className="w-3.5 h-3.5" />
                                                        </button>

                                                        {/* Asignar */}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setActiveTicket(ticket);
                                                                setAssignModalOpen(true);
                                                            }}
                                                            className="p-1 rounded-md text-white/40 hover:text-[#30EEE2] hover:bg-white/5 transition-colors"
                                                            title="Asignar Miembro"
                                                        >
                                                            <UserPlus className="w-3.5 h-3.5" />
                                                        </button>

                                                        {/* Cargar Horas */}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setActiveTicket(ticket);
                                                                setLoggedHoursInput(Number(ticket.logged_hours) || 0);
                                                                setLogHoursModalOpen(true);
                                                            }}
                                                            className="p-1 rounded-md text-white/40 hover:text-amber-300 hover:bg-white/5 transition-colors"
                                                            title="Registrar Horas"
                                                        >
                                                            <Clock className="w-3.5 h-3.5" />
                                                        </button>

                                                        {/* Eliminar */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteTicket(ticket)}
                                                            className="p-1 rounded-md text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                                            title="Eliminar Ticket"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="py-8 text-center border border-dashed border-white/10 rounded-xl">
                                        <p className="text-[11px] text-white/30">Sin tareas</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ========================================================= */}
            {/* MODAL 1: CREAR / EDITAR TICKET                           */}
            {/* ========================================================= */}
            {createEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="glass-panel p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                                <CheckSquare className="w-5 h-5 text-[#30EEE2]" />
                                {editingTicket ? `Editar Ticket ${editingTicket.ticket_number}` : 'Crear Nuevo Ticket'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setCreateEditModalOpen(false)}
                                className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/5"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleTicketSubmit} className="space-y-4">
                            {/* Proyecto Padre */}
                            <div>
                                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">
                                    Proyecto Asociado *
                                </label>
                                <select
                                    value={ticketForm.project_id}
                                    onChange={(e) => setTicketForm('project_id', e.target.value)}
                                    className="w-full input-xamanen text-xs bg-[#101522]"
                                    required
                                    disabled={Boolean(editingTicket)}
                                >
                                    {projects.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.code} - {p.name}
                                        </option>
                                    ))}
                                </select>
                                {ticketErrors.project_id && (
                                    <p className="text-rose-400 text-xs mt-1">{ticketErrors.project_id}</p>
                                )}
                            </div>

                            {/* Título */}
                            <div>
                                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">
                                    Título de la Tarea / Módulo *
                                </label>
                                <input
                                    type="text"
                                    value={ticketForm.title}
                                    onChange={(e) => setTicketForm('title', e.target.value)}
                                    placeholder="Ej. Implementar integración con API AFIP"
                                    className="w-full input-xamanen text-xs"
                                    required
                                />
                                {ticketErrors.title && (
                                    <p className="text-rose-400 text-xs mt-1">{ticketErrors.title}</p>
                                )}
                            </div>

                            {/* Descripción */}
                            <div>
                                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">
                                    Descripción / Criterios de Aceptación
                                </label>
                                <textarea
                                    value={ticketForm.description}
                                    onChange={(e) => setTicketForm('description', e.target.value)}
                                    rows={3}
                                    placeholder="Detalles técnicos, endpoints a consumir, diseño esperado..."
                                    className="w-full input-xamanen text-xs"
                                />
                            </div>

                            {/* Tipo, Prioridad y Estado */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">
                                        Tipo
                                    </label>
                                    <select
                                        value={ticketForm.type}
                                        onChange={(e) => setTicketForm('type', e.target.value as any)}
                                        className="w-full input-xamanen text-xs bg-[#101522]"
                                    >
                                        <option value="feature">Feature</option>
                                        <option value="bug">Bug / Error</option>
                                        <option value="dev">Desarrollo</option>
                                        <option value="design">Diseño UI/UX</option>
                                        <option value="test">Testing QA</option>
                                        <option value="integration">Integración</option>
                                        <option value="infrastructure">Infraestructura</option>
                                        <option value="refactor">Refactor</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">
                                        Prioridad
                                    </label>
                                    <select
                                        value={ticketForm.priority}
                                        onChange={(e) => setTicketForm('priority', e.target.value as any)}
                                        className="w-full input-xamanen text-xs bg-[#101522]"
                                    >
                                        <option value="low">Baja</option>
                                        <option value="medium">Media</option>
                                        <option value="high">Alta</option>
                                        <option value="urgent">Urgente</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">
                                        Estado Inicial
                                    </label>
                                    <select
                                        value={ticketForm.status}
                                        onChange={(e) => setTicketForm('status', e.target.value as any)}
                                        className="w-full input-xamanen text-xs bg-[#101522]"
                                    >
                                        <option value="todo">Por Iniciar</option>
                                        <option value="in_progress">En Desarrollo</option>
                                        <option value="testing_qa">Testing QA</option>
                                        <option value="validated">Validado</option>
                                        <option value="done">Completado</option>
                                    </select>
                                </div>
                            </div>

                            {/* Horas Estimadas y Horas Registradas */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">
                                        Horas Estimadas
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        value={ticketForm.estimated_hours}
                                        onChange={(e) => setTicketForm('estimated_hours', Number(e.target.value))}
                                        className="w-full input-xamanen text-xs"
                                    />
                                </div>

                                {editingTicket && (
                                    <div>
                                        <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1">
                                            Horas Reales Incurridas
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.5"
                                            value={ticketForm.logged_hours}
                                            onChange={(e) => setTicketForm('logged_hours', Number(e.target.value))}
                                            className="w-full input-xamanen text-xs"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Asignación Inicial (Solo en Creación) */}
                            {!editingTicket && (
                                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                                    <span className="text-xs font-bold text-white block">
                                        Asignar Especialista Inicial (Opcional)
                                    </span>
                                    <div className="grid grid-cols-2 gap-2">
                                        <select
                                            value={ticketForm.user_id}
                                            onChange={(e) => setTicketForm('user_id', e.target.value)}
                                            className="w-full input-xamanen text-xs bg-[#101522]"
                                        >
                                            <option value="">Sin Asignar</option>
                                            {technicalUsers.map((u) => (
                                                <option key={u.id} value={u.id}>
                                                    {u.name}
                                                </option>
                                            ))}
                                        </select>

                                        <select
                                            value={ticketForm.role_in_ticket}
                                            onChange={(e) => setTicketForm('role_in_ticket', e.target.value as any)}
                                            className="w-full input-xamanen text-xs bg-[#101522]"
                                        >
                                            <option value="desarrollador">Desarrollador</option>
                                            <option value="disenador">Diseñador UI/UX</option>
                                            <option value="qa_tester">QA & Testing</option>
                                            <option value="validador">Validador Tech Lead</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setCreateEditModalOpen(false)}
                                    className="btn-xamanen-secondary text-xs"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={ticketProcessing}
                                    className="btn-xamanen-primary text-xs shadow-lg"
                                >
                                    {editingTicket ? 'Guardar Cambios' : 'Crear Ticket'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* MODAL 2: ASIGNAR USUARIO CON ROL                          */}
            {/* ========================================================= */}
            {assignModalOpen && activeTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="glass-panel p-6 max-w-md w-full space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                                <UserPlus className="w-5 h-5 text-[#30EEE2]" />
                                Asignar a {activeTicket.ticket_number}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setAssignModalOpen(false)}
                                className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/5"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAssignSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                    Miembro del Equipo *
                                </label>
                                <select
                                    value={assignUserId}
                                    onChange={(e) => setAssignUserId(e.target.value)}
                                    className="w-full input-xamanen text-sm bg-[#101522]"
                                    required
                                >
                                    {technicalUsers.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name} ({u.roles?.map((r) => r.name).join(', ')})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                    Rol Específico en este Ticket *
                                </label>
                                <select
                                    value={assignRole}
                                    onChange={(e) => setAssignRole(e.target.value as any)}
                                    className="w-full input-xamanen text-sm bg-[#101522]"
                                    required
                                >
                                    <option value="desarrollador">💻 Desarrollador (Codificación & Lógica)</option>
                                    <option value="disenador">🎨 Diseñador UI/UX (Layout & Prototipos)</option>
                                    <option value="qa_tester">🧪 QA Tester (Pruebas & Control de Calidad)</option>
                                    <option value="validador">🛡️ Validador Tech Lead (Aprobación Final)</option>
                                </select>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setAssignModalOpen(false)}
                                    className="btn-xamanen-secondary text-xs"
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-xamanen-primary text-xs shadow-lg">
                                    Guardar Asignación
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================= */}
            {/* MODAL 3: REGISTRAR HORAS LABORADAS                       */}
            {/* ========================================================= */}
            {logHoursModalOpen && activeTicket && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="glass-panel p-6 max-w-md w-full space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                                <Clock className="w-5 h-5 text-amber-300" />
                                Carga de Horas — {activeTicket.ticket_number}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setLogHoursModalOpen(false)}
                                className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/5"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleLogHoursSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                    Total de Horas Reales Incurridas *
                                </label>
                                <input
                                    type="number"
                                    step="0.25"
                                    min="0"
                                    value={loggedHoursInput}
                                    onChange={(e) => setLoggedHoursInput(Number(e.target.value))}
                                    className="w-full input-xamanen text-sm"
                                    required
                                />
                                <span className="text-[11px] text-white/40 block mt-1">
                                    Estimado presupuestado: {activeTicket.estimated_hours}h
                                </span>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setLogHoursModalOpen(false)}
                                    className="btn-xamanen-secondary text-xs"
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-xamanen-primary text-xs shadow-lg">
                                    Actualizar Horas
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
