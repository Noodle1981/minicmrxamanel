import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Project, ProjectStatus, Ticket, User } from '@/types';
import {
    FolderKanban,
    ArrowLeft,
    CheckSquare,
    Clock,
    CheckCircle2,
    Calendar,
    Building2,
    Layers,
    Users,
    MessageSquare,
    Plus,
    ArrowUpRight,
    Edit,
    AlertCircle,
    UserCircle,
} from 'lucide-react';

interface ShowProps {
    project: Project;
    stats: {
        total_tickets: number;
        done_tickets: number;
        total_estimated_hours: number;
        total_logged_hours: number;
    };
    technicalUsers: User[];
}

export default function Show({ project, stats, technicalUsers }: ShowProps) {
    const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>(project.status);

    const handleStatusChange = (status: string) => {
        router.patch(route('projects.status.update', project.id), { status });
    };

    const statusConfig: Record<ProjectStatus, { label: string; class: string }> = {
        pending_start: { label: 'Por Iniciar', class: 'bg-white/10 text-white/80 border-white/20' },
        in_development: { label: 'En Desarrollo', class: 'bg-[#3C84CE]/20 text-[#30EEE2] border-[#3C84CE]/40' },
        testing_validation: { label: 'En Testing & QA', class: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
        delivered: { label: 'Entregado / Producción', class: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
        paused: { label: 'Pausado', class: 'bg-gray-500/20 text-gray-300 border-gray-500/40' },
        cancelled: { label: 'Cancelado', class: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
    };

    const ticketStatusConfig: Record<string, { label: string; class: string }> = {
        backlog: { label: 'Backlog', class: 'bg-white/5 text-white/60 border-white/10' },
        todo: { label: 'Por Iniciar', class: 'bg-white/10 text-white/80 border-white/20' },
        in_progress: { label: 'En Curso', class: 'bg-[#3C84CE]/20 text-[#30EEE2] border-[#3C84CE]/40' },
        testing_qa: { label: 'Testing QA', class: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
        validated: { label: 'Validado', class: 'bg-teal-500/20 text-teal-300 border-teal-500/40' },
        done: { label: 'Completado', class: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
    };

    const roleBadgeColor: Record<string, string> = {
        desarrollador: 'text-indigo-300 bg-indigo-500/20 border-indigo-500/40',
        disenador: 'text-fuchsia-300 bg-fuchsia-500/20 border-fuchsia-500/40',
        qa_tester: 'text-amber-300 bg-amber-500/20 border-amber-500/40',
        validador: 'text-teal-300 bg-teal-500/20 border-teal-500/40',
    };

    const CurrentStatus = statusConfig[project.status] || statusConfig.pending_start;

    return (
        <AppLayout
            header={
                <div className="flex items-center gap-3 min-w-0">
                    <Link
                        href={route('projects.index')}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors shrink-0"
                        title="Volver a Proyectos"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-sm sm:text-xl font-heading font-bold text-white leading-tight truncate">
                                {project.name}
                            </h2>
                            <span className="font-mono text-xs font-bold text-[#30EEE2] shrink-0">
                                ({project.code})
                            </span>
                        </div>
                        <p className="text-xs text-white/50 hidden sm:block truncate">
                            Cliente: <strong className="text-white">{project.client?.company_name}</strong>
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`Proyecto ${project.code}`} />

            {/* Barra de Acciones del Proyecto (En el Cuerpo) */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl glass-panel mb-6">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-white/60">Estado de Obra:</span>
                    <select
                        value={project.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="input-xamanen text-xs py-1.5 bg-[#101522]"
                    >
                        <option value="pending_start">Por Iniciar</option>
                        <option value="in_development">En Desarrollo</option>
                        <option value="testing_validation">En Testing & QA</option>
                        <option value="delivered">Entregado</option>
                        <option value="paused">Pausado</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href={route('tickets.index', { project_id: project.id })}
                        className="btn-xamanen-primary text-xs px-3.5 py-2 shadow-lg"
                    >
                        <CheckSquare className="w-3.5 h-3.5" />
                        Abrir en Kanban
                    </Link>
                </div>
            </div>

            {/* KPIs del Proyecto */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="glass-panel p-5">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                            Avance General
                        </span>
                        <span className="text-xs font-bold text-[#30EEE2]">{project.progress_percentage}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden my-2">
                        <div
                            className="h-full bg-gradient-to-r from-[#30EEE2] to-[#3C84CE] rounded-full transition-all duration-500"
                            style={{ width: `${project.progress_percentage}%` }}
                        />
                    </div>
                    <span className="text-[11px] text-white/40">
                        {stats.done_tickets} de {stats.total_tickets} tareas concluidas
                    </span>
                </div>

                <div className="glass-panel p-5">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">
                        Horas Comprometidas
                    </span>
                    <p className="text-2xl font-heading font-bold text-white">
                        {stats.total_estimated_hours} hs
                    </p>
                    <span className="text-[11px] text-white/40">Estimación matriz de esfuerzo</span>
                </div>

                <div className="glass-panel p-5">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">
                        Horas Registradas
                    </span>
                    <p className="text-2xl font-heading font-bold text-[#30EEE2]">
                        {stats.total_logged_hours} hs
                    </p>
                    <span className="text-[11px] text-white/40">Tiempo cargado por el equipo</span>
                </div>

                <div className="glass-panel p-5">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">
                        Fecha Límite de Entrega
                    </span>
                    <p className="text-lg font-heading font-bold text-amber-300 mt-1">
                        {project.due_date ? new Date(project.due_date).toLocaleDateString('es-AR') : 'A convenir'}
                    </p>
                    <span className="text-[11px] text-white/40">Días hábiles acordados</span>
                </div>
            </div>

            {/* Listado de Tickets y Tareas del Proyecto */}
            <div className="glass-panel p-6 mb-8">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
                    <div>
                        <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                            <CheckSquare className="w-4 h-4 text-[#30EEE2]" />
                            Tickets y Módulos de Trabajo ({project.tickets?.length || 0})
                        </h3>
                        <p className="text-xs text-white/50">
                            Tareas operativas generadas automáticamente a partir de la cotización aprobada
                        </p>
                    </div>

                    <Link
                        href={route('tickets.index', { project_id: project.id })}
                        className="text-xs font-semibold text-[#30EEE2] hover:underline flex items-center gap-1"
                    >
                        Gestionar en Tablero Kanban
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {project.tickets && project.tickets.length > 0 ? (
                    <div className="space-y-3">
                        {project.tickets.map((ticket) => {
                            const TStatus = ticketStatusConfig[ticket.status] || ticketStatusConfig.todo;

                            return (
                                <div
                                    key={ticket.id}
                                    className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                                >
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs font-bold text-[#30EEE2]">
                                                {ticket.ticket_number}
                                            </span>
                                            <span
                                                className={`text-[9px] px-2 py-0.5 rounded-full font-semibold border ${TStatus.class}`}
                                            >
                                                {TStatus.label}
                                            </span>
                                            <span className="text-[10px] text-white/40 uppercase font-semibold">
                                                {ticket.type}
                                            </span>
                                        </div>
                                        <h4 className="text-sm font-bold text-white">{ticket.title}</h4>
                                        {ticket.description && (
                                            <p className="text-xs text-white/60 line-clamp-1">
                                                {ticket.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                                        {/* Asignados con Roles Multi-Rol */}
                                        <div className="flex items-center gap-1.5">
                                            {ticket.assignments && ticket.assignments.length > 0 ? (
                                                ticket.assignments.map((assignment) => (
                                                    <span
                                                        key={assignment.id}
                                                        className={`text-[10px] px-2 py-0.5 rounded-md border font-medium flex items-center gap-1 ${
                                                            roleBadgeColor[assignment.role_in_ticket] || 'bg-white/10 text-white'
                                                        }`}
                                                        title={`${assignment.user?.name} (${assignment.role_in_ticket})`}
                                                    >
                                                        <UserCircle className="w-3 h-3" />
                                                        {assignment.user?.name?.split(' ')[0]}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[10px] text-white/30 italic">
                                                    Sin asignaciones
                                                </span>
                                            )}
                                        </div>

                                        {/* Horas */}
                                        <div className="text-right">
                                            <div className="text-xs font-semibold text-white">
                                                {ticket.logged_hours} / {ticket.estimated_hours} hs
                                            </div>
                                            <span className="text-[10px] text-white/40">Cargadas / Est.</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-8 text-center text-white/40">
                        <CheckSquare className="w-8 h-8 mx-auto mb-2 text-white/20" />
                        <p className="text-xs">No hay tickets generados para este proyecto.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
