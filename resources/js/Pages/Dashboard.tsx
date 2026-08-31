import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { PageProps, RoleName, User } from '@/types';
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
    CheckSquare,
    Calendar,
    Layers,
    Shield,
    Code2,
    Palette,
    CheckCircle2,
    Laptop,
} from 'lucide-react';

export default function Dashboard() {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user as User;
    const userRoles = (auth.roles || user.roles?.map((r) => r.name) || ['vendedor']) as RoleName[];

    const isCommercial = userRoles.includes('super_admin') || userRoles.includes('vendedor');
    const isDeveloper = userRoles.includes('desarrollador');
    const isDesigner = userRoles.includes('disenador');
    const isTester = userRoles.includes('qa_tester');
    const isValidador = userRoles.includes('validador');

    return (
        <AppLayout
            header={
                <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-[#30EEE2]/10 border border-[#30EEE2]/20 shrink-0">
                        {isCommercial ? (
                            <Sparkles className="w-5 h-5 text-[#30EEE2]" />
                        ) : (
                            <Laptop className="w-5 h-5 text-[#30EEE2]" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-sm sm:text-xl font-heading font-bold text-white leading-tight truncate">
                            {isCommercial
                                ? 'Panel Comercial & Presupuestador — Grupo Xamanen'
                                : 'Panel Técnico & Operativo — Grupo Xamanen'}
                        </h2>
                        <p className="text-xs text-white/50 hidden sm:block truncate">
                            {isCommercial
                                ? 'Presupuestador de Software a Medida & Gestión Comercial (Mini-CRM)'
                                : 'Gestión de Sprints, Resolución de Tickets y Ejecución de Obras Técnicas'}
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={isCommercial ? 'Panel Comercial' : 'Panel Técnico'} />

            {/* ========================================================= */}
            {/* VISTA 1: DASHBOARD COMERCIAL (SUPER ADMIN / VENDEDORES)   */}
            {/* ========================================================= */}
            {isCommercial ? (
                <>
                    {/* Barra de Acciones Rápidas Comerciales */}
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
                            Directorio de Clientes (Mini-CRM)
                        </Link>

                        <Link
                            href={route('quotes.index')}
                            className="btn-xamanen-secondary text-sm"
                        >
                            <Sparkles className="w-4 h-4 text-[#30EEE2]" />
                            Historial de Cotizaciones
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

                    {/* Resumen Operativo Comercial */}
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
                </>
            ) : (
                /* ========================================================= */
                /* VISTA 2: DASHBOARD TÉCNICO & OPERATIVO                    */
                /* (Desarrollador, Diseñador, QA Tester, Validador)          */
                /* ========================================================= */
                <>
                    {/* Barra de Acciones Rápidas Técnicas */}
                    <div className="rounded-2xl bg-gradient-to-r from-[#161D2E] via-[#101522] to-[#161D2E] border border-white/10 p-4 mb-8 shadow-xl flex flex-wrap items-center gap-3">
                        <Link
                            href={route('tickets.index')}
                            className="btn-xamanen-primary text-sm shadow-lg"
                        >
                            <CheckSquare className="w-4 h-4" />
                            Mi Tablero de Tickets
                        </Link>

                        <Link
                            href={route('projects.index')}
                            className="btn-xamanen-secondary text-sm"
                        >
                            <FolderKanban className="w-4 h-4" />
                            Proyectos & Obras Activas
                        </Link>

                        <Link
                            href={route('calendar.index')}
                            className="btn-xamanen-secondary text-sm"
                        >
                            <Calendar className="w-4 h-4 text-amber-300" />
                            Calendario & Horas Laborales
                        </Link>

                        <Link
                            href={route('catalog.index')}
                            className="btn-xamanen-secondary text-sm"
                        >
                            <Layers className="w-4 h-4 text-[#30EEE2]" />
                            Catálogo & Matriz de Esfuerzo IA
                        </Link>
                    </div>

                    {/* Módulos de Enfoque Técnico */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-heading font-bold text-white">
                                Módulos de Ejecución & Operaciones
                            </h3>
                            <span className="text-xs text-white/50">Flujo ágil de desarrollo y entregas</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {/* Card 1: Tablero de Tickets */}
                            <Link
                                href={route('tickets.index')}
                                className="glass-panel p-5 relative overflow-hidden group hover:border-[#30EEE2]/40 transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-10 h-10 rounded-xl bg-[#3C84CE]/15 border border-[#3C84CE]/30 flex items-center justify-center mb-3 text-[#30EEE2]">
                                        <CheckSquare className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-base font-heading font-bold text-white mb-1">
                                        Tablero Kanban
                                    </h4>
                                    <p className="text-xs text-white/60 mb-4 leading-relaxed">
                                        Revisa tus tareas asignadas en Backlog, En Desarrollo, Testing QA y Validadas.
                                    </p>
                                </div>
                                <div className="flex items-center justify-between text-xs text-[#30EEE2] font-semibold pt-3 border-t border-white/5">
                                    <span>Abrir Tablero</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>

                            {/* Card 2: Proyectos en Ejecución */}
                            <Link
                                href={route('projects.index')}
                                className="glass-panel p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-3 text-emerald-400">
                                        <FolderKanban className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-base font-heading font-bold text-white mb-1">
                                        Proyectos & Obras
                                    </h4>
                                    <p className="text-xs text-white/60 mb-4 leading-relaxed">
                                        Especificación de requerimientos, alcance técnico y seguimiento de hitos de entrega.
                                    </p>
                                </div>
                                <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold pt-3 border-t border-white/5">
                                    <span>Ver Proyectos</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>

                            {/* Card 3: Calendario Laboral */}
                            <Link
                                href={route('calendar.index')}
                                className="glass-panel p-5 relative overflow-hidden group hover:border-amber-500/40 transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-3 text-amber-300">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-base font-heading font-bold text-white mb-1">
                                        Jornada & Calendario
                                    </h4>
                                    <p className="text-xs text-white/60 mb-4 leading-relaxed">
                                        Disponibilidad semanal (Lunes a Viernes de 8:00 a 17:00 hs) y balance de carga de trabajo.
                                    </p>
                                </div>
                                <div className="flex items-center justify-between text-xs text-amber-300 font-semibold pt-3 border-t border-white/5">
                                    <span>Consultar Calendario</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>

                            {/* Card 4: Matriz de Horas IA */}
                            <Link
                                href={route('catalog.index')}
                                className="glass-panel p-5 relative overflow-hidden group hover:border-purple-500/40 transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center mb-3 text-purple-300">
                                        <Layers className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-base font-heading font-bold text-white mb-1">
                                        Catálogo & Matriz IA
                                    </h4>
                                    <p className="text-xs text-white/60 mb-4 leading-relaxed">
                                        Consulta de horas estimadas por módulo: Codificación Base, Integración y Cobertura QA.
                                    </p>
                                </div>
                                <div className="flex items-center justify-between text-xs text-purple-300 font-semibold pt-3 border-t border-white/5">
                                    <span>Ver Matriz</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Guía Operativa según tu Rol */}
                    <div className="glass-panel p-6 border-white/10">
                        <h4 className="text-sm font-heading font-bold text-white mb-3 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-[#30EEE2]" />
                            Enfoque Operativo de tu Perfil Técnico
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-white/70">
                            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="font-bold text-indigo-300 block mb-1">💻 Desarrollador</span>
                                Construcción de módulos, lógica de negocio y consumo de APIs en Laravel / React.
                            </div>
                            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="font-bold text-pink-300 block mb-1">🎨 Diseñador UI/UX</span>
                                Creación de prototipos visuales, consistencia Glassmorphism y experiencia de usuario.
                            </div>
                            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="font-bold text-amber-300 block mb-1">🧪 QA & Testing</span>
                                Ejecución de pruebas funcionales, verificación de criterios de aceptación y reporte de bugs.
                            </div>
                            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="font-bold text-teal-300 block mb-1">🛡️ Validador Tech Lead</span>
                                Revisión de arquitectura, control de calidad final y aprobación de puesta en producción.
                            </div>
                        </div>
                    </div>
                </>
            )}
        </AppLayout>
    );
}

