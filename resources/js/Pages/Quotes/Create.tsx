import React, { useState, useMemo, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Client, Feature, SoftwareType } from '@/types';
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
} from 'lucide-react';

interface CreateQuoteProps {
    clients: Client[];
    softwareTypes: SoftwareType[];
    features: Feature[];
    featuresByCategory: Record<string, Feature[]>;
    preselectedClientId?: number | null;
    preselectedPreset?: string | null;
}

export default function Create({
    clients,
    softwareTypes,
    features,
    featuresByCategory,
    preselectedClientId,
    preselectedPreset,
}: CreateQuoteProps) {
    // Formulario reactivo de Inertia
    const { data, setData, post, processing, errors } = useForm({
        client_id: preselectedClientId ? String(preselectedClientId) : '',
        software_type_id: softwareTypes[0] ? String(softwareTypes[0].id) : '',
        title: '',
        preset_used: 'mineria' as 'mineria' | 'medio_ambiente' | 'comercio' | 'industria' | 'servicios' | 'personalizado',
        hourly_rate: 35,
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

    // Inicializar preset si vino por query param
    useEffect(() => {
        if (preselectedPreset && ['mineria', 'medio_ambiente', 'comercio', 'industria', 'servicios'].includes(preselectedPreset)) {
            applyPreset(preselectedPreset as any);
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

                    {/* 2. Plantillas Rápidas por Industria (Presets) */}
                    <div className="glass-panel p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-[#30EEE2]" />
                                2. Plantillas Rápidas por Industria (Presets)
                            </h3>
                            <span className="text-xs text-[#30EEE2]">Atajo de preselección</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                            <button
                                type="button"
                                onClick={() => applyPreset('mineria')}
                                className={`p-4 rounded-xl text-left border transition-all ${
                                    data.preset_used === 'mineria'
                                        ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg shadow-amber-500/10'
                                        : 'bg-white/[0.02] border-white/10 text-white/70 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <HardHat className="w-5 h-5 text-amber-400 mb-2" />
                                <div className="text-sm font-bold font-heading">Minería & HSE</div>
                                <div className="text-xs text-white/50 mt-0.5">Sensores, GIS, Offline</div>
                            </button>

                            <button
                                type="button"
                                onClick={() => applyPreset('medio_ambiente')}
                                className={`p-4 rounded-xl text-left border transition-all ${
                                    data.preset_used === 'medio_ambiente'
                                        ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-lg shadow-emerald-500/10'
                                        : 'bg-white/[0.02] border-white/10 text-white/70 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <Leaf className="w-5 h-5 text-emerald-400 mb-2" />
                                <div className="text-sm font-bold font-heading">Medio Ambiente</div>
                                <div className="text-xs text-white/50 mt-0.5">Matrices, Ensayos, CO2</div>
                            </button>

                            <button
                                type="button"
                                onClick={() => applyPreset('comercio')}
                                className={`p-4 rounded-xl text-left border transition-all ${
                                    data.preset_used === 'comercio'
                                        ? 'bg-blue-500/15 border-blue-400 text-white shadow-lg shadow-blue-500/10'
                                        : 'bg-white/[0.02] border-white/10 text-white/70 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <ShoppingCart className="w-5 h-5 text-blue-400 mb-2" />
                                <div className="text-sm font-bold font-heading">E-Commerce & B2B</div>
                                <div className="text-xs text-white/50 mt-0.5">AFIP, Pagos, Stock</div>
                            </button>

                            <button
                                type="button"
                                onClick={() => applyPreset('industria')}
                                className={`p-4 rounded-xl text-left border transition-all ${
                                    data.preset_used === 'industria'
                                        ? 'bg-purple-500/15 border-purple-400 text-white shadow-lg shadow-purple-500/10'
                                        : 'bg-white/[0.02] border-white/10 text-white/70 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <Factory className="w-5 h-5 text-purple-400 mb-2" />
                                <div className="text-sm font-bold font-heading">Industria & Planta</div>
                                <div className="text-xs text-white/50 mt-0.5">Lotes, CMMS, OEE</div>
                            </button>

                            <button
                                type="button"
                                onClick={() => applyPreset('servicios')}
                                className={`p-4 rounded-xl text-left border transition-all ${
                                    data.preset_used === 'servicios'
                                        ? 'bg-teal-500/15 border-teal-400 text-white shadow-lg shadow-teal-500/10'
                                        : 'bg-white/[0.02] border-white/10 text-white/70 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <Briefcase className="w-5 h-5 text-teal-400 mb-2" />
                                <div className="text-sm font-bold font-heading">Servicios & Consultoría</div>
                                <div className="text-xs text-white/50 mt-0.5">SLA, Horas, Abonos</div>
                            </button>

                            <button
                                type="button"
                                onClick={() => applyPreset('personalizado')}
                                className={`p-4 rounded-xl text-left border transition-all ${
                                    data.preset_used === 'personalizado'
                                        ? 'bg-[#30EEE2]/15 border-[#30EEE2] text-white shadow-lg shadow-[#30EEE2]/10'
                                        : 'bg-white/[0.02] border-white/10 text-white/70 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <Sliders className="w-5 h-5 text-[#30EEE2] mb-2" />
                                <div className="text-sm font-bold font-heading">Personalizado</div>
                                <div className="text-xs text-white/50 mt-0.5">Selección manual libre</div>
                            </button>
                        </div>
                    </div>

                    {/* 3. Catálogo Modular de Features agrupado por Categoría */}
                    <div className="glass-panel p-6">
                        <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
                            <div>
                                <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-[#30EEE2]" />
                                    3. Catálogo de Módulos & Matriz de Esfuerzo (IA Era)
                                </h3>
                                <p className="text-xs text-white/50">
                                    Desglose de horas de Codificación, Integración/Arquitectura y Testing/QA
                                </p>
                            </div>
                            <div className="text-xs px-3 py-1 rounded-full bg-[#30EEE2]/10 border border-[#30EEE2]/30 text-[#30EEE2] font-semibold">
                                {calculation.selectedCount} módulos seleccionados
                            </div>
                        </div>

                        {errors.selected_feature_ids && (
                            <div className="p-3 mb-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                                {errors.selected_feature_ids}
                            </div>
                        )}

                        <div className="space-y-6">
                            {Object.entries(featuresByCategory).map(([category, items]) => (
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

                                            return (
                                                <div
                                                    key={feature.id}
                                                    onClick={() => toggleFeature(feature.id)}
                                                    className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                                        isSelected
                                                            ? 'bg-[#30EEE2]/[0.08] border-[#30EEE2] shadow-lg shadow-[#30EEE2]/10'
                                                            : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3 flex-1 min-w-0">
                                                        <div
                                                            className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                                                isSelected
                                                                    ? 'bg-[#30EEE2] text-[#0A0C10]'
                                                                    : 'border border-white/30 bg-white/5'
                                                            }`}
                                                        >
                                                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <span className="text-xs font-heading font-bold text-white leading-tight">
                                                                    {feature.name}
                                                                </span>
                                                                {Number(feature.cost_monthly_infra) > 0 && (
                                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1 font-mono">
                                                                        <Server className="w-2.5 h-2.5" />
                                                                        +${feature.cost_monthly_infra}/mes
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {feature.description && (
                                                                <p className="text-[11px] text-white/60 mt-1 leading-relaxed">
                                                                    {feature.description}
                                                                </p>
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
