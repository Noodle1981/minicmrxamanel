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
            roles: ['super_admin', 'vendedor', 'desarrollador', 'disenador', 'qa_tester', 'validador', 'cliente'],
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
            roles: ['super_admin', 'vendedor', 'cliente'],
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
            name: 'Portal del Cliente',
            href: route('portal.dashboard'),
            routePattern: 'portal.*',
            icon: FileText,
            roles: ['cliente', 'super_admin', 'vendedor'],
        },
        {
            name: 'Catálogo & Matriz IA',
            href: '#',
            icon: Layers,
            roles: ['super_admin'],
        },
        {
            name: 'Administración & Roles',
            href: '#',
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
        cliente: { label: 'Portal Cliente', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
        desarrollador: { label: 'Desarrollador', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' },
        disenador: { label: 'Diseñador UI/UX', color: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40' },
        qa_tester: { label: 'QA & Testing', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
        validador: { label: 'Validador Tech Lead', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40' },
    };

    return (
        <div className="min-h-screen bg-[#0A0C10] text-[#F0F2F5] flex flex-col md:flex-row antialiased selection:bg-[#30EEE2] selection:text-[#0A0C10]">
            {/* ==================== MOBILE SIDEBAR BACKDROP ==================== */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ==================== SIDEBAR ==================== */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#101522]/90 backdrop-blur-xl border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Logo & Marca */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
                    <Link href={route('dashboard')} className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#30EEE2] via-[#3C84CE] to-[#65005E] p-[1.5px] shadow-lg shadow-[#30EEE2]/20">
                            <div className="w-full h-full bg-[#0A0C10] rounded-[10px] flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-[#30EEE2] group-hover:scale-110 transition-transform" />
                            </div>
                        </div>
                        <div>
                            <span className="font-heading font-bold text-lg text-white tracking-wide block">
                                Grupo <span className="text-[#30EEE2]">Xamanen</span>
                            </span>
                            <span className="text-[11px] text-white/50 tracking-wider uppercase block">
                                CPQ & Proyectos
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

                {/* Switcher Multi-Rol (Si el usuario tiene varios roles) */}
                <div className="p-4 border-b border-white/10 bg-white/[0.02]">
                    {userRoles.length > 1 ? (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border ${roleLabels[activeRole]?.color} transition-all`}
                            >
                                <span className="flex items-center gap-2">
                                    <Briefcase className="w-3.5 h-3.5" />
                                    {roleLabels[activeRole]?.label}
                                </span>
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {roleDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1.5 py-1.5 bg-[#161D2E] border border-white/10 rounded-lg shadow-2xl z-30 backdrop-blur-md">
                                    {userRoles.map((r) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => {
                                                setActiveRole(r);
                                                setRoleDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-white/5 transition-colors ${
                                                activeRole === r ? 'text-[#30EEE2] font-semibold' : 'text-white/80'
                                            }`}
                                        >
                                            <span>{roleLabels[r]?.label || r}</span>
                                            {activeRole === r && <CheckCircle2 className="w-3.5 h-3.5 text-[#30EEE2]" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={`px-3 py-2 rounded-lg text-xs font-medium border ${roleLabels[activeRole]?.color}`}>
                            {roleLabels[activeRole]?.label}
                        </div>
                    )}
                </div>

                {/* Menú de Navegación */}
                <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                    <div className="text-[11px] font-semibold text-white/40 uppercase tracking-wider px-3 mb-2">
                        Menú Principal
                    </div>
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

                {/* Footer del Sidebar con Cerrar Sesión */}
                <div className="p-4 border-t border-white/10 bg-white/[0.02]">
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

            {/* ==================== CONTENIDO PRINCIPAL ==================== */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header Superior Navbar */}
                <header className="h-20 bg-[#101522]/80 backdrop-blur-xl border-b border-white/10 px-6 flex items-center justify-between sticky top-0 z-30">
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
                        {/* Indicador de Entorno / Preset */}
                        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-white/70">
                            <span className="w-2 h-2 rounded-full bg-[#30EEE2] animate-pulse"></span>
                            <span>Sistema Operativo Xamanen</span>
                        </div>

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
