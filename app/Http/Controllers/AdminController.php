<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    /**
     * Gestión de Usuarios y Roles del Sistema
     */
    public function index(Request $request): Response
    {
        $query = User::with('roles')->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($request->filled('role')) {
            $roleName = $request->role;
            $query->whereHas('roles', function ($rq) use ($roleName) {
                $rq->where('name', $roleName);
            });
        }

        $users = $query->paginate(15)->withQueryString();
        $roles = Role::all();

        $metrics = [
            'total_users' => User::count(),
            'active_users' => User::where('is_active', true)->count(),
            'admins_count' => User::whereHas('roles', fn($q) => $q->where('name', 'super_admin'))->count(),
            'sales_count' => User::whereHas('roles', fn($q) => $q->where('name', 'vendedor'))->count(),
            'devs_count' => User::whereHas('roles', fn($q) => $q->whereIn('name', ['desarrollador', 'disenador', 'qa_tester', 'validador']))->count(),
        ];

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => $request->only(['search', 'role']),
            'metrics' => $metrics,
        ]);
    }

    /**
     * Crear nuevo usuario y asignar roles
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'phone' => 'nullable|string|max:50',
            'password' => 'required|string|min:8',
            'is_active' => 'nullable|boolean',
            'role_ids' => 'required|array|min:1',
            'role_ids.*' => 'exists:roles,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'is_active' => $validated['is_active'] ?? true,
        ]);

        $user->roles()->sync($validated['role_ids']);

        return back()->with('success', "Usuario '{$user->name}' registrado correctamente con sus roles asignados.");
    }

    /**
     * Actualizar usuario y roles
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:50',
            'password' => 'nullable|string|min:8',
            'is_active' => 'nullable|boolean',
            'role_ids' => 'required|array|min:1',
            'role_ids.*' => 'exists:roles,id',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);
        $user->roles()->sync($validated['role_ids']);

        return back()->with('success', "Usuario '{$user->name}' y roles actualizados.");
    }

    /**
     * Alternar estado de activación
     */
    public function toggleStatus(User $user)
    {
        $user->update([
            'is_active' => !$user->is_active,
        ]);

        $statusMsg = $user->is_active ? 'activado' : 'desactivado';
        return back()->with('success', "Usuario '{$user->name}' {$statusMsg}.");
    }
}
