import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    FolderKanban,
    AlertCircle,
    CheckCircle2,
    Sparkles,
    Briefcase,
    Building2,
    Layers,
} from 'lucide-react';

interface DayData {
    date: string;
    day_number: number;
    day_name: string;
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
    month: string; // YYYY-MM
    monthName: string;
    daysInMonth: DayData[];
    projects: any[];
    summary: {
        total_business_days: number;
        avg_daily_load: number;
        active_projects_count: number;
    };
}

export default function Index({ month, monthName, daysInMonth, projects, summary }: IndexProps) {
    const handlePrevMonth = () => {
        const d = new Date(month + '-01');
        d.setMonth(d.getMonth() - 1);
        const newMonth = d.toISOString().slice(0, 7);
        router.get(route('calendar.index'), { month: newMonth }, { preserveState: true });
    };

    const handleNextMonth = () => {
        const d = new Date(month + '-01');
        d.setMonth(d.getMonth() + 1);
        const newMonth = d.toISOString().slice(0, 7);
        router.get(route('calendar.index'), { month: newMonth }, { preserveState: true });
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
            <Head title="Calendario & Disponibilidad" />

            {/* Barra de Control de Período / Mes (En el Cuerpo) */}
            <div className="glass-panel p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h3 className="text-sm font-heading font-bold text-white">Planificación Mensual</h3>
                    <p className="text-xs text-white/50">Cálculo de horas comprometidas y capacidad del equipo técnico</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handlePrevMonth}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 transition-colors"
                        title="Mes Anterior"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-heading font-bold text-white capitalize px-3">
                        {monthName}
                    </span>
                    <button
                        type="button"
                        onClick={handleNextMonth}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 transition-colors"
                        title="Mes Siguiente"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
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
                    <span className="text-[11px] text-white/40">Excluye sábados y domingos</span>
                </div>

                <div className="glass-panel p-5">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">
                        Carga Diaria Promedio
                    </span>
                    <p className="text-2xl font-heading font-bold text-[#30EEE2]">
                        {summary.avg_daily_load} hs / día
                    </p>
                    <span className="text-[11px] text-white/40">Sobre capacidad base de 8 hs/día</span>
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
                        Óptima (6h-8h)
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

            {/* Matriz de Días del Mes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
                {daysInMonth.map((day) => {
                    const load = loadColors[day.load_level] || loadColors.free;

                    return (
                        <div
                            key={day.date}
                            className={`glass-panel p-3.5 min-h-[140px] flex flex-col justify-between transition-all ${
                                load.bg
                            } ${load.border} ${
                                day.is_today ? 'ring-2 ring-[#30EEE2] shadow-lg shadow-[#30EEE2]/20' : ''
                            }`}
                        >
                            {/* Cabecera del Día */}
                            <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                                <div className="flex items-baseline gap-1">
                                    <span className="font-heading font-bold text-base text-white">
                                        {day.day_number}
                                    </span>
                                    <span className="text-[10px] text-white/40 uppercase font-semibold">
                                        {day.day_name}
                                    </span>
                                </div>

                                {!day.is_weekend && day.daily_hours > 0 && (
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
                                        title={`${prj.code}: ${prj.name} (${prj.hours}h asignadas hoy)`}
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
                                <span>{day.is_weekend ? 'No laborable' : `${day.projects.length} obras`}</span>
                                {day.is_today && <span className="text-[#30EEE2] font-bold">HOY</span>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </AppLayout>
    );
}
