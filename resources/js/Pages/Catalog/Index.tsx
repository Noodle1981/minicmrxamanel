import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Feature, SoftwareType } from '@/types';
import {
    Layers,
    Search,
    Filter,
    Plus,
    Edit,
    Cpu,
    Server,
    HardHat,
    Leaf,
    ShoppingCart,
    Factory,
    Briefcase,
    CheckCircle2,
    Clock,
    DollarSign,
    Sparkles,
    Shield,
} from 'lucide-react';

interface PaginatedFeatures {
    data: Feature[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface IndexProps {
    features: PaginatedFeatures;
    softwareTypes: SoftwareType[];
    categories: string[];
    filters: {
        category?: string;
        preset?: string;
        search?: string;
    };
    metrics: {
        total_features: number;
        mining_preset_count: number;
        environment_preset_count: number;
        commerce_preset_count: number;
        industry_preset_count: number;
        services_preset_count: number;
        avg_dev_hours: number;
        avg_qa_hours: number;
    };
}

export default function Index({ features, softwareTypes, categories, filters, metrics }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category || '');
    const [presetFilter, setPresetFilter] = useState(filters.preset || '');

    // Modal de Creación / Edición
    const [modalOpen, setModalOpen] = useState(false);
    const [editingFeature, setEditingFeature] = useState<Feature | null>(null);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        software_type_id: null as number | null,
        category: '',
        name: '',
        description: '',
        hours_dev: 12,
        hours_integration: 4,
        hours_testing_qa: 6,
        cost_setup_infra: 0,
        cost_monthly_infra: 0,
        is_preset_mining: false,
        is_preset_environment: false,
        is_preset_commerce: false,
        is_preset_industry: false,
        is_preset_services: false,
        is_active: true,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('catalog.index'),
            { search, category: categoryFilter, preset: presetFilter },
            { preserveState: true }
        );
    };

    const openCreateModal = () => {
        setEditingFeature(null);
        reset();
        setData({
            software_type_id: softwareTypes[0]?.id || null,
            category: categories[0] || 'Core',
            name: '',
            description: '',
            hours_dev: 12,
            hours_integration: 4,
            hours_testing_qa: 6,
            cost_setup_infra: 0,
            cost_monthly_infra: 0,
            is_preset_mining: false,
            is_preset_environment: false,
            is_preset_commerce: false,
            is_preset_industry: false,
            is_preset_services: false,
            is_active: true,
        });
        setModalOpen(true);
    };

    const openEditModal = (feat: Feature) => {
        setEditingFeature(feat);
        setData({
            software_type_id: feat.software_type_id || null,
            category: feat.category,
            name: feat.name,
            description: feat.description || '',
            hours_dev: feat.hours_dev,
            hours_integration: feat.hours_integration,
            hours_testing_qa: feat.hours_testing_qa,
            cost_setup_infra: feat.cost_setup_infra,
            cost_monthly_infra: feat.cost_monthly_infra,
            is_preset_mining: feat.is_preset_mining,
            is_preset_environment: feat.is_preset_environment,
            is_preset_commerce: feat.is_preset_commerce,
            is_preset_industry: feat.is_preset_industry || false,
            is_preset_services: feat.is_preset_services || false,
            is_active: feat.is_active,
        });
        setModalOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingFeature) {
            patch(route('catalog.update', editingFeature.id), {
                onSuccess: () => setModalOpen(false),
            });
        } else {
            post(route('catalog.store'), {
                onSuccess: () => setModalOpen(false),
            });
        }
    };

    return (
        <AppLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#30EEE2]/10 border border-[#30EEE2]/20">
                        <Layers className="w-5 h-5 text-[#30EEE2]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-heading font-bold text-white leading-tight">
                            Catálogo & Matriz de Esfuerzo IA
                        </h2>
                        <p className="text-xs text-white/50">
                            Parámetros técnicos de desarrollo, horas de ingeniería y presets industriales
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Catálogo & Matriz IA" />

            {/* Barra de Acciones del Cuerpo */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-sm font-heading font-bold text-white">Módulos de Software</h3>
                    <p className="text-xs text-white/50">
                        Configura las horas base requeridas en la era de la IA (Dev + Integración + QA)
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreateModal}
                    className="btn-xamanen-primary text-xs shrink-0 shadow-lg"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Módulo
                </button>
            </div>

            {/* KPIs de la Matriz de Esfuerzo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="glass-panel p-5">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">
                        Módulos en Catálogo
                    </span>
                    <p className="text-2xl font-heading font-bold text-white">{metrics.total_features}</p>
                    <span className="text-[11px] text-white/40">Componentes reutilizables</span>
                </div>

                <div className="glass-panel p-5">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">
                        Promedio Horas Dev
                    </span>
                    <p className="text-2xl font-heading font-bold text-[#30EEE2]">{metrics.avg_dev_hours} hs</p>
                    <span className="text-[11px] text-white/40">Con aceleración asistida por IA</span>
                </div>

                <div className="glass-panel p-5">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">
                        Promedio Testing QA
                    </span>
                    <p className="text-2xl font-heading font-bold text-amber-400">{metrics.avg_qa_hours} hs</p>
                    <span className="text-[11px] text-white/40">Validación y cobertura</span>
                </div>

                <div className="glass-panel p-5">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">
                        Presets Disponibles
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold" title="Minería">
                            ⛏️ {metrics.mining_preset_count}
                        </span>
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold" title="Medio Ambiente">
                            🌱 {metrics.environment_preset_count}
                        </span>
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold" title="Comercio">
                            🛒 {metrics.commerce_preset_count}
                        </span>
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold" title="Industria">
                            🏭 {metrics.industry_preset_count || 0}
                        </span>
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold" title="Servicios">
                            💼 {metrics.services_preset_count || 0}
                        </span>
                    </div>
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
                            placeholder="Buscar módulo por nombre o descripción..."
                            className="w-full input-xamanen text-xs pl-9"
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <select
                            value={categoryFilter}
                            onChange={(e) => {
                                setCategoryFilter(e.target.value);
                                router.get(
                                    route('catalog.index'),
                                    { search, category: e.target.value, preset: presetFilter },
                                    { preserveState: true }
                                );
                            }}
                            className="w-full input-xamanen text-xs bg-[#101522]"
                        >
                            <option value="">Todas las Categorías</option>
                            {categories.map((c, i) => (
                                <option key={i} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="sm:col-span-3">
                        <select
                            value={presetFilter}
                            onChange={(e) => {
                                setPresetFilter(e.target.value);
                                router.get(
                                    route('catalog.index'),
                                    { search, category: categoryFilter, preset: e.target.value },
                                    { preserveState: true }
                                );
                            }}
                            className="w-full input-xamanen text-xs bg-[#101522]"
                        >
                            <option value="">Todos los Presets</option>
                            <option value="mining">Preset Minería & HSE</option>
                            <option value="environment">Preset Medio Ambiente</option>
                            <option value="commerce">Preset Comercio & B2B</option>
                            <option value="industry">Preset Industria & Planta</option>
                            <option value="services">Preset Servicios & Consultoría</option>
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

            {/* Tabla de Módulos y Matriz IA */}
            <div className="glass-panel overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-white/[0.04] text-white/60 uppercase text-[10px] tracking-wider border-b border-white/15">
                            <tr>
                                <th className="py-4 px-5 min-w-[360px]">Módulo / Feature & Alcance Técnico</th>
                                <th className="py-4 px-5 min-w-[140px]">Categoría</th>
                                <th className="py-4 px-5 text-center whitespace-nowrap">Matriz de Horas (Dev / Int / QA)</th>
                                <th className="py-4 px-5 text-center whitespace-nowrap">Total hs</th>
                                <th className="py-4 px-5 text-center whitespace-nowrap">Infraestructura</th>
                                <th className="py-4 px-5 text-center whitespace-nowrap">Presets</th>
                                <th className="py-4 px-5 text-right whitespace-nowrap">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {features.data.map((feat) => {
                                const totalHours = Number(feat.hours_dev) + Number(feat.hours_integration) + Number(feat.hours_testing_qa);

                                return (
                                    <tr key={feat.id} className="hover:bg-white/[0.03] transition-colors">
                                        <td className="py-5 px-5 align-top">
                                            <div className="font-heading font-bold text-white text-[13px] tracking-tight">
                                                {feat.name}
                                            </div>
                                            {feat.description && (
                                                <p className="text-[11px] text-white/55 mt-1.5 leading-relaxed max-w-xl">
                                                    {feat.description}
                                                </p>
                                            )}
                                        </td>

                                        <td className="py-5 px-5 align-top">
                                            <span className="text-[10px] px-2.5 py-1 rounded-md bg-white/[0.06] text-white/80 border border-white/10 font-semibold inline-block">
                                                {feat.category}
                                            </span>
                                        </td>

                                        <td className="py-5 px-5 text-center align-top whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-1.5 font-mono text-xs">
                                                <span className="text-indigo-300 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20" title="Horas Dev">{feat.hours_dev}d Dev</span>
                                                <span className="text-white/30">+</span>
                                                <span className="text-cyan-300 font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20" title="Horas Integración">{feat.hours_integration}i Int</span>
                                                <span className="text-white/30">+</span>
                                                <span className="text-amber-300 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20" title="Horas QA">{feat.hours_testing_qa}q QA</span>
                                            </div>
                                        </td>

                                        <td className="py-5 px-5 text-center align-top whitespace-nowrap">
                                            <span className="font-heading font-extrabold text-[#30EEE2] text-sm block">
                                                {totalHours} hs
                                            </span>
                                        </td>

                                        <td className="py-5 px-5 text-center align-top font-mono text-xs text-white/70 whitespace-nowrap">
                                            {feat.cost_setup_infra > 0 || feat.cost_monthly_infra > 0 ? (
                                                <div>
                                                    <div className="text-white font-medium">${feat.cost_setup_infra} setup</div>
                                                    <div className="text-[10px] text-purple-300">${feat.cost_monthly_infra}/mes</div>
                                                </div>
                                            ) : (
                                                <span className="text-white/30">—</span>
                                            )}
                                        </td>

                                        <td className="py-5 px-5 text-center align-top">
                                            <div className="flex flex-wrap items-center justify-center gap-1 max-w-[160px] mx-auto">
                                                {feat.is_preset_mining && (
                                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium" title="Minería">
                                                        ⛏️ Min
                                                    </span>
                                                )}
                                                {feat.is_preset_environment && (
                                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium" title="Medio Ambiente">
                                                        🌱 Amb
                                                    </span>
                                                )}
                                                {feat.is_preset_commerce && (
                                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium" title="Comercio">
                                                        🛒 Com
                                                    </span>
                                                )}
                                                {feat.is_preset_industry && (
                                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium" title="Industria">
                                                        🏭 Ind
                                                    </span>
                                                )}
                                                {feat.is_preset_services && (
                                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-medium" title="Servicios">
                                                        💼 Srv
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="py-5 px-5 text-right align-top whitespace-nowrap">
                                            <button
                                                type="button"
                                                onClick={() => openEditModal(feat)}
                                                className="btn-xamanen-secondary text-[11px] px-3 py-1.5 inline-flex items-center gap-1"
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {features.links && features.links.length > 3 && (
                    <div className="p-4 border-t border-white/10 flex items-center justify-between">
                        <span className="text-xs text-white/50">
                            Mostrando página {features.current_page} de {features.last_page} ({features.total} módulos en total)
                        </span>
                        <div className="flex items-center gap-1">
                            {features.links.map((link, i) => (
                                <button
                                    key={i}
                                    onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                    disabled={!link.url || link.active}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1 text-xs rounded-lg transition-all ${
                                        link.active
                                            ? 'bg-[#30EEE2] text-[#0A0C10] font-bold shadow-md shadow-[#30EEE2]/20'
                                            : link.url
                                            ? 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                                            : 'bg-transparent text-white/20 cursor-not-allowed'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ==================== MODAL DE CREACIÓN / EDICIÓN ==================== */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="glass-panel p-6 max-w-xl w-full border-white/20 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <h3 className="text-base font-heading font-bold text-white">
                                {editingFeature ? `Editar Módulo: ${editingFeature.name}` : 'Crear Nuevo Módulo en Catálogo'}
                            </h3>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-white/40 hover:text-white text-xs"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                        Nombre del Módulo
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Ej. Control de Calidad en Línea"
                                        className="w-full input-xamanen text-xs"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                        Categoría
                                    </label>
                                    <input
                                        type="text"
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        placeholder="Ej. Industria & Manufactura, Servicios..."
                                        className="w-full input-xamanen text-xs"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                        Tipo de Software Base
                                    </label>
                                    <select
                                        value={data.software_type_id || ''}
                                        onChange={(e) => setData('software_type_id', e.target.value ? Number(e.target.value) : null)}
                                        className="w-full input-xamanen text-xs bg-[#101522]"
                                    >
                                        <option value="">Aplicable a Cualquier Tipo</option>
                                        {softwareTypes.map((st) => (
                                            <option key={st.id} value={st.id}>
                                                {st.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                        Estado
                                    </label>
                                    <label className="flex items-center gap-2 pt-2 cursor-pointer text-xs">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="rounded border-white/20 text-[#30EEE2] focus:ring-[#30EEE2]"
                                        />
                                        <span className="text-white/80">Módulo Activo en Cotizador</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                    Descripción Técnica
                                </label>
                                <textarea
                                    rows={2}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Alcance, arquitectura y entregables del módulo..."
                                    className="w-full input-xamanen text-xs"
                                />
                            </div>

                            {/* Matriz de Horas IA */}
                            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
                                <span className="text-xs font-bold text-[#30EEE2] uppercase tracking-wider block">
                                    Matriz de Esfuerzo (Era IA)
                                </span>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-[11px] text-white/60 mb-1">Horas Dev</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.hours_dev}
                                            onChange={(e) => setData('hours_dev', Number(e.target.value))}
                                            className="w-full input-xamanen text-xs"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] text-white/60 mb-1">Horas Int/APIs</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.hours_integration}
                                            onChange={(e) => setData('hours_integration', Number(e.target.value))}
                                            className="w-full input-xamanen text-xs"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] text-white/60 mb-1">Horas QA/Testing</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.hours_testing_qa}
                                            onChange={(e) => setData('hours_testing_qa', Number(e.target.value))}
                                            className="w-full input-xamanen text-xs"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Costos de Infraestructura */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] text-white/60 mb-1">Setup Infraestructura ($ USD)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.cost_setup_infra}
                                        onChange={(e) => setData('cost_setup_infra', Number(e.target.value))}
                                        className="w-full input-xamanen text-xs"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] text-white/60 mb-1">Costo Mensual Cloud ($ USD)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.cost_monthly_infra}
                                        onChange={(e) => setData('cost_monthly_infra', Number(e.target.value))}
                                        className="w-full input-xamanen text-xs"
                                    />
                                </div>
                            </div>

                            {/* Checkboxes de Presets Industriales */}
                            <div>
                                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                                    Presets Industriales Predeterminados
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                    <label className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/10 cursor-pointer text-xs">
                                        <input
                                            type="checkbox"
                                            checked={data.is_preset_mining}
                                            onChange={(e) => setData('is_preset_mining', e.target.checked)}
                                            className="rounded border-white/20 text-[#30EEE2] focus:ring-[#30EEE2]"
                                        />
                                        <span>⛏️ Minería</span>
                                    </label>

                                    <label className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/10 cursor-pointer text-xs">
                                        <input
                                            type="checkbox"
                                            checked={data.is_preset_environment}
                                            onChange={(e) => setData('is_preset_environment', e.target.checked)}
                                            className="rounded border-white/20 text-[#30EEE2] focus:ring-[#30EEE2]"
                                        />
                                        <span>🌱 Medio Ambiente</span>
                                    </label>

                                    <label className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/10 cursor-pointer text-xs">
                                        <input
                                            type="checkbox"
                                            checked={data.is_preset_commerce}
                                            onChange={(e) => setData('is_preset_commerce', e.target.checked)}
                                            className="rounded border-white/20 text-[#30EEE2] focus:ring-[#30EEE2]"
                                        />
                                        <span>🛒 Comercio</span>
                                    </label>

                                    <label className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/10 cursor-pointer text-xs">
                                        <input
                                            type="checkbox"
                                            checked={data.is_preset_industry}
                                            onChange={(e) => setData('is_preset_industry', e.target.checked)}
                                            className="rounded border-white/20 text-[#30EEE2] focus:ring-[#30EEE2]"
                                        />
                                        <span>🏭 Industria</span>
                                    </label>

                                    <label className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/10 cursor-pointer text-xs">
                                        <input
                                            type="checkbox"
                                            checked={data.is_preset_services}
                                            onChange={(e) => setData('is_preset_services', e.target.checked)}
                                            className="rounded border-white/20 text-[#30EEE2] focus:ring-[#30EEE2]"
                                        />
                                        <span>💼 Servicios</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="btn-xamanen-secondary text-xs"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="btn-xamanen-primary text-xs"
                                >
                                    {editingFeature ? 'Guardar Cambios' : 'Crear Módulo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
