import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Client, IndustryType, Quote, QuoteStatus } from '@/types';
import {
    Users,
    ArrowLeft,
    Building2,
    Mail,
    Phone,
    MapPin,
    Calculator,
    Plus,
    Edit,
    Trash2,
    DollarSign,
    TrendingUp,
    FileText,
    FolderKanban,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowUpRight,
    HardHat,
    Leaf,
    ShoppingCart,
    Briefcase,
} from 'lucide-react';

interface ShowProps {
    client: Client;
    stats: {
        total_quoted: number;
        accepted_quoted: number;
        total_quotes_count: number;
        accepted_quotes_count: number;
        active_projects_count: number;
    };
}

export default function Show({ client, stats }: ShowProps) {
    const handleDelete = () => {
        if (confirm(`¿Estás seguro de eliminar a ${client.company_name}? Esta acción no se puede deshacer.`)) {
            router.delete(route('clients.destroy', client.id));
        }
    };

    const industryBadges: Record<IndustryType, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
        mineria: { label: 'Minería & Faena', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', icon: HardHat },
        medio_ambiente: { label: 'Medio Ambiente', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', icon: Leaf },
        comercio: { label: 'Comercio & B2B', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', icon: ShoppingCart },
        servicios: { label: 'Servicios', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', icon: Briefcase },
        otro: { label: 'General / Otro', color: 'text-white/60 bg-white/5 border-white/10', icon: Building2 },
    };

    const statusBadges: Record<QuoteStatus, { label: string; class: string }> = {
        draft: { label: 'Borrador', class: 'bg-white/10 text-white/80 border-white/20' },
        sent: { label: 'Enviado', class: 'bg-[#3C84CE]/20 text-[#30EEE2] border-[#3C84CE]/40' },
        under_review: { label: 'En Negociación', class: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
        accepted: { label: 'Aceptado', class: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
        rejected: { label: 'Rechazado', class: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
        expired: { label: 'Vencido', class: 'bg-gray-500/20 text-gray-400 border-gray-500/40' },
    };

    const IndustryBadge = industryBadges[client.industry] || industryBadges.otro;
    const IndustryIcon = IndustryBadge.icon;

    return (
        <AppLayout
            header={
                <div className="flex items-center gap-3">
                    <Link
                        href={route('clients.index')}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                        title="Volver"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-heading font-bold text-white leading-tight">
                                {client.company_name}
                            </h2>
                            <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${IndustryBadge.color}`}
                            >
                                <IndustryIcon className="w-3 h-3" />
                                {IndustryBadge.label}
                            </span>
                        </div>
                        <p className="text-xs text-white/50">Ficha comercial 360°</p>
                    </div>
                </div>
            }
        >
            <Head title={`Ficha ${client.company_name}`} />

            {/* Barra de Acciones del Cliente (En el Cuerpo) */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl glass-panel mb-6">
                <div className="text-xs text-white/60">
                    Empresa: <strong className="text-white">{client.company_name}</strong> {client.cuit_tax_id ? `(CUIT: ${client.cuit_tax_id})` : ''}
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href={route('clients.edit', client.id)}
                        className="btn-xamanen-secondary text-xs px-3 py-2"
                    >
                        <Edit className="w-3.5 h-3.5" />
                        Editar Cliente
                    </Link>

                    <Link
                        href={route('quotes.create', { client_id: client.id })}
                        className="btn-xamanen-primary text-xs px-3.5 py-2 shadow-lg"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Nueva Cotización
                    </Link>

                    <button
                        type="button"
                        onClick={handleDelete}
                        className="p-2 rounded-lg text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors border border-transparent hover:border-rose-500/20"
                        title="Eliminar Cliente"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* KPIs Financieros del Cliente */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="glass-panel p-5">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">
                        Total Cotizado
                    </span>
                    <p className="text-2xl font-heading font-bold text-white">
                        ${stats.total_quoted.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <span className="text-[11px] text-white/40">{stats.total_quotes_count} propuestas emitidas</span>
                </div>

                <div className="glass-panel p-5">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">
                        Monto Ganado
                    </span>
                    <p className="text-2xl font-heading font-bold text-emerald-400">
                        ${stats.accepted_quoted.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <span className="text-[11px] text-white/40">{stats.accepted_quotes_count} presupuestos aceptados</span>
                </div>

                <div className="glass-panel p-5">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">
                        Tasa de Cierre
                    </span>
                    <p className="text-2xl font-heading font-bold text-[#30EEE2]">
                        {stats.total_quotes_count > 0
                            ? Math.round((stats.accepted_quotes_count / stats.total_quotes_count) * 100)
                            : 0}
                        %
                    </p>
                    <span className="text-[11px] text-white/40">Conversión de propuestas</span>
                </div>

                <div className="glass-panel p-5">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">
                        Proyectos Activos
                    </span>
                    <p className="text-2xl font-heading font-bold text-purple-300">
                        {stats.active_projects_count}
                    </p>
                    <span className="text-[11px] text-white/40">En desarrollo operativo</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* ==================== COLUMNA IZQUIERDA: HISTORIAL DE COTIZACIONES (8 COLUMNAS) ==================== */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="glass-panel p-6">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                            <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                                <FileText className="w-4 h-4 text-[#30EEE2]" />
                                Historial de Presupuestos ({client.quotes?.length || 0})
                            </h3>
                            <Link
                                href={route('quotes.create', { client_id: client.id })}
                                className="text-xs font-semibold text-[#30EEE2] hover:underline flex items-center gap-1"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Cotizar
                            </Link>
                        </div>

                        {client.quotes && client.quotes.length > 0 ? (
                            <div className="space-y-3">
                                {client.quotes.map((q) => {
                                    const Status = statusBadges[q.status] || statusBadges.draft;

                                    return (
                                        <div
                                            key={q.id}
                                            className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-[#30EEE2]/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                        >
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-mono font-bold text-[#30EEE2] text-xs">
                                                        {q.quote_number}
                                                    </span>
                                                    <span
                                                        className={`text-[9px] px-2 py-0.5 rounded-full font-semibold border ${Status.class}`}
                                                    >
                                                        {Status.label}
                                                    </span>
                                                </div>
                                                <h4 className="text-sm font-bold text-white">{q.title}</h4>
                                                <p className="text-xs text-white/50">
                                                    {q.software_type?.name} · {q.total_hours} hs ({q.estimated_business_days} días hábiles)
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                                                <div className="text-right">
                                                    <div className="text-base font-heading font-extrabold text-white">
                                                        ${Number(q.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                    </div>
                                                    <span className="text-[10px] text-white/40">
                                                        {new Date(q.created_at).toLocaleDateString('es-AR')}
                                                    </span>
                                                </div>

                                                <Link
                                                    href={route('quotes.show', q.id)}
                                                    className="p-2 rounded-lg bg-white/5 hover:bg-[#30EEE2]/10 text-white/70 hover:text-[#30EEE2] border border-white/10 transition-colors"
                                                >
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-white/40">
                                <Calculator className="w-8 h-8 mx-auto mb-2 text-white/20" />
                                <p className="text-xs">No hay cotizaciones registradas para este cliente.</p>
                                <Link
                                    href={route('quotes.create', { client_id: client.id })}
                                    className="btn-xamanen-primary text-xs mt-3 inline-flex"
                                >
                                    Crear Primera Cotización
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* ==================== COLUMNA DERECHA: DATOS CORPORATIVOS & NOTAS (4 COLUMNAS) ==================== */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-panel p-6 space-y-4">
                        <h3 className="text-base font-heading font-bold text-white pb-3 border-b border-white/10">
                            Datos de la Organización
                        </h3>

                        <div className="space-y-3 text-xs text-white/80">
                            <div>
                                <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block">
                                    Persona de Contacto
                                </span>
                                <p className="font-semibold text-white text-sm mt-0.5">
                                    {client.contact_name}
                                </p>
                            </div>

                            <div>
                                <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block">
                                    Email de Contacto
                                </span>
                                <a
                                    href={`mailto:${client.email}`}
                                    className="text-[#30EEE2] hover:underline flex items-center gap-1.5 mt-0.5"
                                >
                                    <Mail className="w-3.5 h-3.5" />
                                    {client.email}
                                </a>
                            </div>

                            {client.phone && (
                                <div>
                                    <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block">
                                        Teléfono
                                    </span>
                                    <p className="flex items-center gap-1.5 mt-0.5 text-white">
                                        <Phone className="w-3.5 h-3.5 text-white/50" />
                                        {client.phone}
                                    </p>
                                </div>
                            )}

                            {client.cuit_tax_id && (
                                <div>
                                    <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block">
                                        CUIT / Identificación Fiscal
                                    </span>
                                    <p className="font-mono text-white mt-0.5">{client.cuit_tax_id}</p>
                                </div>
                            )}

                            {client.address && (
                                <div>
                                    <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block">
                                        Dirección
                                    </span>
                                    <p className="flex items-center gap-1.5 mt-0.5 text-white/80">
                                        <MapPin className="w-3.5 h-3.5 text-white/50" />
                                        {client.address}
                                    </p>
                                </div>
                            )}
                        </div>

                        {client.notes && (
                            <div className="pt-3 border-t border-white/10">
                                <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider block mb-1">
                                    Notas Comerciales
                                </span>
                                <p className="text-xs text-white/70 leading-relaxed bg-white/[0.02] p-3 rounded-lg border border-white/5">
                                    {client.notes}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
