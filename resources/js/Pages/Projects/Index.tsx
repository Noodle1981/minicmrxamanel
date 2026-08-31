import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Client, Project, ProjectStatus } from '@/types';
import {
    FolderKanban,
    Search,
    Filter,
    ArrowUpRight,
    CheckCircle2,
    Clock,
    AlertCircle,
    Calendar,
    Building2,
    Layers,
    CheckSquare,
    TrendingUp,
    Briefcase,
} from 'lucide-react';

interface PaginatedProjects {
    data: (Project & { tickets_count?: number; completed_tickets_count?: number })[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface IndexProps {
    projects: PaginatedProjects;
    filters: {
        status?: string;
        client_id?: string;
        search?: string;
    };
    clients: Client[];
    metrics: {
        total_projects: number;
        in_development: number;
        testing_validation: number;
        delivered: number;
    };
}

export default function Index({ projects, filters, clients, metrics }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [clientFilter, setClientFilter] = useState(filters.client_id || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('projects.index'),
            { search, status: statusFilter, client_id: clientFilter },
            { preserveState: true }
        );
    };

    const handleStatusChange = (newStatus: string) => {
        setStatusFilter(newStatus);
        router.get(
            route('projects.index'),
            { search, status: newStatus, client_id: clientFilter },
            { preserveState: true }
        );
    };

    const statusConfig: Record<ProjectStatus, { label: string; class: string; progressColor: string }> = {
        pending_start: { label: 'Por Iniciar', class: 'bg-white/10 text-white/80 border-white/20', progressColor: 'bg-white/40' },
        in_development: { label: 'En Desarrollo', class: 'bg-[#3C84CE]/20 text-[#30EEE2] border-[#3C84CE]/40', progressColor: 'bg-[#30EEE2]' },
        testing_validation: { label: 'En Testing & QA', class: 'bg-amber-500/20 text-amber-300 border-amber-500/40', progressColor: 'bg-amber-400' },
        delivered: { label: 'Entregado / Producción', class: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', progressColor: 'bg-emerald-400' },
        paused: { label: 'Pausado', class: 'bg-gray-500/20 text-gray-300 border-gray-500/40', progressColor: 'bg-gray-400' },
        cancelled: { label: 'Cancelado', class: 'bg-rose-500/20 text-rose-300 border-rose-500/40', progressColor: 'bg-rose-400' },
    };

    return (
        <AppLayout
            header={
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-[#30EEE2]/10 border border-[#30EEE2]/20 shrink-0">
                        <FolderKanban className="w-4 h-4 sm:w-5 sm:h-5 text-[#30EEE2]" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-sm sm:text-xl font-heading font-bold text-white leading-tight whitespace-nowrap">
                            <span className="sm:hidden">Proyectos</span>
                            <span className="hidden sm:inline">Proyectos & Obras de Software</span>
                        </h2>
                        <p className="text-xs text-white/50 hidden sm:block truncate">
                            Gestión operativa del ciclo de vida y avance de tickets
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Proyectos Operativos" />

            {/* Barra de Acciones del Cuerpo */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-sm font-heading font-bold text-white">Obras en Ejecución</h3>
                    <p className="text-xs text-white/50">Monitoreo de hitos, avance porcentual y asignación de tareas</p>
                </div>
                <Link
                    href={route('tickets.index')}
                    className="btn-xamanen-secondary text-xs shrink-0"
                >
                    <CheckSquare className="w-4 h-4 text-[#30EEE2]" />
                    Ver Tablero Kanban Global
                </Link>
            </div>

            {/* KPIs de Proyectos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="glass-panel p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                            Total Proyectos
                        </span>
                        <div className="p-2 rounded-lg bg-white/5 text-[#30EEE2]">
                            <FolderKanban className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-heading font-bold text-white">{metrics.total_projects}</p>
                    <span className="text-[11px] text-white/40">Generados desde cotizaciones</span>
                </div>

                <div className="glass-panel p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                            En Desarrollo
                        </span>
                        <div className="p-2 rounded-lg bg-[#3C84CE]/10 text-[#30EEE2]">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-heading font-bold text-[#30EEE2]">{metrics.in_development}</p>
                    <span className="text-[11px] text-white/40">Codificación activa</span>
                </div>

                <div className="glass-panel p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                            En Testing & QA
                        </span>
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                            <Clock className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-heading font-bold text-amber-400">{metrics.testing_validation}</p>
                    <span className="text-[11px] text-white/40">Validación y aceptación</span>
                </div>

                <div className="glass-panel p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                            Entregados
                        </span>
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-heading font-bold text-emerald-400">{metrics.delivered}</p>
                    <span className="text-[11px] text-white/40">Puesta en producción</span>
                </div>
            </div>

            {/* Barra de Filtros */}
            <div className="glass-panel p-4 mb-6">
                <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-5 relative">
                        <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por código, nombre o cliente..."
                            className="w-full input-xamanen text-xs pl-9"
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="w-full input-xamanen text-xs bg-[#101522]"
                        >
                            <option value="">Todos los Estados</option>
                            <option value="pending_start">Por Iniciar</option>
                            <option value="in_development">En Desarrollo</option>
                            <option value="testing_validation">En Testing & QA</option>
                            <option value="delivered">Entregado</option>
                        </select>
                    </div>

                    <div className="sm:col-span-3">
                        <select
                            value={clientFilter}
                            onChange={(e) => {
                                setClientFilter(e.target.value);
                                router.get(
                                    route('projects.index'),
                                    { search, status: statusFilter, client_id: e.target.value },
                                    { preserveState: true }
                                );
                            }}
                            className="w-full input-xamanen text-xs bg-[#101522]"
                        >
                            <option value="">Todos los Clientes</option>
                            {clients.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.company_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="sm:col-span-1">
                        <button
                            type="submit"
                            className="w-full btn-xamanen-secondary text-xs p-2.5 flex items-center justify-center"
                            title="Filtrar"
                        >
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </div>

            {/* Listado de Tarjetas de Proyectos */}
            <div className="space-y-4">
                {projects.data.length > 0 ? (
                    projects.data.map((project) => {
                        const Status = statusConfig[project.status] || statusConfig.pending_start;

                        return (
                            <div
                                key={project.id}
                                className="glass-panel p-6 hover:border-[#30EEE2]/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                            >
                                <div className="space-y-2 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-[#30EEE2] text-xs">
                                            {project.code}
                                        </span>
                                        <span
                                            className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border ${Status.class}`}
                                        >
                                            {Status.label}
                                        </span>
                                        {project.quote?.software_type && (
                                            <span className="text-[10px] text-white/50 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                                                {project.quote.software_type.name}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-base font-heading font-bold text-white">
                                        <Link
                                            href={route('projects.show', project.id)}
                                            className="hover:text-[#30EEE2] transition-colors"
                                        >
                                            {project.name}
                                        </Link>
                                    </h3>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/60">
                                        <span className="flex items-center gap-1">
                                            <Building2 className="w-3.5 h-3.5 text-white/40" />
                                            {project.client?.company_name}
                                        </span>
                                        <span>·</span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5 text-white/40" />
                                            Entrega: {project.due_date ? new Date(project.due_date).toLocaleDateString('es-AR') : 'A definir'}
                                        </span>
                                        <span>·</span>
                                        <span className="flex items-center gap-1">
                                            <CheckSquare className="w-3.5 h-3.5 text-white/40" />
                                            {project.completed_tickets_count || 0} / {project.tickets_count || 0} tickets completados
                                        </span>
                                    </div>
                                </div>

                                {/* Barra de Progreso y Acciones */}
                                <div className="lg:w-80 shrink-0 space-y-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/10">
                                    <div>
                                        <div className="flex items-center justify-between text-xs mb-1">
                                            <span className="text-white/60">Avance del Proyecto:</span>
                                            <span className="font-bold text-[#30EEE2]">
                                                {project.progress_percentage}%
                                            </span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${Status.progressColor}`}
                                                style={{ width: `${project.progress_percentage}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={route('tickets.index', { project_id: project.id })}
                                            className="btn-xamanen-secondary text-xs px-3 py-1.5"
                                        >
                                            <CheckSquare className="w-3.5 h-3.5 text-[#30EEE2]" />
                                            Ver Tickets
                                        </Link>

                                        <Link
                                            href={route('projects.show', project.id)}
                                            className="btn-xamanen-primary text-xs px-3.5 py-1.5"
                                        >
                                            Ficha de Obra
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="glass-panel p-12 text-center text-white/40">
                        <FolderKanban className="w-10 h-10 mx-auto mb-2 text-white/20" />
                        <p className="text-sm text-white/60">No se encontraron proyectos con los filtros aplicados.</p>
                        <p className="text-xs text-white/40 mt-1">
                            Los proyectos se crean automáticamente al aceptar una cotización desde el CPQ o portal del cliente.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
