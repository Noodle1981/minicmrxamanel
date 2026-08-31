import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { Client, Project, Quote, QuoteStatus } from '@/types';
import {
    FileText,
    FolderKanban,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowUpRight,
    Sparkles,
    Shield,
    Calendar,
    Briefcase,
    Building2,
} from 'lucide-react';

interface DashboardProps {
    client: Client | null;
    quotes: Quote[];
    projects: Project[];
    summary: {
        active_quotes: number;
        accepted_quotes: number;
        active_projects: number;
    };
}

export default function Dashboard({ client, quotes, projects, summary }: DashboardProps) {
    const statusBadges: Record<QuoteStatus, { label: string; class: string }> = {
        draft: { label: 'Borrador', class: 'bg-white/10 text-white/80 border-white/20' },
        sent: { label: 'Pendiente de tu Aprobación', class: 'bg-[#3C84CE]/20 text-[#30EEE2] border-[#3C84CE]/40 font-bold' },
        under_review: { label: 'En Revisión', class: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
        accepted: { label: 'Aprobado', class: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
        rejected: { label: 'Rechazado', class: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
        expired: { label: 'Vencido', class: 'bg-gray-500/20 text-gray-400 border-gray-500/40' },
    };

    return (
        <AppLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-heading font-bold text-white leading-tight">
                                Portal del Cliente — {client?.company_name || 'Mi Cuenta'}
                            </h2>
                            <p className="text-xs text-white/50">
                                Consulta tus cotizaciones vigentes, aprueba propuestas y sigue el avance de tus proyectos
                            </p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Portal del Cliente" />

            {/* Banner de Bienvenida */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#101522] via-[#161D2E] to-[#101522] border border-white/10 p-8 mb-8 shadow-2xl">
                <div className="max-w-2xl">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#30EEE2]/10 text-[#30EEE2] text-xs font-semibold uppercase tracking-wider mb-3 border border-[#30EEE2]/30">
                        <Sparkles className="w-3.5 h-3.5" /> Portal de Seguimiento & Transparencia
                    </span>
                    <h1 className="text-2xl lg:text-3xl font-heading font-bold text-white mb-2">
                        Bienvenido, {client?.contact_name || 'Cliente'}
                    </h1>
                    <p className="text-white/70 text-xs lg:text-sm leading-relaxed">
                        Aquí puedes revisar detalladamente las propuestas técnicas preparadas por el equipo de <strong className="text-white">Grupo Xamanen</strong>, aprobar cotizaciones para iniciar su desarrollo de inmediato y consultar los plazos comprometidos.
                    </p>
                </div>
            </div>

            {/* Resumen Métrico para el Cliente */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-panel p-5 border-[#30EEE2]/30">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                            Propuestas Pendientes
                        </span>
                        <div className="p-2 rounded-lg bg-[#30EEE2]/10 text-[#30EEE2]">
                            <FileText className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-heading font-bold text-[#30EEE2]">{summary.active_quotes}</p>
                    <span className="text-[11px] text-white/40">Requieren tu revisión / aprobación</span>
                </div>

                <div className="glass-panel p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                            Presupuestos Aprobados
                        </span>
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                            <CheckCircle2 className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-heading font-bold text-emerald-400">{summary.accepted_quotes}</p>
                    <span className="text-[11px] text-white/40">Listos o en ejecución</span>
                </div>

                <div className="glass-panel p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                            Proyectos en Curso
                        </span>
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-300">
                            <FolderKanban className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-3xl font-heading font-bold text-purple-300">{summary.active_projects}</p>
                    <span className="text-[11px] text-white/40">En desarrollo y validación</span>
                </div>
            </div>

            {/* Listado de Cotizaciones Disponibles para el Cliente */}
            <div className="glass-panel p-6 mb-8">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
                    <div>
                        <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#30EEE2]" />
                            Tus Presupuestos & Cotizaciones
                        </h3>
                        <p className="text-xs text-white/50">
                            Haz clic en "Revisar Propuesta" para ver el desglose técnico y confirmar la orden de trabajo
                        </p>
                    </div>
                </div>

                {quotes.length > 0 ? (
                    <div className="space-y-4">
                        {quotes.map((quote) => {
                            const Status = statusBadges[quote.status] || statusBadges.draft;

                            return (
                                <div
                                    key={quote.id}
                                    className="p-5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-[#30EEE2]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                                >
                                    <div>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="font-mono font-bold text-[#30EEE2] text-xs">
                                                {quote.quote_number}
                                            </span>
                                            <span
                                                className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border ${Status.class}`}
                                            >
                                                {Status.label}
                                            </span>
                                        </div>
                                        <h4 className="text-base font-heading font-bold text-white mb-1">
                                            {quote.title}
                                        </h4>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/60">
                                            <span>Tipo: <strong className="text-white">{quote.software_type?.name}</strong></span>
                                            <span>·</span>
                                            <span>Plazo estimado: <strong className="text-[#30EEE2]">{quote.estimated_business_days} días hábiles</strong></span>
                                            <span>·</span>
                                            <span>Emisión: {new Date(quote.created_at).toLocaleDateString('es-AR')}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-white/10">
                                        <div className="text-left md:text-right">
                                            <span className="text-[10px] text-white/40 uppercase tracking-wider block">
                                                Inversión Total
                                            </span>
                                            <div className="text-xl font-heading font-extrabold text-white">
                                                ${Number(quote.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                                            </div>
                                        </div>

                                        <Link
                                            href={route('portal.quotes.show', quote.id)}
                                            className={`btn-xamanen-primary text-xs px-4 py-2.5 ${
                                                quote.status === 'sent'
                                                    ? 'animate-pulse ring-2 ring-[#30EEE2]/50'
                                                    : ''
                                            }`}
                                        >
                                            Revisar Propuesta
                                            <ArrowUpRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-12 text-center text-white/40">
                        <FileText className="w-10 h-10 mx-auto mb-2 text-white/20" />
                        <p className="text-sm text-white/60">Aún no tienes cotizaciones activas asignadas.</p>
                        <p className="text-xs text-white/40 mt-1">
                            Un asesor de Grupo Xamanen se comunicará contigo para preparar tu propuesta a medida.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
