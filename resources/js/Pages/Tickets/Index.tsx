import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
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
    Edit3,
} from 'lucide-react';

interface KanbanColumns {
    backlog: Ticket[];
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
    const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [logHoursModalOpen, setLogHoursModalOpen] = useState(false);
    const [commentModalOpen, setCommentModalOpen] = useState(false);

    // Estados de formularios modales
    const [assignUserId, setAssignUserId] = useState(technicalUsers[0]?.id ? String(technicalUsers[0].id) : '');
    const [assignRole, setAssignRole] = useState<'desarrollador' | 'disenador' | 'qa_tester' | 'validador'>('desarrollador');
    const [loggedHoursInput, setLoggedHoursInput] = useState(0);
    const [commentInput, setCommentInput] = useState('');
    const [isInternalComment, setIsInternalComment] = useState(true);

    const handleFilterChange = (projId: string, uId: string) => {
        setSelectedProject(projId);
        setSelectedUser(uId);
        router.get(
            route('tickets.index'),
            { project_id: projId, user_id: uId },
            { preserveState: true }
        );
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
        if (!activeTicket) return;

        router.post(
            route('tickets.comments.store', activeTicket.id),
            {
                content: commentInput,
                is_internal: isInternalComment,
            },
            {
                onSuccess: () => {
                    setCommentModalOpen(false);
                    setCommentInput('');
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

    const roleBadgeColor: Record<string, string> = {
        desarrollador: 'text-indigo-300 bg-indigo-500/20 border-indigo-500/40',
        disenador: 'text-fuchsia-300 bg-fuchsia-500/20 border-fuchsia-500/40',
        qa_tester: 'text-amber-300 bg-amber-500/20 border-amber-500/40',
        validador: 'text-teal-300 bg-teal-500/20 border-teal-500/40',
    };

    return (
        <AppLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#30EEE2]/10 border border-[#30EEE2]/20">
                        <CheckSquare className="w-5 h-5 text-[#30EEE2]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-heading font-bold text-white leading-tight">
                            Tablero Kanban de Tickets & Sprints
                        </h2>
                        <p className="text-xs text-white/50">
                            Asignación multi-rol (`Dev`, `QA`, `UI/UX`, `Validador`) y avance operativo
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Tablero Kanban de Tickets" />

            {/* Barra de Filtros del Tablero (En el Cuerpo) */}
            <div className="glass-panel p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm font-heading font-bold text-white">Filtros Operativos</h3>
                    <p className="text-xs text-white/50">Filtra tarjetas por obra o especialista técnico</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <select
                        value={selectedProject}
                        onChange={(e) => handleFilterChange(e.target.value, selectedUser)}
                        className="input-xamanen text-xs py-1.5 bg-[#101522]"
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
                        className="input-xamanen text-xs py-1.5 bg-[#101522]"
                    >
                        <option value="">Todos los Asignados</option>
                        {technicalUsers.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name}
                            </option>
                        ))}
                    </select>
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
                                    ticketsInCol.map((ticket) => (
                                        <div
                                            key={ticket.id}
                                            className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#30EEE2]/40 transition-all space-y-2.5 group"
                                        >
                                            {/* Header de la tarjeta */}
                                            <div className="flex items-center justify-between text-[10px]">
                                                <span className="font-mono font-bold text-[#30EEE2]">
                                                    {ticket.ticket_number}
                                                </span>
                                                <span className="text-white/40 uppercase font-semibold">
                                                    {ticket.type}
                                                </span>
                                            </div>

                                            {/* Título y Proyecto */}
                                            <div>
                                                <h4 className="text-xs font-bold text-white leading-snug">
                                                    {ticket.title}
                                                </h4>
                                                <span className="text-[10px] text-white/40 block mt-0.5 truncate">
                                                    {ticket.project?.name}
                                                </span>
                                            </div>

                                            {/* Asignaciones Multi-Rol */}
                                            <div className="flex flex-wrap gap-1 pt-1">
                                                {ticket.assignments && ticket.assignments.length > 0 ? (
                                                    ticket.assignments.map((asgn) => (
                                                        <span
                                                            key={asgn.id}
                                                            className={`text-[9px] px-1.5 py-0.5 rounded border font-medium flex items-center gap-1 ${
                                                                roleBadgeColor[asgn.role_in_ticket] || 'bg-white/10 text-white'
                                                            }`}
                                                            title={`${asgn.user?.name} (${asgn.role_in_ticket})`}
                                                        >
                                                            <UserCircle className="w-2.5 h-2.5" />
                                                            {asgn.user?.name?.split(' ')[0]} ({asgn.role_in_ticket.slice(0, 3)})
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-[9px] text-white/30 italic">
                                                        Sin asignar
                                                    </span>
                                                )}
                                            </div>

                                            {/* Horas & Acciones */}
                                            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                                                <div className="flex items-center gap-1 text-white/60">
                                                    <Clock className="w-3 h-3 text-[#30EEE2]" />
                                                    <span>
                                                        <strong className="text-white">{ticket.logged_hours}</strong> / {ticket.estimated_hours}h
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setActiveTicket(ticket);
                                                            setAssignModalOpen(true);
                                                        }}
                                                        className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white"
                                                        title="Asignar Miembro Técnico"
                                                    >
                                                        <UserPlus className="w-3.5 h-3.5" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setActiveTicket(ticket);
                                                            setLoggedHoursInput(ticket.logged_hours);
                                                            setLogHoursModalOpen(true);
                                                        }}
                                                        className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-[#30EEE2]"
                                                        title="Cargar Horas"
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setActiveTicket(ticket);
                                                            setCommentModalOpen(true);
                                                        }}
                                                        className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white"
                                                        title="Notas Técnicas"
                                                    >
                                                        <MessageSquare className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Selector rápido de Mover Columna */}
                                            <div className="pt-1">
                                                <select
                                                    value={ticket.status}
                                                    onChange={(e) => handleStatusMove(ticket, e.target.value as TicketStatus)}
                                                    className="w-full text-[10px] py-1 px-2 rounded-lg bg-[#161D2E] border border-white/10 text-white/80 focus:border-[#30EEE2] focus:outline-none"
                                                >
                                                    <option value="todo">Mover: Por Iniciar</option>
                                                    <option value="in_progress">Mover: En Desarrollo</option>
                                                    <option value="testing_qa">Mover: Testing & QA</option>
                                                    <option value="validated">Mover: Validado</option>
                                                    <option value="done">Mover: Completado</option>
                                                </select>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center text-white/20 text-xs italic">
                                        Sin tickets
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ==================== MODAL DE ASIGNACIÓN MULTI-ROL ==================== */}
            {assignModalOpen && activeTicket && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="glass-panel p-6 max-w-md w-full border-white/20 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-white/10">
                            <div>
                                <span className="text-[10px] font-mono font-bold text-[#30EEE2]">
                                    {activeTicket.ticket_number}
                                </span>
                                <h3 className="text-sm font-heading font-bold text-white">
                                    Asignar Miembro Técnico
                                </h3>
                            </div>
                            <button
                                onClick={() => setAssignModalOpen(false)}
                                className="text-white/40 hover:text-white text-xs"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleAssignSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                    Usuario Técnico
                                </label>
                                <select
                                    value={assignUserId}
                                    onChange={(e) => setAssignUserId(e.target.value)}
                                    className="w-full input-xamanen text-xs bg-[#101522]"
                                    required
                                >
                                    {technicalUsers.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name} ({u.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                    Rol en este Ticket (Multi-Rol Flexible)
                                </label>
                                <select
                                    value={assignRole}
                                    onChange={(e) => setAssignRole(e.target.value as any)}
                                    className="w-full input-xamanen text-xs bg-[#101522]"
                                    required
                                >
                                    <option value="desarrollador">Desarrollador (Codificación / Feature)</option>
                                    <option value="disenador">Diseñador (UI/UX / Assets)</option>
                                    <option value="qa_tester">QA & Tester (Pruebas / Automatización)</option>
                                    <option value="validador">Validador / Tech Lead (Aprobación Final)</option>
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
                                <button
                                    type="submit"
                                    className="btn-xamanen-primary text-xs"
                                >
                                    Guardar Asignación
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ==================== MODAL DE CARGA DE HORAS ==================== */}
            {logHoursModalOpen && activeTicket && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="glass-panel p-6 max-w-sm w-full border-white/20 shadow-2xl space-y-4">
                        <h3 className="text-sm font-heading font-bold text-white">
                            Registrar Horas en {activeTicket.ticket_number}
                        </h3>
                        <p className="text-xs text-white/60">
                            Horas estimadas: <strong className="text-white">{activeTicket.estimated_hours} hs</strong>
                        </p>

                        <form onSubmit={handleLogHoursSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                    Horas Reales Invertidas (hs)
                                </label>
                                <input
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    value={loggedHoursInput}
                                    onChange={(e) => setLoggedHoursInput(Number(e.target.value))}
                                    className="w-full input-xamanen text-sm"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setLogHoursModalOpen(false)}
                                    className="btn-xamanen-secondary text-xs"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn-xamanen-primary text-xs"
                                >
                                    Guardar Horas
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ==================== MODAL DE COMENTARIOS / NOTAS ==================== */}
            {commentModalOpen && activeTicket && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="glass-panel p-6 max-w-md w-full border-white/20 shadow-2xl space-y-4">
                        <h3 className="text-sm font-heading font-bold text-white">
                            Bitácora & Notas Técnicas: {activeTicket.ticket_number}
                        </h3>

                        {activeTicket.comments && activeTicket.comments.length > 0 && (
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                {activeTicket.comments.map((c) => (
                                    <div key={c.id} className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5 text-xs">
                                        <div className="flex items-center justify-between text-[10px] text-white/40 mb-1">
                                            <strong>{c.user?.name}</strong>
                                            <span>{new Date(c.created_at).toLocaleString('es-AR')}</span>
                                        </div>
                                        <p className="text-white/80">{c.content}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleCommentSubmit} className="space-y-3 pt-2 border-t border-white/10">
                            <textarea
                                rows={3}
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                                placeholder="Escribe un avance técnico o nota de validación..."
                                className="w-full input-xamanen text-xs"
                                required
                            />

                            <div className="flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setCommentModalOpen(false)}
                                    className="btn-xamanen-secondary text-xs"
                                >
                                    Cerrar
                                </button>
                                <button
                                    type="submit"
                                    className="btn-xamanen-primary text-xs"
                                >
                                    Agregar Nota
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
