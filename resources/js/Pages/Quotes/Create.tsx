import React, { useState, useMemo, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Client, CommercialPack, Feature, SoftwareType } from '@/types';
import {
    Calculator,
    HardHat,
    Leaf,
    ShoppingCart,
    Factory,
    Briefcase,
    Sliders,
    Sparkles,
    Calendar,
    Clock,
    DollarSign,
    Check,
    HelpCircle,
    Info,
    Shield,
    Server,
    Layers,
    ArrowRight,
    CheckCircle2,
    RefreshCw,
    Building2,
    Package,
    AlertTriangle,
    MessageSquare,
    ChevronDown,
    ChevronUp,
    Ban,
} from 'lucide-react';

interface CreateQuoteProps {
    clients: Client[];
    softwareTypes: SoftwareType[];
    features: Feature[];
    featuresByCategory: Record<string, Feature[]>;
    commercialPacks?: CommercialPack[];
    preselectedClientId?: number | null;
    preselectedPreset?: string | null;
    preselectedPackId?: number | null;
}

export default function Create({
    clients,
    softwareTypes,
    features,
    featuresByCategory,
    commercialPacks = [],
    preselectedClientId,
    preselectedPreset,
    preselectedPackId,
}: CreateQuoteProps) {
    // Formulario reactivo de Inertia
    const { data, setData, post, processing, errors } = useForm({
        client_id: preselectedClientId ? String(preselectedClientId) : '',
        software_type_id: softwareTypes[0] ? String(softwareTypes[0].id) : '',
        pack_id: (preselectedPackId ? Number(preselectedPackId) : null) as number | null,
        title: '',
        preset_used: 'mineria' as 'mineria' | 'medio_ambiente' | 'comercio' | 'industria' | 'servicios' | 'personalizado',
        hourly_rate: 25,
        team_capacity_hours_per_day: 8,
        discount_percentage: 0,
        estimated_start_date: new Date().toISOString().slice(0, 10),
        valid_until: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        notes: '',
        terms_conditions: 'Presupuesto válido por 15 días corridos. Incluye 3 meses de garantía técnica, control de versiones y soporte pos-lanzamiento.',
        selected_feature_ids: [] as number[],
    });

    // Tipo de software activo
    const currentSoftwareType = useMemo(() => {
        return softwareTypes.find((st) => String(st.id) === String(data.software_type_id)) || softwareTypes[0];
    }, [data.software_type_id, softwareTypes]);

    // Pack comercial actualmente seleccionado
    const selectedCommercialPack = useMemo(() => {
        return commercialPacks.find((p) => p.id === data.pack_id);
    }, [data.pack_id, commercialPacks]);

    // Filtro de semáforo de factibilidad
    const [feasibilityFilter, setFeasibilityFilter] = useState<'all' | 'verde' | 'amarillo' | 'rojo'>('all');
    const [openScriptIds, setOpenScriptIds] = useState<number[]>([]);

    const toggleScript = (featureId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenScriptIds((prev) =>
            prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId]
        );
    };

    // Conteo por estado de semáforo
    const feasibilityCounts = useMemo(() => {
        return {
            all: features.length,
            verde: features.filter((f) => !f.feasibility_status || f.feasibility_status === 'verde').length,
            amarillo: features.filter((f) => f.feasibility_status === 'amarillo').length,
            rojo: features.filter((f) => f.feasibility_status === 'rojo').length,
        };
    }, [features]);

    // Features filtrados por semáforo
    const filteredFeaturesByCategory = useMemo(() => {
        if (feasibilityFilter === 'all') return featuresByCategory;

        const result: Record<string, Feature[]> = {};
        for (const [cat, items] of Object.entries(featuresByCategory)) {
            const matched = items.filter((f) => {
                const status = f.feasibility_status || 'verde';
                return status === feasibilityFilter;
            });
            if (matched.length > 0) {
                result[cat] = matched;
            }
        }
        return result;
    }, [featuresByCategory, feasibilityFilter]);

    // Aplicar pack comercial cerrado (Recomendado por manual de ventas)
    const applyCommercialPack = (pack: CommercialPack) => {
        setData((prev) => {
            const packFeatureIds = pack.features ? pack.features.map((f) => Number(f.id)) : [];
            let presetName: 'mineria' | 'medio_ambiente' | 'comercio' | 'industria' | 'servicios' | 'personalizado' = 'personalizado';
            let recommendedTypeId = prev.software_type_id;

            if (pack.slug === 'comercio-b2b') {
                presetName = 'comercio';
                const commType = softwareTypes.find((st) => st.slug.includes('ecommerce'));
                if (commType) recommendedTypeId = String(commType.id);
            } else if (pack.slug === 'industria-planta') {
                presetName = 'industria';
                const indType = softwareTypes.find((st) => st.slug.includes('erp') || st.slug.includes('gestion'));
                if (indType) recommendedTypeId = String(indType.id);
            } else if (pack.slug === 'servicios-consultoria') {
                presetName = 'servicios';
                const srvType = softwareTypes.find((st) => st.slug.includes('saas') || st.slug.includes('corporate'));
                if (srvType) recommendedTypeId = String(srvType.id);
            } else if (pack.slug === 'cumplimiento-ambiental') {
                presetName = 'medio_ambiente';
                const saasType = softwareTypes.find((st) => st.slug.includes('saas') || st.slug.includes('gestion'));
                if (saasType) recommendedTypeId = String(saasType.id);
            }

            return {
                ...prev,
                pack_id: pack.id,
                preset_used: presetName,
                software_type_id: recommendedTypeId,
                title: prev.title ? prev.title : `Propuesta: ${pack.name}`,
                selected_feature_ids: packFeatureIds,
            };
        });
    };

    // Aplicar preset por industria
    const applyPreset = (presetName: 'mineria' | 'medio_ambiente' | 'comercio' | 'industria' | 'servicios' | 'personalizado') => {
        setData((prev) => {
            let matchingFeatures: Feature[] = [];
            let recommendedTypeId = prev.software_type_id;
            let autoTitle = prev.title;

            if (presetName === 'mineria') {
                matchingFeatures = features.filter((f) => Boolean(f.is_preset_mining) || (f as any).is_preset_mining == 1);
                const miningType = softwareTypes.find((st) => st.slug.includes('mineria') || st.slug.includes('iot'));
                if (miningType) recommendedTypeId = String(miningType.id);
                autoTitle = 'Plataforma IoT & Gestión de Faena Minera';
            } else if (presetName === 'medio_ambiente') {
                matchingFeatures = features.filter((f) => Boolean(f.is_preset_environment) || (f as any).is_preset_environment == 1);
                const saasType = softwareTypes.find((st) => st.slug.includes('saas') || st.slug.includes('gestion'));
                if (saasType) recommendedTypeId = String(saasType.id);
                autoTitle = 'Sistema de Gestión y Mediciones Ambientales';
            } else if (presetName === 'comercio') {
                matchingFeatures = features.filter((f) => Boolean(f.is_preset_commerce) || (f as any).is_preset_commerce == 1);
                const commType = softwareTypes.find((st) => st.slug.includes('ecommerce'));
                if (commType) recommendedTypeId = String(commType.id);
                autoTitle = 'Portal E-Commerce B2B con Facturación AFIP';
            } else if (presetName === 'industria') {
                matchingFeatures = features.filter((f) => Boolean(f.is_preset_industry) || (f as any).is_preset_industry == 1);
                const indType = softwareTypes.find((st) => st.slug.includes('erp') || st.slug.includes('gestion'));
                if (indType) recommendedTypeId = String(indType.id);
                autoTitle = 'Sistema de Control de Producción y Mantenimiento Industrial';
            } else if (presetName === 'servicios') {
                matchingFeatures = features.filter((f) => Boolean(f.is_preset_services) || (f as any).is_preset_services == 1);
                const srvType = softwareTypes.find((st) => st.slug.includes('saas') || st.slug.includes('corporate') || st.slug.includes('landing'));
                if (srvType) recommendedTypeId = String(srvType.id);
                autoTitle = 'Portal de Gestión de Servicios, Clientes y Facturación';
            } else {
                matchingFeatures = [];
            }

            return {
                ...prev,
                pack_id: null,
                preset_used: presetName,
                software_type_id: recommendedTypeId,
                title: prev.title ? prev.title : autoTitle,
                selected_feature_ids: matchingFeatures.map((f) => Number(f.id)),
            };
        });
    };

    // Toggle de selección de módulo individual
    const toggleFeature = (featureId: number) => {
        setData((prev) => {
            const exists = prev.selected_feature_ids.some((id) => Number(id) === Number(featureId));
            const updated = exists
                ? prev.selected_feature_ids.filter((id) => Number(id) !== Number(featureId))
                : [...prev.selected_feature_ids, Number(featureId)];

            return {
                ...prev,
                selected_feature_ids: updated,
            };
        });
    };

    // Inicializar preset o pack comercial si vino por query param o por defecto
    useEffect(() => {
        if (preselectedPackId && commercialPacks?.length) {
            const found = commercialPacks.find((p) => p.id === preselectedPackId);
            if (found) {
                applyCommercialPack(found);
                return;
            }
        }
        if (preselectedPreset && ['mineria', 'medio_ambiente', 'comercio', 'industria', 'servicios'].includes(preselectedPreset)) {
            applyPreset(preselectedPreset as any);
        } else if (commercialPacks && commercialPacks.length > 0) {
            // Aplicar el primer pack comercial predefinido (Comercio B2B) para iniciar con una solución sólida
            applyCommercialPack(commercialPacks[0]);
        } else if (features.length > 0 && data.selected_feature_ids.length === 0) {
            // Aplicar minería por defecto para que la pantalla no nazca vacía
            applyPreset('mineria');
        }
    }, []);

    // ==================== CÁLCULO CPQ EN TIEMPO REAL ====================
    const calculation = useMemo(() => {
        const selectedFeaturesList = features.filter((f) =>
            data.selected_feature_ids.some((id) => Number(id) === Number(f.id))
        );

        const baseDev = Number(currentSoftwareType?.base_hours_dev || 0);
        const baseQa = Number(currentSoftwareType?.base_hours_qa || 0);
        const baseInfraSetup = Number(currentSoftwareType?.base_price_infrastructure || 0);

        const featDev = selectedFeaturesList.reduce((acc, f) => acc + Number(f.hours_dev), 0);
        const featIntegration = selectedFeaturesList.reduce((acc, f) => acc + Number(f.hours_integration), 0);
        const featQa = selectedFeaturesList.reduce((acc, f) => acc + Number(f.hours_testing_qa), 0);
        const featInfraSetup = selectedFeaturesList.reduce((acc, f) => acc + Number(f.cost_setup_infra), 0);
        const featInfraMonthly = selectedFeaturesList.reduce((acc, f) => acc + Number(f.cost_monthly_infra), 0);

        const totalDev = baseDev + featDev;
        const totalIntegration = featIntegration;
        const totalQa = baseQa + featQa;
        const totalHours = totalDev + totalIntegration + totalQa;

        const rate = Number(data.hourly_rate) || 0;
        const subtotalDev = totalHours * rate;
        const totalInfraSetup = baseInfraSetup + featInfraSetup;
        const totalInfraMonthly = featInfraMonthly;

        const discountPct = Number(data.discount_percentage) || 0;
        const discountAmount = (subtotalDev + totalInfraSetup) * (discountPct / 100);
        const finalTotal = subtotalDev + totalInfraSetup - discountAmount;

        // Días hábiles
        const capacityPerDay = Number(data.team_capacity_hours_per_day) || 8;
        const businessDays = totalHours > 0 ? Math.ceil(totalHours / capacityPerDay) : 1;

        // Fecha de entrega en días hábiles
        let deliveryDate = new Date(data.estimated_start_date || Date.now());
        let daysCount = 0;
        while (daysCount < businessDays) {
            deliveryDate.setDate(deliveryDate.getDate() + 1);
            const dayOfWeek = deliveryDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                daysCount++;
            }
        }

        return {
            totalDev,
            totalIntegration,
            totalQa,
            totalHours,
            subtotalDev,
            totalInfraSetup,
            totalInfraMonthly,
            discountAmount,
            finalTotal,
            businessDays,
            deliveryDateStr: deliveryDate.toLocaleDateString('es-AR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }),
            selectedCount: selectedFeaturesList.length,
        };
    }, [data, features, currentSoftwareType]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('quotes.store'));
    };

    return (
        <AppLayout
            header={
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-[#30EEE2]/10 border border-[#30EEE2]/20 shrink-0">
                        <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-[#30EEE2]" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-sm sm:text-xl font-heading font-bold text-white leading-tight whitespace-nowrap">
                            <span className="sm:hidden">Cotizador CPQ</span>
                            <span className="hidden sm:inline">Cotizador CPQ Interactivo</span>
                        </h2>
                        <p className="text-xs text-white/50 hidden sm:block truncate">
                            Estimación de esfuerzo, costos fijos y cálculo de entrega en días hábiles
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Nuevo Presupuesto CPQ" />

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* ==================== COLUMNA IZQUIERDA: CONFIGURACIÓN Y CATÁLOGO (8 COLUMNAS) ==================== */}
                <div className="lg:col-span-8 space-y-6">
                    {/* 1. Datos Base del Proyecto & Cliente */}
                    <div className="glass-panel p-6">
                        <h3 className="text-base font-heading font-bold text-white mb-4 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-[#30EEE2]" />
                            1. Cliente y Parámetros del Proyecto
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                    Cliente Destinatario *
                                </label>
                                <select
                                    value={data.client_id}
                                    onChange={(e) => setData('client_id', e.target.value)}
                                    className="w-full input-xamanen text-sm bg-[#101522]"
                                    required
                                >
                                    <option value="">Seleccione un cliente...</option>
                                    {clients.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.company_name} ({c.contact_name} - {c.industry.toUpperCase()})
                                        </option>
                                    ))}
                                </select>
                                {errors.client_id && (
                                    <p className="text-rose-400 text-xs mt-1">{errors.client_id}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                    Título / Identificador del Presupuesto *
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Ej. Plataforma de Telemetría y Control Minero"
                                    className="w-full input-xamanen text-sm"
                                    required
                                />
                                {errors.title && (
                                    <p className="text-rose-400 text-xs mt-1">{errors.title}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                    Arquitectura Base / Tipo de Software *
                                </label>
                                <select
                                    value={data.software_type_id}
                                    onChange={(e) => setData('software_type_id', e.target.value)}
                                    className="w-full input-xamanen text-sm bg-[#101522]"
                                    required
                                >
                                    {softwareTypes.map((st) => (
                                        <option key={st.id} value={st.id}>
                                            {st.name} ({st.base_hours_dev}h Dev + {st.base_hours_qa}h QA)
                                        </option>
                                    ))}
                                </select>
                                {errors.software_type_id && (
                                    <p className="text-rose-400 text-xs mt-1">{errors.software_type_id}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                    Tarifa por Hora (USD) *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-white/40 text-sm">$</span>
                                    <input
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={data.hourly_rate}
                                        onChange={(e) => setData('hourly_rate', Number(e.target.value))}
                                        className="w-full input-xamanen text-sm pl-7"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Packs Comerciales Prearmados & Presets */}
                    <div className="glass-panel p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                            <div>
                                <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                                    <Package className="w-4 h-4 text-[#30EEE2]" />
                                    2. Packs Comerciales Prearmados (Recomendado para Venta Pyme)
                                </h3>
                                <p className="text-xs text-white/50 mt-0.5">
                                    Paquetes cerrados de bajo riesgo técnico, sin dependencias complejas de hardware ni APIs volátiles
                                </p>
                            </div>
                            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#30EEE2]/10 text-[#30EEE2] border border-[#30EEE2]/30 self-start sm:self-auto shrink-0">
                                Guía de Venta Oficial
                            </span>
                        </div>

                        {/* Tarjetas de Packs Comerciales */}
                        {commercialPacks && commercialPacks.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-5">
                                {commercialPacks.map((pack) => {
                                    const isSelected = data.pack_id === pack.id;
                                    let packIcon = <Package className="w-5 h-5 text-[#30EEE2]" />;
                                    let themeColor = 'border-[#30EEE2] bg-[#30EEE2]/10 ring-1 ring-[#30EEE2]';
                                    let badgeColor = 'bg-[#30EEE2]/20 text-[#30EEE2] border-[#30EEE2]/30';

                                    if (pack.slug === 'comercio-b2b') {
                                        packIcon = <ShoppingCart className="w-5 h-5 text-blue-400" />;
                                        themeColor = 'border-blue-400 bg-blue-500/10 ring-1 ring-blue-400/50';
                                        badgeColor = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
                                    } else if (pack.slug === 'industria-planta') {
                                        packIcon = <Factory className="w-5 h-5 text-purple-400" />;
                                        themeColor = 'border-purple-400 bg-purple-500/10 ring-1 ring-purple-400/50';
                                        badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/30';
                                    } else if (pack.slug === 'servicios-consultoria') {
                                        packIcon = <Briefcase className="w-5 h-5 text-teal-400" />;
                                        themeColor = 'border-teal-400 bg-teal-500/10 ring-1 ring-teal-400/50';
                                        badgeColor = 'bg-teal-500/20 text-teal-300 border-teal-500/30';
                                    } else if (pack.slug === 'cumplimiento-ambiental') {
                                        packIcon = <Leaf className="w-5 h-5 text-emerald-400" />;
                                        themeColor = 'border-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-400/50';
                                        badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
                                    }

                                    return (
                                        <button
                                            key={pack.id}
                                            type="button"
                                            onClick={() => applyCommercialPack(pack)}
                                            className={`p-4 rounded-xl text-left border transition-all relative ${
                                                isSelected
                                                    ? `${themeColor} text-white shadow-xl`
                                                    : 'bg-white/[0.02] border-white/10 text-white/70 hover:bg-white/[0.05] hover:border-white/20 hover:text-white'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <div className="flex items-center gap-2">
                                                    {packIcon}
                                                    <span className="font-heading font-bold text-sm text-white">{pack.name}</span>
                                                </div>
                                                {isSelected && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                        <Check className="w-3 h-3" /> Pack Activo
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-xs text-white/60 mb-3 line-clamp-2 leading-relaxed">
                                                {pack.description}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-2.5 border-t border-white/10">
                                                <span className="px-2 py-0.5 rounded bg-white/5 text-white/80 font-medium">
                                                    ⏱ {pack.total_hours} hs
                                                </span>
                                                <span className={`px-2 py-0.5 rounded border font-medium ${badgeColor}`}>
                                                    💰 USD {Number(pack.price_min_usd).toLocaleString()} – {Number(pack.price_max_usd).toLocaleString()}
                                                </span>
                                                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                                                    🛠 Mant: ${Number(pack.monthly_maintenance_usd).toLocaleString()}/m
                                                </span>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* OTRAS PLANTILLAS / SELECCIÓN LIBRE */}
                        <div className="pt-3 border-t border-white/10">
                            <div className="text-xs text-white/40 mb-2 font-medium">Otras Plantillas / Selección Manual Libre:</div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                                <button
                                    type="button"
                                    onClick={() => applyPreset('mineria')}
                                    className={`p-2.5 rounded-lg text-center border text-xs transition-all ${
                                        !data.pack_id && data.preset_used === 'mineria'
                                            ? 'bg-amber-500/20 border-amber-400 text-white shadow'
                                            : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <HardHat className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                                    <span className="font-semibold block truncate">Minería</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyPreset('medio_ambiente')}
                                    className={`p-2.5 rounded-lg text-center border text-xs transition-all ${
                                        !data.pack_id && data.preset_used === 'medio_ambiente'
                                            ? 'bg-emerald-500/20 border-emerald-400 text-white shadow'
                                            : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <Leaf className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                                    <span className="font-semibold block truncate">Ambiente</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyPreset('comercio')}
                                    className={`p-2.5 rounded-lg text-center border text-xs transition-all ${
                                        !data.pack_id && data.preset_used === 'comercio'
                                            ? 'bg-blue-500/20 border-blue-400 text-white shadow'
                                            : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <ShoppingCart className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                                    <span className="font-semibold block truncate">Comercio</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyPreset('industria')}
                                    className={`p-2.5 rounded-lg text-center border text-xs transition-all ${
                                        !data.pack_id && data.preset_used === 'industria'
                                            ? 'bg-purple-500/20 border-purple-400 text-white shadow'
                                            : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <Factory className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                                    <span className="font-semibold block truncate">Industria</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyPreset('servicios')}
                                    className={`p-2.5 rounded-lg text-center border text-xs transition-all ${
                                        !data.pack_id && data.preset_used === 'servicios'
                                            ? 'bg-teal-500/20 border-teal-400 text-white shadow'
                                            : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <Briefcase className="w-4 h-4 text-teal-400 mx-auto mb-1" />
                                    <span className="font-semibold block truncate">Servicios</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => applyPreset('personalizado')}
                                    className={`p-2.5 rounded-lg text-center border text-xs transition-all ${
                                        !data.pack_id && data.preset_used === 'personalizado'
                                            ? 'bg-[#30EEE2]/20 border-[#30EEE2] text-white shadow'
                                            : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <Sliders className="w-4 h-4 text-[#30EEE2] mx-auto mb-1" />
                                    <span className="font-semibold block truncate">Manual</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 3. Catálogo Modular de Features agrupado por Categoría */}
                    <div className="glass-panel p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
                            <div>
                                <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-[#30EEE2]" />
                                    3. Catálogo de Módulos & Semáforo de Factibilidad
                                </h3>
                                <p className="text-xs text-white/50">
                                    🟢 Zona Verde (Viable) · 🟡 Zona Amarilla (Condicionado) · 🔴 Zona Roja (Prohibido vender)
                                </p>
                            </div>
                            <div className="text-xs px-3 py-1 rounded-full bg-[#30EEE2]/10 border border-[#30EEE2]/30 text-[#30EEE2] font-semibold self-start sm:self-auto">
                                {calculation.selectedCount} módulos seleccionados
                            </div>
                        </div>

                        {/* Filtro de Semáforo de Factibilidad */}
                        <div className="flex flex-wrap items-center gap-2 mb-5">
                            <span className="text-xs text-white/50 font-medium mr-1">Filtrar por Semáforo:</span>
                            <button
                                type="button"
                                onClick={() => setFeasibilityFilter('all')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                                    feasibilityFilter === 'all'
                                        ? 'bg-white/20 text-white border border-white/30'
                                        : 'bg-white/5 text-white/60 hover:text-white border border-white/10'
                                }`}
                            >
                                Todos ({feasibilityCounts.all})
                            </button>
                            <button
                                type="button"
                                onClick={() => setFeasibilityFilter('verde')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                    feasibilityFilter === 'verde'
                                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 ring-1 ring-emerald-400/50'
                                        : 'bg-emerald-500/10 text-emerald-400/70 hover:text-emerald-300 border border-emerald-500/20'
                                }`}
                            >
                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                Viables ({feasibilityCounts.verde})
                            </button>
                            <button
                                type="button"
                                onClick={() => setFeasibilityFilter('amarillo')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                    feasibilityFilter === 'amarillo'
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 ring-1 ring-amber-400/50'
                                        : 'bg-amber-500/10 text-amber-400/70 hover:text-amber-300 border border-amber-500/20'
                                }`}
                            >
                                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                Condicionados ({feasibilityCounts.amarillo})
                            </button>
                            <button
                                type="button"
                                onClick={() => setFeasibilityFilter('rojo')}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                                    feasibilityFilter === 'rojo'
                                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 ring-1 ring-rose-400/50'
                                        : 'bg-rose-500/10 text-rose-400/70 hover:text-rose-300 border border-rose-500/20'
                                }`}
                            >
                                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                                Zona Roja / No Viables ({feasibilityCounts.rojo})
                            </button>
                        </div>

                        {errors.selected_feature_ids && (
                            <div className="p-3 mb-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                                {errors.selected_feature_ids}
                            </div>
                        )}

                        <div className="space-y-6">
                            {Object.entries(filteredFeaturesByCategory).map(([category, items]) => (
                                <div key={category} className="space-y-3">
                                    <h4 className="text-xs font-heading font-bold text-white/80 uppercase tracking-wider flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#30EEE2]"></span>
                                        {category}
                                    </h4>

                                    <div className="grid grid-cols-1 gap-2.5">
                                        {items.map((feature) => {
                                            const isSelected = data.selected_feature_ids.some(
                                                (id) => Number(id) === Number(feature.id)
                                            );
                                            const totalFeatHours =
                                                Number(feature.hours_dev) +
                                                Number(feature.hours_integration) +
                                                Number(feature.hours_testing_qa);

                                            const status = feature.feasibility_status || 'verde';
                                            const isRed = status === 'rojo';
                                            const isYellow = status === 'amarillo';
                                            const isGreen = status === 'verde';

                                            const isScriptOpen = openScriptIds.includes(feature.id);

                                            return (
                                                <div
                                                    key={feature.id}
                                                    onClick={() => toggleFeature(feature.id)}
                                                    className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                                                        isSelected
                                                            ? isRed
                                                                ? 'bg-rose-500/[0.12] border-rose-500 shadow-lg shadow-rose-500/20'
                                                                : isYellow
                                                                ? 'bg-amber-500/[0.08] border-amber-400 shadow-lg shadow-amber-500/10'
                                                                : 'bg-[#30EEE2]/[0.08] border-[#30EEE2] shadow-lg shadow-[#30EEE2]/10'
                                                            : isRed
                                                            ? 'bg-rose-950/15 border-rose-500/30 hover:border-rose-500/50 hover:bg-rose-950/25'
                                                            : isYellow
                                                            ? 'bg-white/[0.02] border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/[0.03]'
                                                            : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                                                    }`}
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                                            <div
                                                                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                                                    isSelected
                                                                        ? isRed
                                                                            ? 'bg-rose-500 text-white'
                                                                            : isYellow
                                                                            ? 'bg-amber-400 text-black'
                                                                            : 'bg-[#30EEE2] text-[#0A0C10]'
                                                                        : 'border border-white/30 bg-white/5'
                                                                }`}
                                                            >
                                                                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                                                    <span className="text-xs font-heading font-bold text-white leading-tight">
                                                                        {feature.name}
                                                                    </span>

                                                                    {/* Semáforo Badges */}
                                                                    {isRed && (
                                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                                                                            <Ban className="w-3 h-3 text-rose-400" />
                                                                            🔴 ZONA ROJA - NO VIABLE
                                                                        </span>
                                                                    )}

                                                                    {isYellow && (
                                                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                                                                            <AlertTriangle className="w-3 h-3 text-amber-400" />
                                                                            🟡 ZONA AMARILLA - CONDICIONADO
                                                                        </span>
                                                                    )}

                                                                    {isGreen && (
                                                                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                                                                            🟢 Viable
                                                                        </span>
                                                                    )}

                                                                    {Number(feature.cost_monthly_infra) > 0 && (
                                                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 font-mono">
                                                                            <Server className="w-2.5 h-2.5" />
                                                                            +${feature.cost_monthly_infra}/mes
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {feature.description && (
                                                                    <p className="text-[11px] text-white/60 leading-relaxed">
                                                                        {feature.description}
                                                                    </p>
                                                                )}

                                                                {/* Condición si es amarillo */}
                                                                {isYellow && feature.feasibility_condition && (
                                                                    <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg">
                                                                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                                                                        <span><strong>Condición:</strong> {feature.feasibility_condition}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Desglose de Horas */}
                                                        <div className="sm:shrink-0 flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10 text-[11px]">
                                                            <div className="text-left sm:text-right">
                                                                <div className="flex items-center gap-1 font-heading font-bold text-white sm:justify-end">
                                                                    <Clock className="w-3 h-3 text-[#30EEE2]" />
                                                                    <span>{totalFeatHours} hs</span>
                                                                </div>
                                                                <div className="text-[10px] text-white/40 font-mono mt-0.5">
                                                                    {feature.hours_dev}d Dev · {feature.hours_integration}i Int · {feature.hours_testing_qa}q QA
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Argumentario de ventas desplegable para Zona Roja */}
                                                    {isRed && feature.contingency_script && (
                                                        <div className="mt-3 pt-2.5 border-t border-rose-500/20">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => toggleScript(feature.id, e)}
                                                                className="inline-flex items-center gap-1.5 text-xs text-rose-300 hover:text-white font-medium transition-colors bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1 rounded-md border border-rose-500/30"
                                                            >
                                                                <MessageSquare className="w-3.5 h-3.5 text-rose-400" />
                                                                <span>¿Qué responder al cliente si pide este módulo?</span>
                                                                {isScriptOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                                            </button>

                                                            {isScriptOpen && (
                                                                <div className="mt-2 p-3 rounded-xl bg-black/50 border border-rose-500/40 text-xs">
                                                                    <div className="text-[11px] font-bold text-rose-400 mb-1 flex items-center gap-1">
                                                                        <Sparkles className="w-3.5 h-3.5" />
                                                                        Guía oficial para el vendedor (Decir NO protegiendo la venta):
                                                                    </div>
                                                                    <p className="text-white/90 italic text-[11px] leading-relaxed pl-2.5 border-l-2 border-rose-500">
                                                                        "{feature.contingency_script}"
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ==================== COLUMNA DERECHA: RESUMEN FINANCIERO STICKY (4 COLUMNAS) ==================== */}
                <div className="lg:col-span-4">
                    <div className="glass-panel p-6 sticky top-28 space-y-6 border-[#30EEE2]/30 shadow-2xl">
                        {/* Header del Resumen */}
                        <div className="pb-4 border-b border-white/10">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#30EEE2]">
                                    Pricing Summary
                                </span>
                                <span className="text-xs text-white/50">USD</span>
                            </div>
                            <h3 className="text-lg font-heading font-bold text-white">
                                Resumen de Inversión
                            </h3>
                        </div>

                        {/* Pack Comercial Activo */}
                        {selectedCommercialPack && (
                            <div className="p-3 rounded-xl bg-[#30EEE2]/5 border border-[#30EEE2]/20 space-y-1.5 text-xs">
                                <div className="flex items-center justify-between gap-1">
                                    <span className="text-[10px] uppercase font-bold text-[#30EEE2] tracking-wider flex items-center gap-1">
                                        <Package className="w-3 h-3" /> Pack Base
                                    </span>
                                    <span className="text-[10px] text-white/50">{selectedCommercialPack.total_hours} hs base</span>
                                </div>
                                <div className="font-bold text-white text-xs leading-snug">{selectedCommercialPack.name}</div>
                                <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                                    <span className="text-white/60">Precio comercial guía:</span>
                                    <span className="text-emerald-300 font-semibold font-mono">
                                        ${Number(selectedCommercialPack.price_min_usd).toLocaleString()} – ${Number(selectedCommercialPack.price_max_usd).toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-white/60">Abono soporte mensual:</span>
                                    <span className="text-amber-300 font-mono font-medium">
                                        ${Number(selectedCommercialPack.monthly_maintenance_usd).toLocaleString()}/mes
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Desglose de Esfuerzo (Matriz IA) */}
                        <div className="space-y-2.5 text-xs">
                            <div className="flex items-center justify-between text-white/70">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-[#3C84CE]"></span>
                                    Codificación Base (Dev)
                                </span>
                                <span className="font-semibold text-white">{calculation.totalDev} hs</span>
                            </div>

                            <div className="flex items-center justify-between text-white/70">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-[#65005E]"></span>
                                    Arquitectura & Integración
                                </span>
                                <span className="font-semibold text-white">{calculation.totalIntegration} hs</span>
                            </div>

                            <div className="flex items-center justify-between text-white/70">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                    Testing, QA & Validación
                                </span>
                                <span className="font-semibold text-white">{calculation.totalQa} hs</span>
                            </div>

                            <div className="pt-2 border-t border-white/10 flex items-center justify-between font-bold text-sm text-white">
                                <span>Total Horas Estimadas</span>
                                <span className="text-[#30EEE2]">{calculation.totalHours} hs</span>
                            </div>
                        </div>

                        {/* Parámetros de Plazos y Capacidad */}
                        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
                            <div>
                                <label className="block text-[11px] font-semibold text-white/60 uppercase tracking-wider mb-1">
                                    Capacidad del Equipo (hs / día)
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="24"
                                    value={data.team_capacity_hours_per_day}
                                    onChange={(e) => setData('team_capacity_hours_per_day', Number(e.target.value))}
                                    className="w-full input-xamanen text-xs py-1.5"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-white/60 uppercase tracking-wider mb-1">
                                    Fecha Estimada de Inicio
                                </label>
                                <input
                                    type="date"
                                    value={data.estimated_start_date}
                                    onChange={(e) => setData('estimated_start_date', e.target.value)}
                                    className="w-full input-xamanen text-xs py-1.5 bg-[#101522]"
                                />
                            </div>

                            <div className="pt-2 border-t border-white/10">
                                <div className="flex items-center justify-between text-xs text-white/80">
                                    <span>Plazo de entrega:</span>
                                    <span className="font-bold text-[#30EEE2]">
                                        {calculation.businessDays} días hábiles
                                    </span>
                                </div>
                                <div className="text-[11px] text-white/50 text-right mt-0.5">
                                    Entrega aprox: {calculation.deliveryDateStr}
                                </div>
                            </div>
                        </div>

                        {/* Desglose Económico */}
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center justify-between text-white/70">
                                <span>Desarrollo de Software</span>
                                <span className="font-semibold text-white">
                                    ${calculation.subtotalDev.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            </div>

                            {calculation.totalInfraSetup > 0 && (
                                <div className="flex items-center justify-between text-white/70">
                                    <span>Setup Infraestructura</span>
                                    <span className="font-semibold text-white">
                                        +${calculation.totalInfraSetup.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            )}

                            {calculation.totalInfraMonthly > 0 && (
                                <div className="flex items-center justify-between text-purple-300">
                                    <span>Infraestructura Mensual</span>
                                    <span className="font-semibold">
                                        ${calculation.totalInfraMonthly.toLocaleString('en-US', { minimumFractionDigits: 2 })}/mes
                                    </span>
                                </div>
                            )}

                            {/* Descuento */}
                            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                                <label className="text-white/70 text-xs flex items-center gap-1">
                                    <span>Descuento Comercial:</span>
                                </label>
                                <div className="flex items-center gap-1 w-24">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={data.discount_percentage}
                                        onChange={(e) => setData('discount_percentage', Number(e.target.value))}
                                        className="w-full input-xamanen text-xs py-1 text-right"
                                    />
                                    <span className="text-white/50 text-xs">%</span>
                                </div>
                            </div>

                            {calculation.discountAmount > 0 && (
                                <div className="flex items-center justify-between text-emerald-400 text-xs">
                                    <span>Monto Bonificado:</span>
                                    <span>-${calculation.discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                </div>
                            )}
                        </div>

                        {/* Gran Total */}
                        <div className="p-4 rounded-xl bg-gradient-to-br from-[#161D2E] to-[#101522] border border-[#30EEE2]/40 text-center">
                            <span className="text-[11px] text-white/60 uppercase tracking-widest block mb-1">
                                Total Inversión Estimada
                            </span>
                            <div className="text-3xl font-heading font-extrabold text-[#30EEE2] tracking-tight">
                                ${calculation.finalTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </div>
                            <span className="text-[10px] text-white/40 block mt-1">
                                Moneda: USD · Validez 15 días
                            </span>
                        </div>

                        {/* Botón CTA Guardar / Emitir */}
                        <button
                            type="submit"
                            disabled={processing || calculation.selectedCount === 0}
                            className="w-full btn-xamanen-primary text-sm py-3 font-bold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <CheckCircle2 className="w-4 h-4" />
                            )}
                            Guardar y Generar Presupuesto
                        </button>
                    </div>
                </div>
            </form>
        </AppLayout>
    );
}
