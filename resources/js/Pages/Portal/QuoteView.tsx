import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { Quote } from '@/types';
import {
    FileText,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Send,
    Clock,
    Shield,
    Sparkles,
    Calendar,
    DollarSign,
    MessageSquare,
    Printer,
    Check,
} from 'lucide-react';

interface QuoteViewProps {
    quote: Quote;
}

export default function QuoteView({ quote }: QuoteViewProps) {
    const [actionModal, setActionModal] = useState<'accept' | 'reject' | null>(null);
    const [feedbackText, setFeedbackText] = useState('');
    const [processingAction, setProcessingAction] = useState(false);

    // Formulario de comentarios / preguntas
    const { data: commentData, setData: setCommentData, post: postComment, processing: processingComment, reset: resetComment } = useForm({
        content: '',
    });

    const handleActionSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!actionModal) return;

        setProcessingAction(true);
        router.post(
            route('portal.quotes.respond', quote.id),
            {
                action: actionModal,
                feedback: feedbackText,
            },
            {
                onFinish: () => {
                    setProcessingAction(false);
                    setActionModal(null);
                    setFeedbackText('');
                },
            }
        );
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        postComment(route('portal.quotes.comment', quote.id), {
            onSuccess: () => resetComment(),
        });
    };

    const isPending = quote.status === 'sent' || quote.status === 'under_review';
    const isAccepted = quote.status === 'accepted';
    const isRejected = quote.status === 'rejected';

    return (
        <AppLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('portal.dashboard')}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                            title="Volver a Mi Portal"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-heading font-bold text-white leading-tight">
                                    Propuesta {quote.quote_number}
                                </h2>
                                {isAccepted && (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Aprobada
                                    </span>
                                )}
                                {isPending && (
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#30EEE2]/20 text-[#30EEE2] border border-[#30EEE2]/40 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> Pendiente de Aprobación
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-white/50">{quote.title}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="btn-xamanen-secondary text-xs px-3 py-2 print:hidden"
                        >
                            <Printer className="w-3.5 h-3.5" />
                            Imprimir / Guardar
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={`Propuesta Comercial ${quote.quote_number}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Banner de Estado para el Cliente */}
                {isAccepted && (
                    <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-white flex items-center gap-4 shadow-xl">
                        <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-base font-heading font-bold text-emerald-300">
                                ¡Propuesta Aprobada Formalmente!
                            </h3>
                            <p className="text-xs text-emerald-100/80 mt-0.5">
                                Este presupuesto fue aceptado el {quote.accepted_at ? new Date(quote.accepted_at).toLocaleDateString('es-AR') : 'recientemente'}. El equipo de Grupo Xamanen se encuentra preparando el entorno de trabajo y el inicio del proyecto.
                            </p>
                        </div>
                    </div>
                )}

                {isRejected && (
                    <div className="p-6 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-white flex items-center gap-4 shadow-xl">
                        <div className="p-3 rounded-xl bg-rose-500/20 text-rose-300 shrink-0">
                            <XCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-base font-heading font-bold text-rose-300">
                                Propuesta Marcada como Rechazada
                            </h3>
                            <p className="text-xs text-rose-100/80 mt-0.5">
                                Motivo: {quote.rejection_reason || 'Sin motivo especificado'}. Tu asesor comercial revisará los requerimientos para ofrecerte una alternativa.
                            </p>
                        </div>
                    </div>
                )}

                {/* Encabezado Ejecutivo */}
                <div className="glass-panel p-8 border-white/10">
                    <div className="flex flex-col sm:flex-row justify-between gap-6 pb-6 border-b border-white/10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#30EEE2] via-[#3C84CE] to-[#65005E] flex items-center justify-center text-white font-extrabold shadow-lg">
                                    <Sparkles className="w-5 h-5 text-[#0A0C10]" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-heading font-extrabold text-white">
                                        GRUPO XAMANEN
                                    </h3>
                                    <p className="text-[10px] text-[#30EEE2] font-semibold tracking-wider uppercase">
                                        Propuesta Técnica & Comercial
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-white/50">
                                Preparada especialmente para: <strong className="text-white">{quote.client?.company_name}</strong>
                            </p>
                        </div>

                        <div className="text-left sm:text-right space-y-1">
                            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest block">
                                Cotización Nº
                            </span>
                            <div className="text-xl font-heading font-extrabold text-[#30EEE2] font-mono">
                                {quote.quote_number}
                            </div>
                            <div className="text-xs text-white/60">
                                Validez: {quote.valid_until ? new Date(quote.valid_until).toLocaleDateString('es-AR') : '15 días'}
                            </div>
                        </div>
                    </div>

                    {/* Resumen del Alcance */}
                    <div className="pt-6 space-y-4">
                        <div>
                            <span className="text-[10px] font-bold text-[#30EEE2] uppercase tracking-wider block">
                                Solución Propuesta
                            </span>
                            <h4 className="text-lg font-heading font-bold text-white mt-0.5">
                                {quote.title}
                            </h4>
                            <p className="text-xs text-white/70 mt-1">
                                {quote.software_type?.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                                <span className="text-[10px] text-white/40 uppercase tracking-wider block">
                                    Plazo de Entrega
                                </span>
                                <p className="text-base font-heading font-bold text-[#30EEE2] mt-0.5">
                                    {quote.estimated_business_days} días hábiles
                                </p>
                                <span className="text-[10px] text-white/40">Excluye fines de semana</span>
                            </div>

                            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                                <span className="text-[10px] text-white/40 uppercase tracking-wider block">
                                    Total Horas de Ingeniería
                                </span>
                                <p className="text-base font-heading font-bold text-white mt-0.5">
                                    {quote.total_hours} hs
                                </p>
                                <span className="text-[10px] text-white/40">Incluye Dev + QA + Testing</span>
                            </div>

                            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10">
                                <span className="text-[10px] text-white/40 uppercase tracking-wider block">
                                    Garantía Pos-Lanzamiento
                                </span>
                                <p className="text-base font-heading font-bold text-emerald-400 mt-0.5">
                                    3 Meses
                                </p>
                                <span className="text-[10px] text-white/40">Soporte y correcciones</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabla de Módulos Incluidos */}
                <div className="glass-panel overflow-hidden border-white/10">
                    <div className="p-6 border-b border-white/10">
                        <h3 className="text-base font-heading font-bold text-white">
                            Módulos y Entregables Incluidos en la Propuesta
                        </h3>
                    </div>

                    <div className="divide-y divide-white/5">
                        {quote.items?.map((item) => (
                            <div key={item.id} className="p-4 flex items-start justify-between gap-4">
                                <div>
                                    <span className="text-[10px] text-[#30EEE2] font-semibold uppercase tracking-wider">
                                        {item.category}
                                    </span>
                                    <h5 className="text-sm font-bold text-white mt-0.5">{item.name}</h5>
                                    {item.description && (
                                        <p className="text-xs text-white/60 mt-1 max-w-xl">
                                            {item.description}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="text-sm font-heading font-bold text-white">
                                        ${Number(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                    <span className="text-[10px] text-white/40 block">USD</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total Final */}
                    <div className="p-6 bg-white/[0.02] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <span className="text-xs text-white/60 block">Inversión total del proyecto:</span>
                            <span className="text-xs text-emerald-400 font-medium">
                                {quote.discount_amount > 0 ? `Incluye bonificación comercial del ${quote.discount_percentage}%` : 'Precios netos en USD'}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-heading font-extrabold text-[#30EEE2]">
                                ${Number(quote.total_amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                            </span>
                        </div>
                    </div>
                </div>

                {/* Botones de Acción de Aprobación para el Cliente */}
                {isPending && (
                    <div className="glass-panel p-6 border-[#30EEE2]/40 shadow-2xl bg-gradient-to-r from-[#101522] via-[#161D2E] to-[#101522]">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h4 className="text-base font-heading font-bold text-white">
                                    ¿Listo para comenzar tu desarrollo?
                                </h4>
                                <p className="text-xs text-white/60 mt-0.5">
                                    Al aceptar esta propuesta, nuestro equipo iniciará de inmediato la etapa operativa de diseño e ingeniería.
                                </p>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setActionModal('reject')}
                                    className="btn-xamanen-secondary text-xs px-4 py-2.5 text-rose-300 border-rose-500/30 hover:bg-rose-500/10"
                                >
                                    Solicitar Ajustes
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setActionModal('accept')}
                                    className="btn-xamanen-primary text-xs px-5 py-2.5 shadow-xl font-bold"
                                >
                                    <CheckCircle2 className="w-4 h-4" />
                                    Aceptar y Confirmar Propuesta
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Confirmación de Aceptación / Rechazo */}
                {actionModal && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                        <div className="glass-panel p-6 max-w-md w-full border-white/20 shadow-2xl space-y-4">
                            <h3 className="text-lg font-heading font-bold text-white">
                                {actionModal === 'accept' ? 'Confirmar Aceptación de Propuesta' : 'Solicitar Ajustes / Rechazar'}
                            </h3>
                            <p className="text-xs text-white/70">
                                {actionModal === 'accept'
                                    ? 'Estás a punto de confirmar la propuesta ' + quote.quote_number + ' por $' + Number(quote.total_amount).toFixed(2) + ' USD. Puedes dejar un comentario o instrucción inicial para nuestro equipo.'
                                    : 'Por favor, indícanos el motivo o los ajustes que requieres para que podamos enviarte una versión modificada.'}
                            </p>

                            <form onSubmit={handleActionSubmit} className="space-y-4">
                                <textarea
                                    rows={3}
                                    value={feedbackText}
                                    onChange={(e) => setFeedbackText(e.target.value)}
                                    placeholder={actionModal === 'accept' ? 'Comentarios adicionales (opcional)...' : 'Describe los cambios solicitados...'}
                                    className="w-full input-xamanen text-xs"
                                    required={actionModal === 'reject'}
                                />

                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setActionModal(null)}
                                        className="btn-xamanen-secondary text-xs"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processingAction}
                                        className={`text-xs px-4 py-2 rounded-xl font-bold transition-all ${
                                            actionModal === 'accept'
                                                ? 'btn-xamanen-primary'
                                                : 'bg-rose-500 hover:bg-rose-600 text-white'
                                        }`}
                                    >
                                        {actionModal === 'accept' ? 'Confirmar Aceptación' : 'Enviar Respuesta'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Sección de Consultas / Comentarios */}
                <div className="glass-panel p-6 space-y-4">
                    <h4 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-[#30EEE2]" />
                        Consultas y Mensajes con el Equipo Técnico
                    </h4>

                    {quote.comments && quote.comments.length > 0 && (
                        <div className="space-y-3 pt-2">
                            {quote.comments.map((comment) => (
                                <div key={comment.id} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs">
                                    <div className="flex items-center justify-between text-white/50 text-[10px] mb-1">
                                        <strong className="text-white">{comment.user?.name || 'Usuario'}</strong>
                                        <span>{new Date(comment.created_at).toLocaleString('es-AR')}</span>
                                    </div>
                                    <p className="text-white/80">{comment.content}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <form onSubmit={handleCommentSubmit} className="space-y-3 pt-2 border-t border-white/10">
                        <textarea
                            rows={2}
                            value={commentData.content}
                            onChange={(e) => setCommentData('content', e.target.value)}
                            placeholder="Escribe una pregunta o aclaración para nuestro equipo comercial..."
                            className="w-full input-xamanen text-xs"
                            required
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processingComment}
                                className="btn-xamanen-secondary text-xs"
                            >
                                <Send className="w-3.5 h-3.5" />
                                Enviar Consulta
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
