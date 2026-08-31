import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Calculator,
    HardHat,
    Leaf,
    ShoppingCart,
    Factory,
    Briefcase,
    Users,
    FolderKanban,
    TrendingUp,
    Clock,
    Sparkles,
    ArrowRight,
} from 'lucide-react';

export default function Dashboard() {
    return (
        <AppLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#30EEE2]/10 border border-[#30EEE2]/20">
                        <Sparkles className="w-5 h-5 text-[#30EEE2]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-heading font-bold text-white leading-tight">
                            Panel de Control — Grupo Xamanen
                        </h2>
                        <p className="text-xs text-white/50">
                            Presupuestador de Software a Medida & Gestión Operativa
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            {/* Barra de Acciones Rápidas (Solo Botones) */}
            <div className="rounded-2xl bg-gradient-to-r from-[#161D2E] via-[#101522] to-[#161D2E] border border-white/10 p-4 mb-8 shadow-xl flex flex-wrap items-center gap-3">
                <Link
                    href={route('quotes.create')}
                    className="btn-xamanen-primary text-sm shadow-lg"
                >
                    <Calculator className="w-4 h-4" />
                    Iniciar Nueva Cotización
                </Link>

                <Link
                    href={route('clients.index')}
                    className="btn-xamanen-secondary text-sm"
                >
                    <Users className="w-4 h-4" />
                    Ver Clientes Registrados
                </Link>
            </div>

            {/* Presets Rápidos por Industria */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-heading font-bold text-white">
                        Plantillas & Presets Estratégicos
                    </h3>
                    <span className="text-xs text-white/50">5 Modelos precargados listos para cotizar</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Tarjeta Minería */}
                    <Link
                        href={route('quotes.create', { preset: 'mineria' })}
                        className="glass-panel p-5 relative overflow-hidden group hover:border-[#30EEE2]/40 transition-all flex flex-col justify-between"
                    >
                        <div>
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3 text-amber-400">
                                <HardHat className="w-5 h-5" />
                            </div>
                            <h4 className="text-sm font-heading font-bold text-white mb-1">
                                Minería & HSE
                            </h4>
                            <p className="text-[11px] text-white/60 mb-3 leading-relaxed">
                                Telemetría IoT, mapas satelitales GIS, modo offline y control de cuadrillas.
                            </p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#30EEE2] font-semibold pt-2 border-t border-white/5">
                            <span>Cotizar</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>

                    {/* Tarjeta Medio Ambiente */}
                    <Link
                        href={route('quotes.create', { preset: 'medio_ambiente' })}
                        className="glass-panel p-5 relative overflow-hidden group hover:border-[#30EEE2]/40 transition-all flex flex-col justify-between"
                    >
                        <div>
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-3 text-emerald-400">
                                <Leaf className="w-5 h-5" />
                            </div>
                            <h4 className="text-sm font-heading font-bold text-white mb-1">
                                Medio Ambiente
                            </h4>
                            <p className="text-[11px] text-white/60 mb-3 leading-relaxed">
                                Monitoreo ambiental, matriz legal y cálculo de huella de carbono.
                            </p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#30EEE2] font-semibold pt-2 border-t border-white/5">
                            <span>Cotizar</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>

                    {/* Tarjeta Comercio */}
                    <Link
                        href={route('quotes.create', { preset: 'comercio' })}
                        className="glass-panel p-5 relative overflow-hidden group hover:border-[#30EEE2]/40 transition-all flex flex-col justify-between"
                    >
                        <div>
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-3 text-blue-400">
                                <ShoppingCart className="w-5 h-5" />
                            </div>
                            <h4 className="text-sm font-heading font-bold text-white mb-1">
                                E-Commerce & B2B
                            </h4>
                            <p className="text-[11px] text-white/60 mb-3 leading-relaxed">
                                Catálogo dinámico, pasarelas de pago, facturación AFIP y logística.
                            </p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#30EEE2] font-semibold pt-2 border-t border-white/5">
                            <span>Cotizar</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>

                    {/* Tarjeta Industria */}
                    <Link
                        href={route('quotes.create', { preset: 'industria' })}
                        className="glass-panel p-5 relative overflow-hidden group hover:border-[#30EEE2]/40 transition-all flex flex-col justify-between"
                    >
                        <div>
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-3 text-purple-400">
                                <Factory className="w-5 h-5" />
                            </div>
                            <h4 className="text-sm font-heading font-bold text-white mb-1">
                                Industria & Planta
                            </h4>
                            <p className="text-[11px] text-white/60 mb-3 leading-relaxed">
                                Órdenes de producción, mantenimiento CMMS, calidad y sensores OEE.
                            </p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#30EEE2] font-semibold pt-2 border-t border-white/5">
                            <span>Cotizar</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>

                    {/* Tarjeta Servicios */}
                    <Link
                        href={route('quotes.create', { preset: 'servicios' })}
                        className="glass-panel p-5 relative overflow-hidden group hover:border-[#30EEE2]/40 transition-all flex flex-col justify-between"
                    >
                        <div>
                            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mb-3 text-teal-400">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <h4 className="text-sm font-heading font-bold text-white mb-1">
                                Servicios & Consultoría
                            </h4>
                            <p className="text-[11px] text-white/60 mb-3 leading-relaxed">
                                Portal de clientes SLA, tracking de horas, contratos y firma digital.
                            </p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#30EEE2] font-semibold pt-2 border-t border-white/5">
                            <span>Cotizar</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                </div>
            </div>

            {/* Resumen Operativo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Link href={route('quotes.index')} className="glass-panel p-5 hover:border-[#30EEE2]/30 transition-all block">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-[#3C84CE]/15 text-[#30EEE2]">
                            <Calculator className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-white/50 uppercase tracking-wider">Cotizaciones</p>
                            <p className="text-2xl font-heading font-bold text-white">Historial</p>
                        </div>
                    </div>
                </Link>

                <Link href={route('projects.index')} className="glass-panel p-5 hover:border-emerald-500/30 transition-all block">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400">
                            <FolderKanban className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-white/50 uppercase tracking-wider">Proyectos</p>
                            <p className="text-2xl font-heading font-bold text-white">Obras Activas</p>
                        </div>
                    </div>
                </Link>

                <Link href={route('clients.index')} className="glass-panel p-5 hover:border-purple-500/30 transition-all block">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-300">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-white/50 uppercase tracking-wider">Clientes</p>
                            <p className="text-2xl font-heading font-bold text-white">Mini-CRM</p>
                        </div>
                    </div>
                </Link>

                <Link href={route('calendar.index')} className="glass-panel p-5 hover:border-amber-500/30 transition-all block">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-300">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-white/50 uppercase tracking-wider">Capacidad Diaria</p>
                            <p className="text-2xl font-heading font-bold text-white">8h / día</p>
                        </div>
                    </div>
                </Link>
            </div>
        </AppLayout>
    );
}
