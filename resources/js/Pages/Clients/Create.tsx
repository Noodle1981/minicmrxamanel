import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Users,
    ArrowLeft,
    Building2,
    Mail,
    Phone,
    MapPin,
    FileText,
    Sparkles,
    CheckCircle2,
    HardHat,
    Leaf,
    ShoppingCart,
    Briefcase,
} from 'lucide-react';
import { IndustryType } from '@/types';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        company_name: '',
        contact_name: '',
        email: '',
        phone: '',
        industry: 'mineria' as IndustryType,
        cuit_tax_id: '',
        address: '',
        notes: '',
        redirect_to_quote: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('clients.store'));
    };

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
                        <h2 className="text-xl font-heading font-bold text-white leading-tight">
                            Registrar Nuevo Cliente
                        </h2>
                        <p className="text-xs text-white/50">
                            Alta de empresa en el Mini-CRM y segmentación por industria
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Nuevo Cliente" />

            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="glass-panel p-8 space-y-6">
                    <div className="pb-4 border-b border-white/10">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#30EEE2]">
                            Datos Corporativos
                        </span>
                        <h3 className="text-lg font-heading font-bold text-white mt-1">
                            Información de la Organización
                        </h3>
                    </div>

                    {/* Razón Social y Nombre de Contacto */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                Empresa / Razón Social *
                            </label>
                            <div className="relative">
                                <Building2 className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                                <input
                                    type="text"
                                    value={data.company_name}
                                    onChange={(e) => setData('company_name', e.target.value)}
                                    placeholder="Ej. Minera Los Andes S.A."
                                    className="w-full input-xamanen text-sm pl-9"
                                    required
                                />
                            </div>
                            {errors.company_name && (
                                <p className="text-rose-400 text-xs mt-1">{errors.company_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                Persona de Contacto *
                            </label>
                            <div className="relative">
                                <Users className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                                <input
                                    type="text"
                                    value={data.contact_name}
                                    onChange={(e) => setData('contact_name', e.target.value)}
                                    placeholder="Ej. Ing. Carlos Mendoza"
                                    className="w-full input-xamanen text-sm pl-9"
                                    required
                                />
                            </div>
                            {errors.contact_name && (
                                <p className="text-rose-400 text-xs mt-1">{errors.contact_name}</p>
                            )}
                        </div>
                    </div>

                    {/* Email y Teléfono */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                Correo Electrónico *
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="contacto@empresa.com"
                                    className="w-full input-xamanen text-sm pl-9"
                                    required
                                />
                            </div>
                            {errors.email && (
                                <p className="text-rose-400 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                Teléfono / WhatsApp
                            </label>
                            <div className="relative">
                                <Phone className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="+54 264 421-9988"
                                    className="w-full input-xamanen text-sm pl-9"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sector / Rubro */}
                    <div>
                        <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                            Sector Estratégico / Industria *
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <button
                                type="button"
                                onClick={() => setData('industry', 'mineria')}
                                className={`p-3 rounded-xl border text-left transition-all ${
                                    data.industry === 'mineria'
                                        ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg shadow-amber-500/10'
                                        : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white'
                                }`}
                            >
                                <HardHat className="w-4 h-4 text-amber-400 mb-1" />
                                <div className="text-xs font-bold font-heading">Minería</div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setData('industry', 'medio_ambiente')}
                                className={`p-3 rounded-xl border text-left transition-all ${
                                    data.industry === 'medio_ambiente'
                                        ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-lg shadow-emerald-500/10'
                                        : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white'
                                }`}
                            >
                                <Leaf className="w-4 h-4 text-emerald-400 mb-1" />
                                <div className="text-xs font-bold font-heading">Medio Ambiente</div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setData('industry', 'comercio')}
                                className={`p-3 rounded-xl border text-left transition-all ${
                                    data.industry === 'comercio'
                                        ? 'bg-blue-500/15 border-blue-400 text-white shadow-lg shadow-blue-500/10'
                                        : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white'
                                }`}
                            >
                                <ShoppingCart className="w-4 h-4 text-blue-400 mb-1" />
                                <div className="text-xs font-bold font-heading">Comercio & B2B</div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setData('industry', 'servicios')}
                                className={`p-3 rounded-xl border text-left transition-all ${
                                    data.industry === 'servicios'
                                        ? 'bg-purple-500/15 border-purple-400 text-white shadow-lg shadow-purple-500/10'
                                        : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white'
                                }`}
                            >
                                <Briefcase className="w-4 h-4 text-purple-400 mb-1" />
                                <div className="text-xs font-bold font-heading">Servicios / Otro</div>
                            </button>
                        </div>
                    </div>

                    {/* CUIT y Dirección */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                CUIT / Identificación Fiscal
                            </label>
                            <input
                                type="text"
                                value={data.cuit_tax_id}
                                onChange={(e) => setData('cuit_tax_id', e.target.value)}
                                placeholder="30-XXXXXXXX-X"
                                className="w-full input-xamanen text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                Dirección / Localidad
                            </label>
                            <input
                                type="text"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Ciudad, Provincia"
                                className="w-full input-xamanen text-sm"
                            />
                        </div>
                    </div>

                    {/* Notas y Requerimientos */}
                    <div>
                        <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                            Notas Comerciales / Requerimientos Iniciales
                        </label>
                        <textarea
                            rows={3}
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Describa brevemente la necesidad o proyecto del cliente..."
                            className="w-full input-xamanen text-sm"
                        />
                    </div>

                    {/* Checkbox de flujo rápido */}
                    <div className="p-3.5 rounded-xl bg-[#30EEE2]/[0.05] border border-[#30EEE2]/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="redirect_to_quote"
                                checked={data.redirect_to_quote}
                                onChange={(e) => setData('redirect_to_quote', e.target.checked)}
                                className="rounded border-white/20 bg-white/5 text-[#30EEE2] focus:ring-[#30EEE2]"
                            />
                            <label htmlFor="redirect_to_quote" className="text-xs text-white/90 font-medium cursor-pointer">
                                Abrir automáticamente el Cotizador CPQ para este cliente tras guardarlo
                            </label>
                        </div>
                        <Sparkles className="w-4 h-4 text-[#30EEE2]" />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                        <Link
                            href={route('clients.index')}
                            className="btn-xamanen-secondary text-xs"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="btn-xamanen-primary text-xs"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Guardar Cliente
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
