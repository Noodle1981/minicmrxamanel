import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Quote, QuoteStatus, User } from '@/types';
import {
    FileText,
    ArrowLeft,
    Printer,
    CheckCircle2,
    XCircle,
    Send,
    Clock,
    Building2,
    Calendar,
    DollarSign,
    Server,
    Shield,
    Sparkles,
    Briefcase,
    Mail,
    Phone,
    MapPin,
    AlertCircle,
    Lock,
    UserCheck,
    Package,
} from 'lucide-react';

interface ShowProps {
    quote: Quote;
}

export default function Show({ quote }: ShowProps) {
    const { auth } = usePage<{ auth: { user: User } }>().props;
    const isCreator = auth?.user?.id === quote.created_by;
    const isSuperAdmin = auth?.user?.roles?.some((r: any) => r.name === 'super_admin');
    const canManageStatus = isCreator || isSuperAdmin;

    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<QuoteStatus>(quote.status);
    const [rejectionReason, setRejectionReason] = useState('');
    const [updating, setUpdating] = useState(false);

    const handlePrint = () => {
        window.print();
    };

    const handleStatusUpdate = (status: QuoteStatus) => {
        setUpdating(true);
        router.patch(
            route('quotes.status.update', quote.id),
            {
                status,
                rejection_reason: status === 'rejected' ? rejectionReason : null,
            },
            {
                onFinish: () => {
                    setUpdating(false);
                    setStatusModalOpen(false);
                },
            }
        );
    };

    const statusConfig: Record<QuoteStatus, { label: string; class: string; icon: React.ComponentType<{ className?: string }> }> = {
        draft: { label: 'Borrador Interno', class: 'bg-white/10 text-white/80 border-white/20', icon: Clock },
        sent: { label: 'Enviado al Cliente', class: 'bg-[#3C84CE]/20 text-[#30EEE2] border-[#3C84CE]/40', icon: Send },
        under_review: { label: 'En Negociación / Revisión', class: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: Clock },
        accepted: { label: 'Aprobado / Aceptado', class: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: CheckCircle2 },
        rejected: { label: 'Rechazado', class: 'bg-rose-500/20 text-rose-300 border-rose-500/40', icon: XCircle },
        expired: { label: 'Vencido', class: 'bg-gray-500/20 text-gray-400 border-gray-500/40', icon: AlertCircle },
    };

    const CurrentStatus = statusConfig[quote.status] || statusConfig.draft;
    const StatusIcon = CurrentStatus.icon;

    return (
        <AppLayout
            header={
                <div className="flex items-center gap-3 min-w-0">
                    <Link
                        href={route('quotes.index')}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors shrink-0"
                        title="Volver"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-sm sm:text-xl font-heading font-bold text-white leading-tight truncate">
                                Presupuesto {quote.quote_number}
                            </h2>
                            <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${CurrentStatus.class}`}
                            >
                                <StatusIcon className="w-3 h-3" />
                                {CurrentStatus.label}
                            </span>
                        </div>
                        <p className="text-xs text-white/50 hidden sm:block truncate">
                            {quote.title} • Vendedor: <strong className="text-white">{quote.creator?.name || 'Comercial'}</strong>
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`Presupuesto ${quote.quote_number}`} />

            {/* ========================================================= */}
            {/* VISTA EN PANTALLA (WEB INTERACTIVA)                       */}
            {/* ========================================================= */}
            <div className="print:hidden space-y-6 max-w-5xl mx-auto">
                {/* Barra de Acciones del Documento */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl glass-panel">
                    <div className="flex items-center gap-2 text-xs text-white/60">
                        <span>Vendedor Titular:</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 text-white border border-white/10 font-bold">
                            <UserCheck className="w-3 h-3 text-[#30EEE2]" />
                            {quote.creator?.name || 'Vendedor Asignado'}
                        </span>
                        {isCreator && (
                            <span className="text-[10px] text-emerald-400 font-semibold">(Tú eres el titular)</span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handlePrint}
                            className="btn-xamanen-primary text-xs px-3.5 py-2 shadow-lg"
                        >
                            <Printer className="w-3.5 h-3.5" />
                            Imprimir / Guardar PDF (A4)
                        </button>

                        {/* Control de Permisos: Solo el creador o Super Admin puede cambiar el estado */}
                        {canManageStatus ? (
                            <>
                                {quote.status === 'draft' && (
                                    <button
                                        type="button"
                                        onClick={() => handleStatusUpdate('sent')}
                                        disabled={updating}
                                        className="btn-xamanen-secondary text-xs px-3 py-2 text-[#30EEE2] border-[#30EEE2]/40"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                        Marcar como Enviado
                                    </button>
                                )}

                                {quote.status !== 'accepted' && (
                                    <button
                                        type="button"
                                        onClick={() => handleStatusUpdate('accepted')}
                                        disabled={updating}
                                        className="btn-xamanen-secondary text-xs px-3.5 py-2 text-emerald-300 border-emerald-500/40"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Aprobar Presupuesto
                                    </button>
                                )}
                            </>
                        ) : (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                                <Lock className="w-3.5 h-3.5 shrink-0" />
                                <span>Solo lectura (Pertenece a {quote.creator?.name || 'otro colega'})</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cabecera Ejecutiva / Branding */}
                <div className="glass-panel p-8 border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#30EEE2]/10 via-[#3C84CE]/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>

                    <div className="flex flex-col sm:flex-row justify-between gap-6 pb-6 border-b border-white/10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <img src="/images/logo.png" alt="Logo Xamanen" className="h-9 w-auto object-contain" />
                                <div>
                                    <h3 className="text-xl font-heading font-extrabold text-white tracking-wide">
                                        GRUPO XAMANEN
                                    </h3>
                                    <p className="text-[11px] text-[#30EEE2] font-semibold tracking-wider uppercase">
                                        Soluciones Tecnológicas & Software a Medida
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-white/50 max-w-md">
                                Especialistas en transformación digital, telemetría para minería, medio ambiente y sistemas comerciales.
                            </p>
                        </div>

                        <div className="text-left sm:text-right space-y-1">
                            <span className="text-[11px] font-semibold text-white/40 uppercase tracking-widest block">
                                Documento de Cotización
                            </span>
                            <div className="text-2xl font-heading font-extrabold text-[#30EEE2] font-mono">
                                {quote.quote_number}
                            </div>
                            <div className="text-xs text-white/70">
                                <strong>Fecha de Emisión:</strong>{' '}
                                {new Date(quote.created_at).toLocaleDateString('es-AR')}
                            </div>
                            {quote.valid_until && (
                                <div className="text-xs text-amber-400/90 font-medium">
                                    <strong>Válido Hasta:</strong>{' '}
                                    {new Date(quote.valid_until).toLocaleDateString('es-AR')}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Datos del Cliente y Resumen de Solución */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                            <span className="text-[10px] font-bold text-[#30EEE2] uppercase tracking-wider block mb-2">
                                Información del Cliente
                            </span>
                            <h4 className="text-base font-heading font-bold text-white mb-1">
                                {quote.client?.company_name}
                            </h4>
                            <div className="space-y-1 text-xs text-white/70">
                                <p className="flex items-center gap-2">
                                    <Briefcase className="w-3.5 h-3.5 text-white/40" />
                                    <strong>Contacto:</strong> {quote.client?.contact_name || '—'}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5 text-white/40" />
                                    <strong>Email:</strong> {quote.client?.email || '—'}
                                </p>
                                {quote.client?.phone && (
                                    <p className="flex items-center gap-2">
                                        <Phone className="w-3.5 h-3.5 text-white/40" />
                                        <strong>Teléfono:</strong> {quote.client?.phone}
                                    </p>
                                )}
                                {quote.client?.cuit_tax_id && (
                                    <p className="flex items-center gap-2">
                                        <Building2 className="w-3.5 h-3.5 text-white/40" />
                                        <strong>CUIT / Razón Social:</strong> {quote.client?.cuit_tax_id}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
                            <span className="text-[10px] font-bold text-[#30EEE2] uppercase tracking-wider block mb-2">
                                Alcance & Arquitectura del Proyecto
                            </span>
                            <h4 className="text-base font-heading font-bold text-white mb-1">
                                {quote.title}
                            </h4>
                            <div className="space-y-1 text-xs text-white/70">
                                {quote.commercial_pack && (
                                    <p className="flex items-center gap-1.5 text-xs text-[#30EEE2] font-semibold mb-1">
                                        <Package className="w-3.5 h-3.5" />
                                        <span>Pack Comercial: {quote.commercial_pack.name}</span>
                                    </p>
                                )}
                                <p>
                                    <strong>Tipo de Solución:</strong> {quote.software_type?.name}
                                </p>
                                <p>
                                    <strong>Plazo de Entrega:</strong>{' '}
                                    <span className="text-[#30EEE2] font-semibold">
                                        {quote.estimated_business_days} días hábiles
                                    </span>
                                </p>
                                <p>
                                    <strong>Fecha de Inicio Estimada:</strong>{' '}
                                    {quote.estimated_start_date ? new Date(quote.estimated_start_date).toLocaleDateString('es-AR') : 'A convenir'}
                                </p>
                                <p>
                                    <strong>Fecha de Entrega Estimada:</strong>{' '}
                                    {quote.estimated_delivery_date ? new Date(quote.estimated_delivery_date).toLocaleDateString('es-AR') : 'A convenir'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabla Detallada de Partidas y Módulos */}
                <div className="glass-panel overflow-hidden border-white/10">
                    <div className="p-6 border-b border-white/10">
                        <h3 className="text-base font-heading font-bold text-white">
                            Desglose de Módulos Técnicos y Esfuerzo (Matriz IA)
                        </h3>
                        <p className="text-xs text-white/50">
                            Ponderación de desarrollo base, integraciones de arquitectura y control de calidad (QA/Testing)
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-white/[0.03] text-white/50 border-b border-white/10 uppercase tracking-wider text-[10px]">
                                <tr>
                                    <th className="py-3 px-4 font-semibold">Categoría / Módulo</th>
                                    <th className="py-3 px-4 font-semibold">Descripción del Alcance</th>
                                    <th className="py-3 px-4 font-semibold text-center">Dev</th>
                                    <th className="py-3 px-4 font-semibold text-center">Int</th>
                                    <th className="py-3 px-4 font-semibold text-center">QA</th>
                                    <th className="py-3 px-4 font-semibold text-center">Total Hs</th>
                                    <th className="py-3 px-4 font-semibold text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {quote.items?.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="py-3 px-4">
                                            <span className="text-[10px] text-[#30EEE2] font-semibold uppercase block">
                                                {item.category}
                                            </span>
                                            <strong className="text-white text-xs">{item.name}</strong>
                                        </td>
                                        <td className="py-3 px-4 text-white/70 max-w-sm">
                                            {item.description || '—'}
                                        </td>
                                        <td className="py-3 px-4 text-center text-white/80">{item.hours_dev}h</td>
                                        <td className="py-3 px-4 text-center text-white/80">{item.hours_integration}h</td>
                                        <td className="py-3 px-4 text-center text-white/80">{item.hours_testing_qa}h</td>
                                        <td className="py-3 px-4 text-center font-bold text-[#30EEE2]">
                                            {item.total_hours}h
                                        </td>
                                        <td className="py-3 px-4 text-right font-heading font-bold text-white">
                                            ${Number(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Resumen Financiero y Totales */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Términos y Condiciones */}
                    <div className="lg:col-span-7 glass-panel p-6 space-y-4">
                        <h4 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                            <Shield className="w-4 h-4 text-[#30EEE2]" />
                            Términos Comerciales y Garantía
                        </h4>
                        <div className="text-xs text-white/70 leading-relaxed space-y-2">
                            <p>{quote.terms_conditions}</p>
                            {quote.notes && (
                                <div className="pt-2 border-t border-white/10">
                                    <strong className="text-white">Notas adicionales:</strong>
                                    <p className="mt-1 text-white/60">{quote.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cuadro de Totales */}
                    <div className="lg:col-span-5 glass-panel p-6 space-y-3">
                        <div className="flex items-center justify-between text-xs text-white/70">
                            <span>Horas Totales Estimadas:</span>
                            <span className="font-bold text-white">{quote.total_hours} hs</span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-white/70">
                            <span>Tarifa Aplicada:</span>
                            <span className="font-bold text-white">${Number(quote.hourly_rate).toFixed(2)} / hora</span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-white/70">
                            <span>Subtotal Desarrollo:</span>
                            <span className="font-semibold text-white">
                                ${Number(quote.subtotal_development).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                        </div>

                        {Number(quote.subtotal_infrastructure_setup) > 0 && (
                            <div className="flex items-center justify-between text-xs text-white/70">
                                <span>Setup Infraestructura Cloud:</span>
                                <span className="font-semibold text-white">
                                    +${Number(quote.subtotal_infrastructure_setup).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        )}

                        {Number(quote.subtotal_infrastructure_monthly) > 0 && (
                            <div className="flex items-center justify-between text-xs text-purple-300">
                                <span>Costo Mensual Estimado (Cloud):</span>
                                <span className="font-semibold">
                                    ${Number(quote.subtotal_infrastructure_monthly).toLocaleString('en-US', { minimumFractionDigits: 2 })}/mes
                                </span>
                            </div>
                        )}

                        {Number(quote.discount_amount) > 0 && (
                            <div className="flex items-center justify-between text-xs text-emerald-400">
                                <span>Bonificación ({quote.discount_percentage}%):</span>
                                <span>-${Number(quote.discount_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </div>
                        )}

                        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                            <span className="font-heading font-bold text-white text-base">Inversión Final:</span>
                            <span className="text-2xl font-heading font-extrabold text-[#30EEE2]">
                                ${Number(quote.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========================================================= */}
            {/* VISTA OFICIAL DE IMPRESIÓN / EXPORTACIÓN A PDF (A4 100%)  */}
            {/* ========================================================= */}
            <div className="hidden print:block w-full text-slate-900 bg-white font-sans text-xs">
                {/* 1. Encabezado Corporativo Oficial */}
                <div className="flex justify-between items-start pb-4 border-b-2 border-slate-900 mb-5">
                    <div className="flex items-center gap-3.5">
                        <img src="/images/logo.png" alt="Grupo Xamanen" className="h-12 w-auto object-contain" />
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">GRUPO XAMANEN</h1>
                            <p className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">
                                Soluciones Tecnológicas & Software de Ingeniería
                            </p>
                            <p className="text-[9px] text-slate-500">
                                CUIT: 30-71829340-9 • contacto@xamanen.com • www.grupoxamanen.com
                            </p>
                        </div>
                    </div>

                    <div className="text-right border-l-2 border-slate-200 pl-4">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">
                            Presupuesto Oficial
                        </span>
                        <div className="text-lg font-bold font-mono text-slate-900">
                            {quote.quote_number}
                        </div>
                        <div className="text-[10px] text-slate-700 mt-1">
                            <strong>Emisión:</strong> {new Date(quote.created_at).toLocaleDateString('es-AR')}
                        </div>
                        {quote.valid_until && (
                            <div className="text-[10px] text-slate-700">
                                <strong>Válido Hasta:</strong> {new Date(quote.valid_until).toLocaleDateString('es-AR')}
                            </div>
                        )}
                        <div className="text-[10px] text-slate-600">
                            <strong>Comercial:</strong> {quote.creator?.name || 'Comercial'}
                        </div>
                    </div>
                </div>

                {/* 2. Bloque de Cliente y Resumen del Proyecto */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                    <div className="p-3.5 rounded-lg border border-slate-300 bg-slate-50">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                            Datos del Cliente
                        </span>
                        <h2 className="text-sm font-bold text-slate-900 mb-1">{quote.client?.company_name}</h2>
                        <div className="text-[10px] space-y-0.5 text-slate-700">
                            <p><strong>Contacto:</strong> {quote.client?.contact_name || '—'}</p>
                            <p><strong>Email:</strong> {quote.client?.email || '—'}</p>
                            {quote.client?.phone && <p><strong>Teléfono:</strong> {quote.client.phone}</p>}
                            {quote.client?.cuit_tax_id && <p><strong>CUIT / Razón Social:</strong> {quote.client.cuit_tax_id}</p>}
                            {quote.client?.address && <p><strong>Dirección:</strong> {quote.client.address}</p>}
                        </div>
                    </div>

                    <div className="p-3.5 rounded-lg border border-slate-300 bg-slate-50">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                            Especificaciones de la Solución
                        </span>
                        <h2 className="text-sm font-bold text-slate-900 mb-1">{quote.title}</h2>
                        <div className="text-[10px] space-y-0.5 text-slate-700">
                            <p><strong>Tipo de Software:</strong> {quote.software_type?.name || 'A Medida'}</p>
                            <p><strong>Plazo de Entrega:</strong> <strong className="text-slate-900">{quote.estimated_business_days} días hábiles</strong></p>
                            <p><strong>Fecha Estimada Inicio:</strong> {quote.estimated_start_date ? new Date(quote.estimated_start_date).toLocaleDateString('es-AR') : 'A convenir'}</p>
                            <p><strong>Fecha Estimada Entrega:</strong> {quote.estimated_delivery_date ? new Date(quote.estimated_delivery_date).toLocaleDateString('es-AR') : 'A convenir'}</p>
                        </div>
                    </div>
                </div>

                {/* 3. Tabla Desglosada de Partidas y Módulos */}
                <div className="mb-5">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 pb-1 border-b border-slate-300">
                        Desglose de Partidas Técnicas y Estimación de Horas
                    </h3>
                    <table className="w-full text-left text-[10px] border-collapse border border-slate-300">
                        <thead>
                            <tr className="bg-slate-100 text-slate-800 border-b border-slate-300">
                                <th className="py-2 px-2.5 font-bold border-r border-slate-300">Módulo / Partida</th>
                                <th className="py-2 px-2.5 font-bold border-r border-slate-300">Alcance & Criterios Técnicos</th>
                                <th className="py-2 px-2 text-center font-bold border-r border-slate-300 w-12">Dev</th>
                                <th className="py-2 px-2 text-center font-bold border-r border-slate-300 w-12">Int</th>
                                <th className="py-2 px-2 text-center font-bold border-r border-slate-300 w-12">QA</th>
                                <th className="py-2 px-2 text-center font-bold border-r border-slate-300 w-14">Total Hs</th>
                                <th className="py-2 px-2.5 text-right font-bold w-24">Subtotal USD</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quote.items?.map((item, idx) => (
                                <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                    <td className="py-1.5 px-2.5 border-r border-t border-slate-300 align-top">
                                        <span className="font-bold text-slate-900 block">{item.name}</span>
                                        <span className="text-[8px] text-slate-500 uppercase">{item.category}</span>
                                    </td>
                                    <td className="py-1.5 px-2.5 border-r border-t border-slate-300 align-top text-slate-700">
                                        {item.description || 'Implementación y validación de funcionalidad'}
                                    </td>
                                    <td className="py-1.5 px-2 text-center border-r border-t border-slate-300 align-top">{item.hours_dev}h</td>
                                    <td className="py-1.5 px-2 text-center border-r border-t border-slate-300 align-top">{item.hours_integration}h</td>
                                    <td className="py-1.5 px-2 text-center border-r border-t border-slate-300 align-top">{item.hours_testing_qa}h</td>
                                    <td className="py-1.5 px-2 text-center font-bold border-r border-t border-slate-300 align-top text-slate-900">
                                        {item.total_hours}h
                                    </td>
                                    <td className="py-1.5 px-2.5 text-right font-bold border-t border-slate-300 align-top text-slate-900">
                                        ${Number(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 4. Resumen Económico y Términos */}
                <div className="grid grid-cols-12 gap-4 mb-6 page-break-inside-avoid">
                    <div className="col-span-7 p-3.5 rounded-lg border border-slate-300 bg-slate-50 space-y-2 text-[10px]">
                        <h4 className="font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">
                            Condiciones Comerciales & Forma de Pago
                        </h4>
                        <p className="text-slate-700 leading-relaxed">{quote.terms_conditions}</p>
                        {quote.notes && (
                            <div className="pt-1.5 border-t border-slate-200">
                                <strong className="text-slate-900">Observaciones:</strong>
                                <p className="text-slate-600">{quote.notes}</p>
                            </div>
                        )}
                        <p className="text-[9px] text-slate-500 italic pt-1">
                            * Presupuesto expresado en Dólares Estadounidenses (USD). No incluye impuestos adicionales salvo especificación contraria.
                        </p>
                    </div>

                    <div className="col-span-5 p-3.5 rounded-lg border-2 border-slate-900 bg-white space-y-1.5 text-[10px]">
                        <div className="flex justify-between text-slate-700">
                            <span>Horas Totales de Ingeniería:</span>
                            <strong className="text-slate-900">{quote.total_hours} hs</strong>
                        </div>
                        <div className="flex justify-between text-slate-700">
                            <span>Tarifa por Hora:</span>
                            <strong className="text-slate-900">${Number(quote.hourly_rate).toFixed(2)} USD</strong>
                        </div>
                        <div className="flex justify-between text-slate-700">
                            <span>Subtotal Software:</span>
                            <span className="font-semibold text-slate-900">${Number(quote.subtotal_development).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                        </div>
                        {Number(quote.subtotal_infrastructure_setup) > 0 && (
                            <div className="flex justify-between text-slate-700">
                                <span>Setup Infraestructura Cloud:</span>
                                <span className="font-semibold text-slate-900">+${Number(quote.subtotal_infrastructure_setup).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </div>
                        )}
                        {Number(quote.subtotal_infrastructure_monthly) > 0 && (
                            <div className="flex justify-between text-indigo-700">
                                <span>Costo Mensual Cloud Est.:</span>
                                <span className="font-semibold">${Number(quote.subtotal_infrastructure_monthly).toLocaleString('en-US', { minimumFractionDigits: 2 })}/mes</span>
                            </div>
                        )}
                        {Number(quote.discount_amount) > 0 && (
                            <div className="flex justify-between text-emerald-700">
                                <span>Bonificación Comercial ({quote.discount_percentage}%):</span>
                                <span className="font-bold">-${Number(quote.discount_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </div>
                        )}
                        <div className="pt-2 border-t-2 border-slate-900 flex justify-between items-center text-sm font-bold">
                            <span className="text-slate-900">Total Inversión:</span>
                            <span className="text-base font-extrabold text-slate-900 font-mono">
                                ${Number(quote.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                            </span>
                        </div>
                    </div>
                </div>

                {/* 5. Bloque Formal de Firmas */}
                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-300 page-break-inside-avoid mb-4">
                    <div className="text-center pt-8 border-t border-slate-400">
                        <p className="font-bold text-slate-900 text-[11px]">Por GRUPO XAMANEN</p>
                        <p className="text-[9px] text-slate-500">Firma y Sello Comercial Autorizado</p>
                    </div>

                    <div className="text-center pt-8 border-t border-slate-400">
                        <p className="font-bold text-slate-900 text-[11px]">Conformidad y Aceptación del Cliente</p>
                        <p className="text-[9px] text-slate-500">Firma, Aclaración y Fecha de Aprobación</p>
                    </div>
                </div>

                {/* 6. Pie de Página Corporativo */}
                <div className="text-center pt-3 border-t border-slate-200 text-[8px] text-slate-400">
                    Documento de cotización confidencial emitido por Grupo Xamanen • Todos los derechos reservados.
                </div>
            </div>
        </AppLayout>
    );
}
