import React, { FormEventHandler } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Sparkles,
    Shield,
    Briefcase,
    Laptop,
    Palette,
    Building2,
    Lock,
    Mail,
    ArrowRight,
    CheckCircle2,
    LogIn,
} from 'lucide-react';

interface TestUser {
    name: string;
    email: string;
    roleLabel: string;
    roleDesc: string;
    icon: React.ComponentType<{ className?: string }>;
    badgeColor: string;
    borderHover: string;
}

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: true as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    // Usuarios de prueba precargados
    const testUsers: TestUser[] = [
        {
            name: 'Administrador Xamanen',
            email: 'admin@grupoxamanen.com.ar',
            roleLabel: 'Super Admin',
            roleDesc: 'Visión global, parámetros y administración',
            icon: Shield,
            badgeColor: 'bg-[#65005E]/30 text-fuchsia-300 border-[#65005E]/60',
            borderHover: 'hover:border-fuchsia-500/50',
        },
        {
            name: 'Marcos Ventas',
            email: 'ventas@grupoxamanen.com.ar',
            roleLabel: 'Comercial / Ventas',
            roleDesc: 'Cotizador CPQ interactivo y CRM de clientes',
            icon: Briefcase,
            badgeColor: 'bg-[#3C84CE]/25 text-[#30EEE2] border-[#3C84CE]/50',
            borderHover: 'hover:border-[#30EEE2]/50',
        },
        {
            name: 'Agustín Tech Lead',
            email: 'tech@grupoxamanen.com.ar',
            roleLabel: 'Multi-Rol Técnico',
            roleDesc: 'Desarrollador + QA + Validador Tech Lead',
            icon: Laptop,
            badgeColor: 'bg-indigo-500/25 text-indigo-300 border-indigo-500/50',
            borderHover: 'hover:border-indigo-400/50',
        },
        {
            name: 'Lucía Diseñadora',
            email: 'design@grupoxamanen.com.ar',
            roleLabel: 'Diseño UI/UX',
            roleDesc: 'Diseño de interfaz Aurora Glass & Assets',
            icon: Palette,
            badgeColor: 'bg-pink-500/25 text-pink-300 border-pink-500/50',
            borderHover: 'hover:border-pink-400/50',
        },
        {
            name: 'Ing. Carlos Mendoza',
            email: 'contacto@mineraandina.com',
            roleLabel: 'Portal Cliente',
            roleDesc: 'Minera Los Andes (Aprobar o rechazar cotizaciones)',
            icon: Building2,
            badgeColor: 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50',
            borderHover: 'hover:border-emerald-400/50',
        },
    ];

    const selectTestUser = (user: TestUser) => {
        setData((prev) => ({
            ...prev,
            email: user.email,
            password: 'password',
        }));
    };

    return (
        <GuestLayout>
            <Head title="Iniciar Sesión - Grupo Xamanen" />

            <div className="glass-panel p-6 sm:p-8 space-y-6 border-white/10 shadow-2xl">
                {/* Cabecera del formulario */}
                <div className="text-center pb-2">
                    <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
                        Iniciar Sesión
                    </h2>
                    <p className="text-xs text-white/50 mt-1">
                        Ingresa a tu cuenta para presupuestar y gestionar proyectos
                    </p>
                </div>

                {status && (
                    <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs text-center font-medium">
                        {status}
                    </div>
                )}

                {/* ==================== SELECTOR DE ACCESO RÁPIDO (DEMO USERS) ==================== */}
                <div className="space-y-2.5 pb-5 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#30EEE2] uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            Acceso Rápido / Usuarios de Prueba
                        </span>
                        <span className="text-[10px] text-white/40">1 clic para completar</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {testUsers.map((u, idx) => {
                            const Icon = u.icon;
                            const isSelected = data.email === u.email;

                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => selectTestUser(u)}
                                    className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                                        isSelected
                                            ? 'bg-[#30EEE2]/10 border-[#30EEE2] shadow-lg shadow-[#30EEE2]/10'
                                            : 'bg-white/[0.02] border-white/10 hover:bg-white/5 ' + u.borderHover
                                    } ${idx === testUsers.length - 1 ? 'sm:col-span-2' : ''}`}
                                >
                                    <div className="p-1.5 rounded-lg bg-white/5 text-white/80 shrink-0 mt-0.5">
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <div className="overflow-hidden flex-1">
                                        <div className="flex items-center justify-between gap-1">
                                            <span className="text-xs font-bold text-white truncate">
                                                {u.name}
                                            </span>
                                            <span
                                                className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold shrink-0 ${u.badgeColor}`}
                                            >
                                                {u.roleLabel}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-white/50 truncate mt-0.5">
                                            {u.roleDesc}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ==================== FORMULARIO DE ACCESO ==================== */}
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                            Correo Electrónico
                        </label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="ejemplo@grupoxamanen.com.ar"
                                className="w-full input-xamanen text-sm pl-9"
                                autoComplete="username"
                                required
                            />
                        </div>
                        <InputError message={errors.email} className="mt-1" />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                            Contraseña
                        </label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                className="w-full input-xamanen text-sm pl-9"
                                autoComplete="current-password"
                                required
                            />
                        </div>
                        <InputError message={errors.password} className="mt-1" />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', (e.target.checked || false) as false)}
                                className="rounded border-white/20 bg-white/5 text-[#30EEE2] focus:ring-[#30EEE2]"
                            />
                            <span className="text-xs text-white/60 select-none">Recordar mi sesión</span>
                        </label>

                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs text-white/50 hover:text-[#30EEE2] transition-colors"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full btn-xamanen-primary text-sm py-3 font-bold shadow-xl flex items-center justify-center gap-2"
                    >
                        <LogIn className="w-4 h-4" />
                        Ingresar a la Plataforma
                    </button>
                </form>
            </div>
        </GuestLayout>
    );
}
