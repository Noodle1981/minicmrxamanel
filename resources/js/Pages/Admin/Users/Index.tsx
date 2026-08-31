import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Role, RoleName, User } from '@/types';
import {
    Shield,
    Users,
    Search,
    Filter,
    Plus,
    Edit,
    CheckCircle2,
    XCircle,
    Mail,
    Phone,
    Briefcase,
    Laptop,
    Palette,
    UserCheck,
    Lock,
} from 'lucide-react';

interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface IndexProps {
    users: PaginatedUsers;
    roles: Role[];
    filters: {
        search?: string;
        role?: string;
    };
    metrics: {
        total_users: number;
        active_users: number;
        admins_count: number;
        sales_count: number;
        devs_count: number;
    };
}

export default function Index({ users, roles, filters, metrics }: IndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');

    // Modal de Creación / Edición
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        is_active: true,
        role_ids: [] as number[],
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('admin.users.index'),
            { search, role: roleFilter },
            { preserveState: true }
        );
    };

    const openCreateModal = () => {
        setEditingUser(null);
        reset();
        setData({
            name: '',
            email: '',
            phone: '',
            password: '',
            is_active: true,
            role_ids: [roles.find((r) => r.name === 'vendedor')?.id || roles[0]?.id || 1],
        });
        setModalOpen(true);
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            password: '',
            is_active: user.is_active,
            role_ids: user.roles?.map((r) => r.id) || [],
        });
        setModalOpen(true);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            patch(route('admin.users.update', editingUser.id), {
                onSuccess: () => setModalOpen(false),
            });
        } else {
            post(route('admin.users.store'), {
                onSuccess: () => setModalOpen(false),
            });
        }
    };

    const toggleRoleCheckbox = (roleId: number) => {
        if (data.role_ids.includes(roleId)) {
            if (data.role_ids.length > 1) {
                setData('role_ids', data.role_ids.filter((id) => id !== roleId));
            }
        } else {
            setData('role_ids', [...data.role_ids, roleId]);
        }
    };

    const handleToggleStatus = (user: User) => {
        router.patch(route('admin.users.toggle', user.id), {}, { preserveState: true });
    };

    const roleBadgeColors: Record<RoleName, string> = {
        super_admin: 'bg-[#65005E]/30 text-fuchsia-300 border-[#65005E]/60',
        vendedor: 'bg-[#3C84CE]/25 text-[#30EEE2] border-[#3C84CE]/50',
        desarrollador: 'bg-indigo-500/25 text-indigo-300 border-indigo-500/50',
        disenador: 'bg-pink-500/25 text-pink-300 border-pink-500/50',
        qa_tester: 'bg-amber-500/25 text-amber-300 border-amber-500/50',
        validador: 'bg-teal-500/25 text-teal-300 border-teal-500/50',
    };

    return (
        <AppLayout
            header={
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#30EEE2]/10 border border-[#30EEE2]/20">
                        <Shield className="w-5 h-5 text-[#30EEE2]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-heading font-bold text-white leading-tight">
                            Administración de Usuarios & Roles
                        </h2>
                        <p className="text-xs text-white/50">
                            Control de accesos, permisos y configuración multi-rol para el equipo técnico
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Administración de Usuarios" />

            {/* Barra de Acciones del Cuerpo */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-sm font-heading font-bold text-white">Equipo & Cuentas</h3>
                    <p className="text-xs text-white/50">
                        Asigna múltiples roles técnicos a los miembros de Grupo Xamanen
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreateModal}
                    className="btn-xamanen-primary text-xs shrink-0 shadow-lg"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Usuario
                </button>
            </div>

            {/* KPIs de Usuarios */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="glass-panel p-5">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">
                        Total Usuarios
                    </span>
                    <p className="text-2xl font-heading font-bold text-white">{metrics.total_users}</p>
                    <span className="text-[11px] text-white/40">{metrics.active_users} cuentas activas</span>
                </div>

                <div className="glass-panel p-5">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">
                        Super Admins
                    </span>
                    <p className="text-2xl font-heading font-bold text-fuchsia-300">{metrics.admins_count}</p>
                    <span className="text-[11px] text-white/40">Acceso irrestricto</span>
                </div>

                <div className="glass-panel p-5">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">
                        Equipo Comercial
                    </span>
                    <p className="text-2xl font-heading font-bold text-[#30EEE2]">{metrics.sales_count}</p>
                    <span className="text-[11px] text-white/40">Cotizadores CPQ & CRM</span>
                </div>

                <div className="glass-panel p-5">
                    <span className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1">
                        Equipo Técnico / Dev
                    </span>
                    <p className="text-2xl font-heading font-bold text-indigo-300">{metrics.devs_count}</p>
                    <span className="text-[11px] text-white/40">Devs, QA, UI/UX y Validadores</span>
                </div>
            </div>

            {/* Barra de Búsqueda y Filtros */}
            <div className="glass-panel p-4 mb-6">
                <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-8 relative">
                        <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por nombre, correo electrónico o teléfono..."
                            className="w-full input-xamanen text-xs pl-9"
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <select
                            value={roleFilter}
                            onChange={(e) => {
                                setRoleFilter(e.target.value);
                                router.get(
                                    route('admin.users.index'),
                                    { search, role: e.target.value },
                                    { preserveState: true }
                                );
                            }}
                            className="w-full input-xamanen text-xs bg-[#101522]"
                        >
                            <option value="">Todos los Roles</option>
                            {roles.map((r) => (
                                <option key={r.id} value={r.name}>
                                    {r.display_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="sm:col-span-1">
                        <button
                            type="submit"
                            className="w-full btn-xamanen-secondary text-xs p-2.5 flex items-center justify-center"
                            title="Filtrar"
                        >
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </div>

            {/* Tabla de Usuarios y Roles */}
            <div className="glass-panel overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-white/[0.03] text-white/60 uppercase text-[10px] tracking-wider border-b border-white/10">
                            <tr>
                                <th className="p-4">Usuario</th>
                                <th className="p-4">Contacto</th>
                                <th className="p-4">Roles Asignados (Multi-Rol)</th>
                                <th className="p-4 text-center">Estado</th>
                                <th className="p-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.data.map((u) => (
                                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#3C84CE] to-[#65005E] flex items-center justify-center text-white font-bold text-xs shrink-0 border border-white/20">
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-heading font-bold text-white text-sm">
                                                    {u.name}
                                                </div>
                                                <div className="text-[11px] text-white/50">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="p-4 text-white/70">
                                        {u.phone ? (
                                            <span className="flex items-center gap-1.5">
                                                <Phone className="w-3 h-3 text-white/40" />
                                                {u.phone}
                                            </span>
                                        ) : (
                                            <span className="text-white/30 italic">Sin teléfono</span>
                                        )}
                                    </td>

                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-1.5">
                                            {u.roles && u.roles.length > 0 ? (
                                                u.roles.map((r) => (
                                                    <span
                                                        key={r.id}
                                                        className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${
                                                            roleBadgeColors[r.name] || 'bg-white/10 text-white'
                                                        }`}
                                                    >
                                                        {r.display_name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-white/30 text-xs italic">Sin roles</span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="p-4 text-center">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleStatus(u)}
                                            className={`text-[10px] px-2.5 py-1 rounded-full font-bold border transition-colors ${
                                                u.is_active
                                                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                                                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                                            }`}
                                            title="Clic para cambiar estado"
                                        >
                                            {u.is_active ? 'Activo' : 'Inactivo'}
                                        </button>
                                    </td>

                                    <td className="p-4 text-right">
                                        <button
                                            type="button"
                                            onClick={() => openEditModal(u)}
                                            className="btn-xamanen-secondary text-[11px] px-2.5 py-1.5"
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                            Editar Roles
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ==================== MODAL DE CREACIÓN / EDICIÓN ==================== */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="glass-panel p-6 max-w-lg w-full border-white/20 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <h3 className="text-base font-heading font-bold text-white">
                                {editingUser ? `Editar Usuario: ${editingUser.name}` : 'Registrar Nuevo Usuario'}
                            </h3>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-white/40 hover:text-white text-xs"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                    Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Ej. Ing. Agustín Fernández"
                                    className="w-full input-xamanen text-xs"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                        Correo Electrónico
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="usuario@grupoxamanen.com.ar"
                                        className="w-full input-xamanen text-xs"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                        Teléfono / Celular
                                    </label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="+54 9 264 555-1234"
                                        className="w-full input-xamanen text-xs"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5">
                                    Contraseña {editingUser && <span className="text-white/40 lowercase">(dejar en blanco para no modificar)</span>}
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder={editingUser ? '••••••••' : 'Mínimo 8 caracteres'}
                                    className="w-full input-xamanen text-xs"
                                    required={!editingUser}
                                />
                            </div>

                            {/* Selección Multi-Rol */}
                            <div>
                                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                                    Roles Asignados (Selección Multi-Rol)
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {roles.map((r) => {
                                        const isChecked = data.role_ids.includes(r.id);

                                        return (
                                            <label
                                                key={r.id}
                                                className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                                                    isChecked
                                                        ? 'bg-[#30EEE2]/10 border-[#30EEE2]/40 text-white'
                                                        : 'bg-white/[0.02] border-white/10 text-white/70 hover:bg-white/5'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => toggleRoleCheckbox(r.id)}
                                                    className="mt-0.5 rounded border-white/20 text-[#30EEE2] focus:ring-[#30EEE2]"
                                                />
                                                <div className="text-xs">
                                                    <span className="font-bold block text-white">{r.display_name}</span>
                                                    <span className="text-[10px] text-white/50 leading-tight block mt-0.5">
                                                        {r.description}
                                                    </span>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                                <label className="flex items-center gap-2 cursor-pointer text-xs">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="rounded border-white/20 text-[#30EEE2] focus:ring-[#30EEE2]"
                                    />
                                    <span className="text-white/80">Cuenta Activa (Habilitada para iniciar sesión)</span>
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="btn-xamanen-secondary text-xs"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="btn-xamanen-primary text-xs"
                                >
                                    {editingUser ? 'Guardar Cambios' : 'Registrar Usuario'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
