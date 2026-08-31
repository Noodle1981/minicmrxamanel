import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Search,
    Filter,
    RotateCcw,
    FolderKanban,
    UserCheck,
    Clock,
    CheckCircle2,
    AlertCircle,
    Building2,
} from 'lucide-react';

interface DayData {
    date: string;
    day_number: number;
    day_name: string;
    is_current_month: boolean;
    is_weekend: boolean;
    is_today: boolean;
    daily_hours: number;
    load_level: 'none' | 'free' | 'low' | 'optimal' | 'high';
    projects: {
        id: number;
        name: string;
        code: string;
        client: string;
        hours: number;
        status: string;
        is_due_date: boolean;
    }[];
    expiring_quotes: {
        id: number;
        quote_number: string;
        title: string;
        client?: { company_name: string };
    }[];
}

interface IndexProps {
    year: number;
    month: number;
    monthName: string;
    daysInMonth: DayData[];
    allProjects: { id: number; name: string; code: string }[];
    sellers: { id: number; name: string; email: string }[];
    filters: {
        year: number;
        month: number;
        project_id: number | null;
        seller_id: number | null;
        search: string;
    };
    summary: {
        total_business_days: number;
        avg_daily_load: number;
        active_projects_count: number;
    };
}

const MONTHS_ES = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' },
];

const WEEKDAYS_ES = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
];

const YEARS = [2024, 2025, 2026, 2027, 2028];

export default function Index({
    year,
    month,
    monthName,
    daysInMonth,
    allProjects,
    sellers,
    filters,
    summary,
}: IndexProps) {
    const [selectedYear, setSelectedYear] = useState<number>(filters.year);
    const [selectedMonth, setSelectedMonth] = useState<number>(filters.month);
    const [selectedProject, setSelectedProject] = useState<number | ''>(filters.project_id || '');
    const [selectedSeller, setSelectedSeller] = useState<number | ''>(filters.seller_id || '');
    const [search, setSearch] = useState<string>(filters.search || '');

    const applyFilters = (newParams: Partial<typeof filters>) => {
        router.get(
            route('calendar.index'),
            {
                year: newParams.year ?? selectedYear,
                month: newParams.month ?? selectedMonth,
                project_id: newParams.project_id !== undefined ? newParams.project_id : selectedProject,
                seller_id: newParams.seller_id !== undefined ? newParams.seller_id : selectedSeller,
                search: newParams.search !== undefined ? newParams.search : search,
            },
            { preserveState: true }
        );
    };

    const handlePrevMonth = () => {
        let newMonth = selectedMonth - 1;
        let newYear = selectedYear;
        if (newMonth < 1) {
            newMonth = 12;
            newYear -= 1;
        }
        setSelectedMonth(newMonth);
        setSelectedYear(newYear);
        applyFilters({ year: newYear, month: newMonth });
    };

    const handleNextMonth = () => {
        let newMonth = selectedMonth + 1;
        let newYear = selectedYear;
        if (newMonth > 12) {
            newMonth = 1;
            newYear += 1;
        }
        setSelectedMonth(newMonth);
        setSelectedYear(newYear);
        applyFilters({ year: newYear, month: newMonth });
    };

    const handleResetFilters = () => {
        const now = new Date();
        const curYear = now.getFullYear();
        const curMonth = now.getMonth() + 1;
        setSelectedYear(curYear);
        setSelectedMonth(curMonth);
        setSelectedProject('');
        setSelectedSeller('');
        setSearch('');
        router.get(route('calendar.index'), { year: curYear, month: curMonth }, { preserveState: true });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search });
    };

    const loadColors: Record<string, { bg: string; border: string; text: string; label: string }> = {
        none: { bg: 'bg-white/[0.01]', border: 'border-white/5 opacity-40', text: 'text-white/30', label: 'Fin de Semana (No Laborable)' },
        free: { bg: 'bg-white/[0.02]', border: 'border-white/10', text: 'text-white/40', label: 'Disponible (0h)' },
        low: { bg: 'bg-[#30EEE2]/[0.06]', border: 'border-[#30EEE2]/30', text: 'text-[#30EEE2]', label: 'Carga Ligera (<6h)' },
        optimal: { bg: 'bg-emerald-500/[0.08]', border: 'border-emerald-500/30', text: 'text-emerald-300', label: 'Carga Óptima (6h - 8.5h)' },
        high: { bg: 'bg-amber-500/[0.12]', border: 'border-amber-500/40', text: 'text-amber-300', label: 'Alta Demanda (>8.5h)' },
    };

    return (
        <AppLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#30EEE2]/10 border border-[#30EEE2]/20">
                        <CalendarIcon className="w-5 h-5 text-[#30EEE2]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-heading font-bold text-white leading-tight">
                            Calendario de Disponibilidad & Carga Laboral
                        </h2>
                        <p className="text-xs text-white/50">
                            Planificación en días hábiles (Lunes a Viernes) y seguimiento de hitos de entrega
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`Calendario - ${monthName}`} />

            {/* Barra de Filtros y Período (En el Cuerpo) */}
            <div className="glass-panel p-4 mb-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-white/10">
                    {/* Controles de Navegación Rápida */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 transition-colors"
                            title="Mes Anterior"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <h3 className="text-base font-heading font-bold text-white px-2 capitalize">
                            {monthName}
                        </h3>

                        <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 transition-colors"
                            title="Mes Siguiente"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Botón de Restablecer */}
                    <button
                        type="button"
                        onClick={handleResetFilters}
                        className="btn-xamanen-secondary text-xs px-3 py-1.5 flex items-center gap-1.5"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Mes Actual / Limpiar
                    </button>
                </div>

                {/* Filtros Detallados (Mes, Año, Proyecto, Vendedor, Búsqueda) */}
                <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
                    {/* Selector de Mes */}
                    <div className="lg:col-span-2">
                        <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1">
                            Mes
                        </label>
                        <select
                            value={selectedMonth}
                            onChange={(e) => {
                                const m = Number(e.target.value);
                                setSelectedMonth(m);
                                applyFilters({ month: m });
                            }}
                            className="w-full input-xamanen text-xs bg-[#101522]"
                        >
                            {MONTHS_ES.map((m) => (
                                <option key={m.value} value={m.value}>
                                    {m.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Selector de Año */}
                    <div className="lg:col-span-2">
                        <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1">
                            Año
                        </label>
                        <select
                            value={selectedYear}
                            onChange={(e) => {
                                const y = Number(e.target.value);
                                setSelectedYear(y);
                                applyFilters({ year: y });
                            }}
                            className="w-full input-xamanen text-xs bg-[#101522]"
                        >
                            {YEARS.map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro por Proyecto */}
                    <div className="lg:col-span-3">
                        <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1">
                            Proyecto / Obra
                        </label>
                        <select
                            value={selectedProject}
                            onChange={(e) => {
                                const pid = e.target.value ? Number(e.target.value) : null;
                                setSelectedProject(e.target.value ? Number(e.target.value) : '');
                                applyFilters({ project_id: pid });
                            }}
                            className="w-full input-xamanen text-xs bg-[#101522]"
                        >
                            <option value="">Todos los Proyectos</option>
                            {allProjects.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.code} - {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filtro por Vendedor */}
                    <div className="lg:col-span-2">
                        <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1">
                            Vendedor / Lead
                        </label>
                        <select
                            value={selectedSeller}
                            onChange={(e) => {
                                const sid = e.target.value ? Number(e.target.value) : null;
                                setSelectedSeller(e.target.value ? Number(e.target.value) : '');
                                applyFilters({ seller_id: sid });
                            }}
                            className="w-full input-xamanen text-xs bg-[#101522]"
                        >
                            <option value="">Todos los Vendedores</option>
                            {sellers.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Búsqueda por Nombre / Cliente */}
                    <div className="lg:col-span-3">
                        <label className="block text-[10px] font-semibold text-white/50 uppercase tracking-wider mb-1">
                            Buscar Proyecto o Cliente
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Nombre, código o cliente..."
                                className="w-full input-xamanen text-xs pr-8"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-2 text-white/40 hover:text-white"
                                title="Buscar"
                            >
                                <Search className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Resumen de Capacidad del Mes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="glass-panel p-5">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">
                        Días Hábiles del Mes
                    </span>
                    <p className="text-2xl font-heading font-bold text-white">
                        {summary.total_business_days} días
                    </p>
                    <span className="text-[11px] text-white/40">Lunes a Viernes laborables</span>
                </div>

                <div className="glass-panel p-5">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">
                        Carga Diaria Promedio
                    </span>
                    <p className="text-2xl font-heading font-bold text-[#30EEE2]">
                        {summary.avg_daily_load} hs / día
                    </p>
                    <span className="text-[11px] text-white/40">Capacidad estándar: 8.0 hs/día</span>
                </div>

                <div className="glass-panel p-5">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">
                        Proyectos en Producción
                    </span>
                    <p className="text-2xl font-heading font-bold text-purple-300">
                        {summary.active_projects_count}
                    </p>
                    <span className="text-[11px] text-white/40">Con entregas o sprints en este mes</span>
                </div>
            </div>

            {/* Leyenda de Carga de Trabajo */}
            <div className="glass-panel p-3.5 mb-6 flex flex-wrap items-center justify-between gap-4 text-xs">
                <span className="text-white/60 font-semibold uppercase tracking-wider text-[10px]">
                    Nivel de Carga Laboral:
                </span>
                <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1.5 text-white/50">
                        <span className="w-2.5 h-2.5 rounded-full bg-white/20"></span>
                        Disponible (0h)
                    </span>
                    <span className="flex items-center gap-1.5 text-[#30EEE2]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#30EEE2]"></span>
                        Ligera (&lt;6h)
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-300">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                        Óptima (6h-8.5h)
                    </span>
                    <span className="flex items-center gap-1.5 text-amber-300">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                        Alta Demanda (&gt;8.5h)
                    </span>
                    <span className="flex items-center gap-1.5 text-rose-300">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                        Hito de Entrega
                    </span>
                </div>
            </div>

            {/* Encabezados de Días de la Semana (Español) */}
            <div className="grid grid-cols-7 gap-3 mb-2 text-center">
                {WEEKDAYS_ES.map((dayName, idx) => (
                    <div
                        key={dayName}
                        className={`p-2 rounded-lg text-xs font-bold uppercase tracking-wider ${
                            idx >= 5 ? 'text-white/30 bg-white/[0.01]' : 'text-white/80 bg-white/[0.03]'
                        }`}
                    >
                        {dayName}
                    </div>
                ))}
            </div>

            {/* Matriz de Días del Mes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {daysInMonth.map((day) => {
                    const load = loadColors[day.load_level] || loadColors.free;

                    return (
                        <div
                            key={day.date}
                            className={`glass-panel p-3 min-h-[145px] flex flex-col justify-between transition-all ${
                                !day.is_current_month ? 'opacity-30 bg-black/20' : load.bg
                            } ${load.border} ${
                                day.is_today ? 'ring-2 ring-[#30EEE2] shadow-lg shadow-[#30EEE2]/20' : ''
                            }`}
                        >
                            {/* Cabecera del Día */}
                            <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                                <div className="flex items-baseline gap-1">
                                    <span
                                        className={`font-heading font-bold text-sm ${
                                            day.is_current_month ? 'text-white' : 'text-white/40'
                                        }`}
                                    >
                                        {day.day_number}
                                    </span>
                                    <span className="text-[10px] text-white/40 uppercase font-semibold">
                                        {day.day_name}
                                    </span>
                                </div>

                                {day.is_current_month && !day.is_weekend && day.daily_hours > 0 && (
                                    <span
                                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${load.border} ${load.text}`}
                                    >
                                        {day.daily_hours}h
                                    </span>
                                )}

                                {day.is_weekend && (
                                    <span className="text-[9px] text-white/30 uppercase">FDS</span>
                                )}
                            </div>

                            {/* Proyectos y Tareas del Día */}
                            <div className="space-y-1.5 py-2 flex-1 overflow-hidden">
                                {day.projects.map((prj) => (
                                    <div
                                        key={prj.id}
                                        className={`p-1.5 rounded text-[10px] truncate ${
                                            prj.is_due_date
                                                ? 'bg-rose-500/20 text-rose-200 border border-rose-500/40 font-bold'
                                                : 'bg-white/[0.04] text-white/80 border border-white/5'
                                        }`}
                                        title={`${prj.code}: ${prj.name} - Cliente: ${prj.client} (${prj.hours}h hoy)`}
                                    >
                                        {prj.is_due_date && <span className="text-rose-400 mr-1 font-bold">🏁 ENTREGA:</span>}
                                        <span className="font-mono text-[#30EEE2] mr-1">{prj.code}</span>
                                        <span>{prj.name}</span>
                                    </div>
                                ))}

                                {day.expiring_quotes.map((q) => (
                                    <div
                                        key={q.id}
                                        className="p-1 rounded text-[9px] bg-amber-500/15 text-amber-200 border border-amber-500/30 truncate"
                                        title={`Vence cotización ${q.quote_number}`}
                                    >
                                        ⏳ Vence: {q.quote_number}
                                    </div>
                                ))}
                            </div>

                            {/* Footer del Día */}
                            <div className="text-[9px] text-white/30 pt-1 border-t border-white/5 flex items-center justify-between">
                                <span>
                                    {day.is_weekend
                                        ? 'No laborable'
                                        : day.projects.length > 0
                                        ? `${day.projects.length} ${day.projects.length === 1 ? 'obra' : 'obras'}`
                                        : 'Libre'}
                                </span>
                                {day.is_today && <span className="text-[#30EEE2] font-bold">HOY</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </AppLayout>
    );
}
