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
    CheckCircle2,
    HardHat,
    Leaf,
    ShoppingCart,
    Briefcase,
} from 'lucide-react';
import { Client, IndustryType } from '@/types';

interface EditProps {
    client: Client;
}

export default function Edit({ client }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        company_name: client.company_name || '',
        contact_name: client.contact_name || '',
        email: client.email || '',
        phone: client.phone || '',
        industry: client.industry || ('mineria' as IndustryType),
        cuit_tax_id: client.cuit_tax_id || '',
        address: client.address || '',
        notes: client.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('clients.update', client.id));
    };

    return (
        <AppLayout
            header={
                <div className="flex items-center gap-3 min-w-0">
                    <Link
                        href={route('clients.show', client.id)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors shrink-0"
                        title="Volver"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div className="min-w-0">
                        <h2 className="text-sm sm:text-xl font-heading font-bold text-white leading-tight truncate">
                            Editar Cliente: {client.company_name}
                        </h2>
                        <p className="text-xs text-white/50 hidden sm:block truncate">Actualización de datos corporativos</p>
                    </div>
                </div>
            }
        >
            <Head title={`Editar ${client.company_name}`} />

            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="glass-panel p-8 space-y-6">
                    <div className="pb-4 border-b border-white/10">
                        <h3 className="text-lg font-heading font-bold text-white">
                            Datos del Cliente
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                Empresa / Razón Social *
                            </label>
                            <input
                                type="text"
                                value={data.company_name}
                                onChange={(e) => setData('company_name', e.target.value)}
                                className="w-full input-xamanen text-sm"
                                required
                            />
                            {errors.company_name && (
                                <p className="text-rose-400 text-xs mt-1">{errors.company_name}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                Persona de Contacto *
                            </label>
                            <input
                                type="text"
                                value={data.contact_name}
                                onChange={(e) => setData('contact_name', e.target.value)}
                                className="w-full input-xamanen text-sm"
                                required
                            />
                            {errors.contact_name && (
                                <p className="text-rose-400 text-xs mt-1">{errors.contact_name}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                Correo Electrónico *
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full input-xamanen text-sm"
                                required
                            />
                            {errors.email && (
                                <p className="text-rose-400 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                Teléfono
                            </label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="w-full input-xamanen text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                            Sector / Industria *
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <button
                                type="button"
                                onClick={() => setData('industry', 'mineria')}
                                className={`p-3 rounded-xl border text-left transition-all ${
                                    data.industry === 'mineria'
                                        ? 'bg-amber-500/15 border-amber-400 text-white'
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
                                        ? 'bg-emerald-500/15 border-emerald-400 text-white'
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
                                        ? 'bg-blue-500/15 border-blue-400 text-white'
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
                                        ? 'bg-purple-500/15 border-purple-400 text-white'
                                        : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white'
                                }`}
                            >
                                <Briefcase className="w-4 h-4 text-purple-400 mb-1" />
                                <div className="text-xs font-bold font-heading">Servicios / Otro</div>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                CUIT / Identificación Fiscal
                            </label>
                            <input
                                type="text"
                                value={data.cuit_tax_id}
                                onChange={(e) => setData('cuit_tax_id', e.target.value)}
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
                                className="w-full input-xamanen text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                            Notas y Observaciones
                        </label>
                        <textarea
                            rows={3}
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            className="w-full input-xamanen text-sm"
                        />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                        <Link
                            href={route('clients.show', client.id)}
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
                            Actualizar Cliente
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
