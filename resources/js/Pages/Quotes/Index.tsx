import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Client, Quote, QuoteStatus, SoftwareType, User } from '@/types';
import {
    FileText,
    Plus,
    Search,
    Filter,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowUpRight,
    Calculator,
    DollarSign,
    Building2,
    Calendar,
    Briefcase,
    Sparkles,
    UserCheck,
    Lock,
} from 'lucide-react';

interface PaginatedQuotes {
    data: Quote[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface IndexProps {
    quotes: PaginatedQuotes;
    sellers: { id: number; name: string; email: string }[];
    filters: {
        status?: string;
        client_id?: string;
        seller_id?: string;
        search?: string;
    };
    clients: Client[];
    metrics: {
        total_quotes: number;
        total_accepted_amount: number;
        pending_review: number;
        drafts: number;
        my_quotes_count: number;
    };
    currentUserId: number;
}

export default function Index({ quotes, sellers, filters, clients, metrics, currentUserId }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [clientFilter, setClientFilter] = useState(filters.client_id || '');
    const [sellerFilter, setSellerFilter] = useState(filters.seller_id || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('quotes.index'),
            { search, status: statusFilter, client_id: clientFilter, seller_id: sellerFilter },
            { preserveState: true }
        );
    };

    const handleStatusChange = (newStatus: string) => {
        setStatusFilter(newStatus);
        router.get(
            route('quotes.index'),
            { search, status: newStatus, client_id: clientFilter, seller_id: sellerFilter },
            { preserveState: true }
        );
    };

    const handleClientChange = (newClientId: string) => {
        setClientFilter(newClientId);
        router.get(
            route('quotes.index'),
            { search, status: statusFilter, client_id: newClientId, seller_id: sellerFilter },
            { preserveState: true }
        );
    };

    const handleSellerChange = (newSellerId: string) => {
        setSellerFilter(newSellerId);
        router.get(
            route('quotes.index'),
            { search, status: statusFilter, client_id: clientFilter, seller_id: newSellerId },
            { preserveState: true }
        );
    };

    const statusBadges: Record<QuoteStatus, { label: string; class: string; icon: React.ComponentType<{ className?: string }> }> = {
        draft: { label: 'Borrador', class: 'bg-white/10 text-white/80 border-white/20', icon: Clock },
        sent: { label: 'Enviado', class: 'bg-[#3C84CE]/20 text-[#30EEE2] border-[#3C84CE]/40', icon: ArrowUpRight },
        under_review: { label: 'En Negociación', class: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: Clock },
        accepted: { label: 'Aceptado', class: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: CheckCircle2 },
        rejected: { label: 'Rechazado', class: 'bg-rose-500/20 text-rose-300 border-rose-500/40', icon: XCircle },
        expired: { label: 'Vencido', class: 'bg-gray-500/20 text-gray-400 border-gray-500/40', icon: Clock },
    };

    const industryBadges: Record<string, { label: string; color: string }> = {
        mineria: { label: 'Minería', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
        medio_ambiente: { label: 'Medio Ambiente', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
        comercio: { label: 'Comercio', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
        servicios: { label: 'Servicios', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
        otro: { label: 'General', color: 'text-white/60 bg-white/5 border-white/10' },
    };

    return (
        <AppLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#30EEE2]/10 border border-[#30EEE2]/20">
                        <FileText className="w-5 h-5 text-[#30EEE2]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-heading font-bold text-white leading-tight">
                            Historial de Cotizaciones & Propuestas
                        </h2>
                        <p className="text-xs text-white/50">
                            Seguimiento comercial y conversión a proyectos operativos
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Historial de Cotizaciones" />

            {/* Barra de Acciones del Cuerpo */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-sm font-heading font-bold text-white">Resumen Comercial</h3>
                    <p className="text-xs text-white/50">Monitoreo de propuestas emitidas por el equipo</p>
                </div>
                <Link
                    href={route('quotes.create')}
                    className="btn-xamanen-primary text-xs shrink-0 shadow-lg"
                >
                    <Plus className="w-4 h-4" />
                    Nueva Cotización CPQ
                </Link>
            </div>

            {/* KPIs y Métricas Comerciales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="glass-panel p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                            Total Cotizaciones
                        </span>
                        <div className="p-2 rounded-lg bg-white/5 text-[#30EEE2]">
                            <Calculator className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-heading font-bold text-white">
                        {metrics.total_quotes}
                    </p>
                    <span className="text-[11px] text-white/40">
                        {metrics.my_quotes_count} generadas por ti
                    </span>
                </div>

                <div className="glass-panel p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                            Monto Aprobado
                        </span>
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                            <DollarSign className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-heading font-bold text-emerald-300">
                        ${metrics.total_accepted_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <span className="text-[11px] text-white/40">Convertidos a obra</span>
                </div>

                <div className="glass-panel p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                            En Negociación
                        </span>
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                            <Clock className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-heading font-bold text-amber-300">
                        {metrics.pending_review}
                    </p>
                    <span className="text-[11px] text-white/40">Pendientes de decisión</span>
                </div>

                <div className="glass-panel p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                            Borradores
                        </span>
                        <div className="p-2 rounded-lg bg-white/5 text-white/40">
                            <FileText className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-heading font-bold text-white">
                        {metrics.drafts}
                    </p>
                    <span className="text-[11px] text-white/40">Aún no enviadas</span>
                </div>
            </div>

            {/* Barra de Filtros */}
            <div className="glass-panel p-4 mb-6">
                <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
                    {/* Buscador */}
                    <div className="lg:col-span-4 relative">
                        <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar código, título, cliente o vendedor..."
                            className="w-full input-xamanen text-xs pl-9"
                        />
                    </div>

                    {/* Filtro de Estado */}
                    <div className="lg:col-span-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="w-full input-xamanen text-xs bg-[#101522]"
                        >
                            <option value="">Todos los Estados</option>
                            <option value="draft">Borradores</option>
                            <option value="sent">Enviadas</option>
                            <option value="under_review">En Negociación</option>
                            <option value="accepted">Aprobadas</option>
                            <option value="rejected">Rechazadas</option>
                        </select>
                    </div>

                    {/* Filtro de Cliente */}
                    <div className="lg:col-span-3">
                        <select
                            value={clientFilter}
                            onChange={(e) => handleClientChange(e.target.value)}
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

                    {/* Filtro de Vendedor */}
                    <div className="lg:col-span-2">
                        <select
                            value={sellerFilter}
                            onChange={(e) => handleSellerChange(e.target.value)}
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

                    {/* Botón Filtrar */}
                    <div className="lg:col-span-1">
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

            {/* Tabla de Cotizaciones */}
            <div className="glass-panel overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-white/[0.03] text-white/50 border-b border-white/10 uppercase tracking-wider text-[10px]">
                            <tr>
                                <th className="py-3.5 px-4 font-semibold">Código</th>
                                <th className="py-3.5 px-4 font-semibold">Cliente & Rubro</th>
                                <th className="py-3.5 px-4 font-semibold">Título del Proyecto</th>
                                <th className="py-3.5 px-4 font-semibold">Vendedor Titular</th>
                                <th className="py-3.5 px-4 font-semibold">Esfuerzo & Plazo</th>
                                <th className="py-3.5 px-4 font-semibold">Total (USD)</th>
                                <th className="py-3.5 px-4 font-semibold">Estado</th>
                                <th className="py-3.5 px-4 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {quotes.data.length > 0 ? (
                                quotes.data.map((quote) => {
                                    const StatusBadge = statusBadges[quote.status] || statusBadges.draft;
                                    const StatusIcon = StatusBadge.icon;
                                    const industryInfo =
                                        industryBadges[quote.client?.industry || 'otro'] || industryBadges.otro;
                                    const isMyQuote = quote.created_by === currentUserId;

                                    return (
                                        <tr
                                            key={quote.id}
                                            className="hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="py-3.5 px-4 font-mono font-bold text-[#30EEE2]">
                                                <Link
                                                    href={route('quotes.show', quote.id)}
                                                    className="hover:underline"
                                                >
                                                    {quote.quote_number}
                                                </Link>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <div className="font-semibold text-white">
                                                    {quote.client?.company_name || 'Sin cliente'}
                                                </div>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span
                                                        className={`text-[9px] px-1.5 py-0.5 rounded border ${industryInfo.color} font-medium`}
                                                    >
                                                        {industryInfo.label}
                                                    </span>
                                                    <span className="text-[10px] text-white/40">
                                                        {quote.client?.contact_name}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <p className="font-medium text-white truncate max-w-xs">
                                                    {quote.title}
                                                </p>
                                                <p className="text-[10px] text-white/40">
                                                    {quote.software_type?.name}
                                                </p>
                                            </td>

                                            {/* Vendedor Titular */}
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                                                        {quote.creator?.name ? quote.creator.name.charAt(0).toUpperCase() : 'V'}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <span className="text-white font-medium block truncate max-w-[130px]">
                                                            {quote.creator?.name || 'Comercial'}
                                                        </span>
                                                        {isMyQuote && (
                                                            <span className="text-[9px] text-emerald-400 font-bold block">
                                                                (Tu registro)
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <div className="flex items-center gap-1 font-semibold text-white">
                                                    <Clock className="w-3 h-3 text-[#30EEE2]" />
                                                    {quote.total_hours} hs
                                                </div>
                                                <div className="text-[10px] text-white/50">
                                                    {quote.estimated_business_days} días hábiles
                                                </div>
                                            </td>

                                            <td className="py-3.5 px-4 font-heading font-bold text-white text-sm">
                                                ${Number(quote.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${StatusBadge.class}`}
                                                >
                                                    <StatusIcon className="w-3 h-3" />
                                                    {StatusBadge.label}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4 text-right">
                                                <Link
                                                    href={route('quotes.show', quote.id)}
                                                    className="btn-xamanen-secondary text-[11px] px-2.5 py-1.5 inline-flex items-center gap-1"
                                                >
                                                    {isMyQuote ? 'Gestionar' : 'Ver Detalle'}
                                                    <ArrowUpRight className="w-3 h-3" />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="py-12 text-center text-white/40"
                                    >
                                        No se encontraron cotizaciones registradas con los filtros seleccionados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
