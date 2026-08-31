import React, { useState, useEffect, ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps, RoleName, User } from '@/types';
import {
    LayoutDashboard,
    Calculator,
    Users,
    FolderKanban,
    CheckSquare,
    Calendar,
    Settings,
    Shield,
    Layers,
    FileText,
    LogOut,
    UserCircle,
    Menu,
    X,
    ChevronDown,
    Sparkles,
    Briefcase,
    Laptop,
    CheckCircle2,
    AlertCircle,
    Info,
} from 'lucide-react';

interface AppLayoutProps {
    header?: ReactNode;
    children: ReactNode;
}

interface NavItem {
    name: string;
    href: string;
    routePattern?: string;
    icon: React.ComponentType<{ className?: string }>;
    roles: RoleName[];
    badge?: string;
}

export default function AppLayout({ header, children }: AppLayoutProps) {
    const { auth, flash } = usePage<PageProps>().props;
    const { url } = usePage();
    const user = auth.user as User;
    const userRoles = (auth.roles || user.roles?.map((r) => r.name) || ['vendedor']) as RoleName[];

    // Selector multi-rol: permite alternar el rol activo si el usuario posee más de uno
    const [activeRole, setActiveRole] = useState<RoleName>(() => {
        return userRoles[0] || 'vendedor';
    });

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

    // Definición de ítems de navegación según el rol activo
    const navigationItems: NavItem[] = [
        {
            name: 'Dashboard General',
            href: route('dashboard'),
            routePattern: 'dashboard',
            icon: LayoutDashboard,
            roles: ['super_admin', 'vendedor', 'desarrollador', 'disenador', 'qa_tester', 'validador'],
        },
        {
            name: 'Cotizador CPQ',
            href: route('quotes.create'),
            routePattern: 'quotes.create',
            icon: Calculator,
            roles: ['super_admin', 'vendedor'],
        },
        {
            name: 'Historial Cotizaciones',
            href: route('quotes.index'),
            routePattern: 'quotes.index',
            icon: FileText,
            roles: ['super_admin', 'vendedor'],
        },
        {
            name: 'Clientes (Mini-CRM)',
            href: route('clients.index'),
            routePattern: 'clients.*',
            icon: Users,
            roles: ['super_admin', 'vendedor'],
        },
        {
            name: 'Proyectos & Obras',
            href: route('projects.index'),
            routePattern: 'projects.*',
            icon: FolderKanban,
            roles: ['super_admin', 'vendedor', 'desarrollador', 'disenador', 'qa_tester', 'validador'],
        },
        {
            name: 'Tablero de Tickets',
            href: route('tickets.index'),
            routePattern: 'tickets.*',
            icon: CheckSquare,
            roles: ['super_admin', 'desarrollador', 'disenador', 'qa_tester', 'validador'],
        },
        {
            name: 'Calendario & Carga',
            href: route('calendar.index'),
            routePattern: 'calendar.*',
            icon: Calendar,
            roles: ['super_admin', 'desarrollador', 'disenador', 'qa_tester', 'validador', 'vendedor'],
        },
        {
            name: 'Catálogo & Matriz IA',
            href: route('catalog.index'),
            routePattern: 'catalog.*',
            icon: Layers,
            roles: ['super_admin', 'vendedor', 'desarrollador', 'validador'],
        },
        {
            name: 'Administración & Roles',
            href: route('admin.users.index'),
            routePattern: 'admin.*',
            icon: Shield,
            roles: ['super_admin'],
        },
    ];

    // Filtrar ítems visibles según el rol activo seleccionado
    const visibleNavItems = navigationItems.filter(
        (item) => item.roles.includes(activeRole) || activeRole === 'super_admin'
    );

    // Mapeo amigable de nombres de roles
    const roleLabels: Record<RoleName, { label: string; color: string }> = {
        super_admin: { label: 'Super Admin', color: 'bg-[#65005E]/40 text-[#F0F2F5] border-[#65005E]' },
        vendedor: { label: 'Comercial / Ventas', color: 'bg-[#3C84CE]/20 text-[#30EEE2] border-[#3C84CE]/40' },
        desarrollador: { label: 'Desarrollador', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
        disenador: { label: 'Diseñador UI/UX', color: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40' },
        qa_tester: { label: 'QA & Testing', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
        validador: { label: 'Validador Tech Lead', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40' },
    };

    return (
        <div className="h-screen w-screen overflow-hidden bg-[#0A0C10] text-[#F0F2F5] flex flex-col md:flex-row antialiased selection:bg-[#30EEE2] selection:text-[#0A0C10]">
            {/* ==================== MOBILE SIDEBAR BACKDROP ==================== */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ==================== SIDEBAR FIJO ==================== */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#101522]/95 backdrop-blur-2xl border-r border-white/10 flex flex-col h-full shrink-0 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Logo & Marca */}
                <div className="h-20 shrink-0 flex items-center justify-between px-5 border-b border-white/10">
                    <Link href={route('dashboard')} className="flex items-center gap-3 group">
                        <img
                            src="/images/logo.png"
                            alt="Grupo Xamanen"
                            className="h-10 w-auto object-contain drop-shadow-[0_0_15px_rgba(48,238,226,0.3)] group-hover:scale-105 transition-transform"
                        />
                        <div>
                            <span className="font-heading font-bold text-base text-white tracking-wide block leading-tight">
                                Grupo <span className="text-[#30EEE2]">Xamanen</span>
                            </span>
                            <span className="text-[10px] text-white/50 tracking-wider uppercase block font-medium">
                                CPQ & Operaciones
                            </span>
                        </div>
                    </Link>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Menú de Navegación */}
                <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                    {visibleNavItems.map((item, index) => {
                        const Icon = item.icon;
                        
                        // Detección unívoca de ruta activa
                        let isActive = false;
                        if (item.routePattern) {
                            try {
                                if (typeof route().current === 'function') {
                                    if (item.routePattern === 'quotes.index') {
                                        isActive = route().current('quotes.index') || route().current('quotes.show');
                                    } else {
                                        isActive = route().current(item.routePattern);
                                    }
                                }
                            } catch (e) {
                                // fallback
                            }
                        }
                        
                        if (!isActive && !item.routePattern && item.href && item.href !== '#') {
                            try {
                                const itemPath = new URL(item.href, window.location.origin).pathname;
                                if (itemPath === '/' && url === '/') {
                                    isActive = true;
                                } else if (itemPath !== '/' && url === itemPath) {
                                    isActive = true;
                                }
                            } catch (e) {
                                // fallback
                            }
                        }

                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={`relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                    isActive
                                        ? 'bg-gradient-to-r from-[#30EEE2]/20 via-[#3C84CE]/20 to-transparent text-white border border-[#30EEE2]/40 shadow-lg shadow-[#30EEE2]/10 font-bold'
                                        : 'text-white/70 hover:text-white hover:bg-white/[0.05] border border-transparent'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    {isActive && (
                                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#30EEE2] shadow-sm shadow-[#30EEE2]" />
                                    )}
                                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#30EEE2]' : 'text-white/50'}`} />
                                    <span className={isActive ? 'text-white font-bold' : ''}>{item.name}</span>
                                </div>
                                {item.badge && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#30EEE2]/20 text-[#30EEE2] border border-[#30EEE2]/40">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer del Sidebar con Cerrar Sesión (Siempre Visible y Fijo) */}
                <div className="p-4 border-t border-white/10 bg-white/[0.02] shrink-0">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="w-full flex items-center justify-between p-2 rounded-xl text-white/70 hover:text-rose-400 hover:bg-rose-500/10 transition-colors group"
                        title="Cerrar Sesión"
                    >
                        <div className="flex items-center gap-3 overflow-hidden text-left">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3C84CE] to-[#65005E] flex items-center justify-center text-white font-bold text-xs shrink-0 border border-white/20">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs font-semibold text-white group-hover:text-rose-400 transition-colors">
                                    Cerrar Sesión
                                </p>
                                <p className="text-[10px] text-white/40 truncate">{user.email}</p>
                            </div>
                        </div>

                        <LogOut className="w-4 h-4 text-white/40 group-hover:text-rose-400 transition-colors shrink-0" />
                    </Link>
                </div>
            </aside>

            {/* ==================== CONTENIDO PRINCIPAL CON SCROLL INDEPENDIENTE ==================== */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto custom-scrollbar">
                {/* Header Superior Navbar (Sticky Pinned) */}
                <header className="h-20 bg-[#101522]/90 backdrop-blur-xl border-b border-white/10 px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            {header || (
                                <h1 className="text-lg font-heading font-semibold text-white">
                                    Plataforma de Presupuestación & Gestión
                                </h1>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Menú de Perfil */}
                        <div className="relative">
                            <button
                                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3C84CE] to-[#65005E] flex items-center justify-center text-xs font-bold text-white border border-white/20">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span className="hidden sm:block text-xs font-medium text-white/90">
                                    {user.name}
                                </span>
                                <ChevronDown className="w-3.5 h-3.5 text-white/50" />
                            </button>

                            {profileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-52 py-1 bg-[#161D2E] border border-white/10 rounded-xl shadow-2xl z-40 backdrop-blur-xl">
                                    <div className="px-4 py-2.5 border-b border-white/10">
                                        <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                                        <p className="text-[11px] text-white/50 truncate mb-1.5">{user.email}</p>
                                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#30EEE2]/10 text-[#30EEE2] border border-[#30EEE2]/30">
                                            <Shield className="w-2.5 h-2.5" />
                                            {roleLabels[activeRole]?.label || activeRole}
                                        </div>
                                    </div>
                                    <Link
                                        href={route('profile.edit')}
                                        className="flex items-center gap-2 px-4 py-2 text-xs text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                                        onClick={() => setProfileDropdownOpen(false)}
                                    >
                                        <UserCircle className="w-4 h-4 text-white/50" />
                                        Mi Perfil
                                    </Link>
                                    <div className="border-t border-white/10 my-1"></div>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                                        onClick={() => setProfileDropdownOpen(false)}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Cerrar Sesión
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Notificaciones Flash / Toasts */}
                {flash?.success && (
                    <div className="mx-6 mt-4 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-sm flex items-center gap-3 shadow-lg">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="mx-6 mt-4 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-sm flex items-center gap-3 shadow-lg">
                        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                )}
                {flash?.info && (
                    <div className="mx-6 mt-4 p-4 rounded-xl bg-[#3C84CE]/15 border border-[#3C84CE]/30 text-[#30EEE2] text-sm flex items-center gap-3 shadow-lg">
                        <Info className="w-5 h-5 text-[#30EEE2] shrink-0" />
                        <span>{flash.info}</span>
                    </div>
                )}

                {/* Contenedor Principal */}
                <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
