import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Client, IndustryType } from '@/types';
import {
    Users,
    Plus,
    Search,
    Filter,
    HardHat,
    Leaf,
    ShoppingCart,
    Factory,
    Briefcase,
    Building2,
    Calculator,
    ArrowUpRight,
    Mail,
    Phone,
    FileText,
} from 'lucide-react';

interface PaginatedClients {
    data: (Client & { quotes_count?: number; projects_count?: number })[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface IndexProps {
    clients: PaginatedClients;
    filters: {
        industry?: string;
        search?: string;
    };
    metrics: {
        total_clients: number;
        mining_count: number;
        environment_count: number;
        commerce_count: number;
        total_quotes: number;
    };
}

export default function Index({ clients, filters, metrics }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [industryFilter, setIndustryFilter] = useState(filters.industry || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('clients.index'),
            { search, industry: industryFilter },
            { preserveState: true }
        );
    };

    const handleIndustryChange = (newIndustry: string) => {
        setIndustryFilter(newIndustry);
        router.get(
            route('clients.index'),
            { search, industry: newIndustry },
            { preserveState: true }
        );
    };

    const industryBadges: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
        mineria: { label: 'Minería & Faena', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', icon: HardHat },
        medio_ambiente: { label: 'Medio Ambiente', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', icon: Leaf },
        comercio: { label: 'Comercio & B2B', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', icon: ShoppingCart },
        industria: { label: 'Industria & Planta', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', icon: Factory },
        servicios: { label: 'Servicios & Consultoría', color: 'text-teal-400 bg-teal-500/10 border-teal-500/30', icon: Briefcase },
        otro: { label: 'General / Otro', color: 'text-white/60 bg-white/5 border-white/10', icon: Building2 },
    };

    return (
        <AppLayout
            header={
                <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-[#30EEE2]/10 border border-[#30EEE2]/20 shrink-0">
                        <Users className="w-5 h-5 text-[#30EEE2]" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-sm sm:text-xl font-heading font-bold text-white leading-tight truncate">
                            Gestión de Clientes (Mini-CRM)
                        </h2>
                        <p className="text-xs text-white/50 hidden sm:block truncate">
                            Segmentación por industria y seguimiento comercial 360°
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Clientes - Mini-CRM" />

            {/* Barra de Acciones del Cuerpo */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-sm font-heading font-bold text-white">Directorio de Empresas</h3>
                    <p className="text-xs text-white/50">Cartera activa de clientes categorizada por industria</p>
                </div>
                <Link
                    href={route('clients.create')}
                    className="btn-xamanen-primary text-xs shrink-0 shadow-lg"
                >
                    <Plus className="w-4 h-4" />
                    Registrar Nuevo Cliente
                </Link>
            </div>

            {/* KPIs de Cartera por Industria */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="glass-panel p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                            Total Cartera
                        </span>
                        <div className="p-2 rounded-lg bg-white/5 text-[#30EEE2]">
                            <Users className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-heading font-bold text-white">{metrics.total_clients}</p>
                    <span className="text-[11px] text-white/40">Empresas registradas</span>
                </div>

                <div className="glass-panel p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                            Sector Minero
                        </span>
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                            <HardHat className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-heading font-bold text-amber-400">{metrics.mining_count}</p>
                    <span className="text-[11px] text-white/40">Faenas y contratistas</span>
                </div>

                <div className="glass-panel p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                            Medio Ambiente
                        </span>
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                            <Leaf className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-heading font-bold text-emerald-400">{metrics.environment_count}</p>
                    <span className="text-[11px] text-white/40">Consultoras y monitoreo</span>
                </div>

                <div className="glass-panel p-5">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                            Comercio & B2B
                        </span>
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                            <ShoppingCart className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl font-heading font-bold text-blue-400">{metrics.commerce_count}</p>
                    <span className="text-[11px] text-white/40">Distribuidores y e-commerce</span>
                </div>
            </div>

            {/* Filtros y Buscador */}
            <div className="glass-panel p-4 mb-6">
                <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-7 relative">
                        <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por empresa, contacto, CUIT o email..."
                            className="w-full input-xamanen text-xs pl-9"
                        />
                    </div>

                    <div className="sm:col-span-4">
                        <select
                            value={industryFilter}
                            onChange={(e) => handleIndustryChange(e.target.value)}
                            className="w-full input-xamanen text-xs bg-[#101522]"
                        >
                            <option value="">Todos los Sectores</option>
                            <option value="mineria">Minería & Faena</option>
                            <option value="medio_ambiente">Medio Ambiente</option>
                            <option value="comercio">Comercio & B2B</option>
                            <option value="servicios">Servicios</option>
                            <option value="otro">Otro</option>
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

            {/* Tabla de Clientes */}
            <div className="glass-panel overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-white/[0.03] text-white/50 border-b border-white/10 uppercase tracking-wider text-[10px]">
                            <tr>
                                <th className="py-3.5 px-4 font-semibold">Empresa / Razón Social</th>
                                <th className="py-3.5 px-4 font-semibold">Contacto Principal</th>
                                <th className="py-3.5 px-4 font-semibold">Sector / Rubro</th>
                                <th className="py-3.5 px-4 font-semibold">Contacto Directo</th>
                                <th className="py-3.5 px-4 font-semibold text-center">Presupuestos</th>
                                <th className="py-3.5 px-4 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {clients.data.length > 0 ? (
                                clients.data.map((client) => {
                                    const IndustryBadge =
                                        industryBadges[client.industry] || industryBadges.otro;
                                    const IndustryIcon = IndustryBadge.icon;

                                    return (
                                        <tr key={client.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="py-3.5 px-4">
                                                <Link
                                                    href={route('clients.show', client.id)}
                                                    className="font-bold text-white hover:text-[#30EEE2] transition-colors text-sm"
                                                >
                                                    {client.company_name}
                                                </Link>
                                                {client.cuit_tax_id && (
                                                    <span className="text-[10px] text-white/40 block">
                                                        CUIT: {client.cuit_tax_id}
                                                    </span>
                                                )}
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span className="font-medium text-white block">
                                                    {client.contact_name}
                                                </span>
                                                <span className="text-[10px] text-white/40">
                                                    Registrado por: {client.creator?.name || 'Sistema'}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${IndustryBadge.color}`}
                                                >
                                                    <IndustryIcon className="w-3 h-3" />
                                                    {IndustryBadge.label}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4 space-y-0.5">
                                                <div className="flex items-center gap-1.5 text-white/80">
                                                    <Mail className="w-3 h-3 text-[#30EEE2]" />
                                                    <span>{client.email}</span>
                                                </div>
                                                {client.phone && (
                                                    <div className="flex items-center gap-1.5 text-white/50 text-[11px]">
                                                        <Phone className="w-3 h-3 text-white/30" />
                                                        <span>{client.phone}</span>
                                                    </div>
                                                )}
                                            </td>

                                            <td className="py-3.5 px-4 text-center">
                                                <span className="font-bold text-white px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                                                    {client.quotes_count || 0}
                                                </span>
                                            </td>

                                            <td className="py-3.5 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={route('quotes.create', { client_id: client.id })}
                                                        className="p-1.5 rounded-lg bg-[#30EEE2]/10 hover:bg-[#30EEE2]/20 text-[#30EEE2] border border-[#30EEE2]/30 transition-colors"
                                                        title="Nueva Cotización para este Cliente"
                                                    >
                                                        <Calculator className="w-3.5 h-3.5" />
                                                    </Link>

                                                    <Link
                                                        href={route('clients.show', client.id)}
                                                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 transition-colors font-semibold"
                                                    >
                                                        Ficha 360°
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-white/40">
                                        <Users className="w-8 h-8 mx-auto mb-2 text-white/20" />
                                        No se encontraron clientes registrados con los filtros actuales.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {clients.links.length > 3 && (
                    <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="text-white/50">
                            Mostrando {clients.data.length} de {clients.total} clientes
                        </span>
                        <div className="flex gap-1">
                            {clients.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 rounded-lg border text-xs ${
                                        link.active
                                            ? 'bg-[#30EEE2] text-[#0A0C10] font-bold border-[#30EEE2]'
                                            : link.url
                                            ? 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
                                            : 'text-white/20 border-transparent cursor-not-allowed'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
