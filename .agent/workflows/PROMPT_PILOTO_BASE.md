# PROMPT MAESTRO — PLATAFORMA PILOTO BASE (XAMANEN CORE ENGINE)

---
description: Prompt maestro monolítico para generar el repositorio base fundacional (Core Engine, Auth, Layout Aurora Glass, Auditoría ISO, White-labeling y Docker) listo para clonar en cualquier vertical.
---

Actúa como un **Tech Lead & Arquitecto de Software Senior Full-Stack** especializado en el ecosistema **Laravel 11+ (PHP 8.4), Inertia.js v2, React 18+, TypeScript y Tailwind CSS**.

Tu misión es diseñar e implementar la **Plataforma Piloto Base (Core Engine Xamanen)**, un andamio de software corporativo completamente funcional que servirá como cimiento para todos los proyectos verticales y demostraciones comerciales (*Productized Services*).

---

## 1. STACK TECNOLÓGICO Y ARQUITECTURA
- **Backend:** Laravel 11+ con PHP 8.4 (tipado estricto, constructor property promotion, Form Requests dedicados, API Resources, Jobs/Events desacoplados).
- **Frontend:** Inertia.js v2 con React 18+ y TypeScript estricto (cero uso de `any`, tipado completo en `@/types`).
- **Estilos:** Tailwind CSS con tokens corporativos extendidos (Sistema Aurora Glass).
- **Base de Datos:** SQLite para desarrollo local ágil; compatible nativamente con MySQL 8+ y PostgreSQL para producción.
- **Iconografía:** `lucide-react`.
- **Estructura Modular:** Aislamiento del Core Engine (autenticación, auditoría, layout, branding) de cualquier módulo de negocio que se agregue posteriormente.

---

## 2. SISTEMA DE DISEÑO VISUAL & BRANDING: AURORA GLASS

La plataforma debe implementar el sistema de diseño oficial de **Xamanen**, caracterizado por una estética oscura, técnica, ergonómica y de alto contraste:

### A. Paleta de Colores Base (Tokens Xamanen en `tailwind.config.js` y `app.css`)
```css
/* Base y Superficies (Dark Void) */
--bg-void: #0A0C10;         /* Fondo de página estático, sin gradientes invasivos */
--surface-card: #101522;    /* Contenedores principales, paneles y tarjetas */
--surface-elevated: #161D2E;/* Modales, flyouts, menús desplegables */

/* Acentos Corporativos */
--accent-cyan: #30EEE2;     /* Color primario activo, foco, selección y estados OK */
--accent-blue: #3C84CE;     /* Azul institucional / navegación secundaria / filtros */
--accent-purple: #65005E;   /* Acento de profundidad / categorías técnicas */

/* Semáforos de Estado y Alertas */
--alert-red: #FF1919;       /* Errores, alertas críticas, vencimientos */
--badge-amber: #F59E0B;     /* Advertencias, preventivos, pendientes */
--badge-emerald: #10B981;   /* Éxito, operativo normal, pagos aprobados */
```

### B. Glassmorphism Ergonómico
- **Efecto Glass:** `background: rgba(16, 21, 34, 0.75); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08);`
- **Tarjetas Activas/Hover:** Borde sutil `--accent-cyan` (`#30EEE2`) con sombra difusa `rgba(48, 238, 226, 0.08)`.
- **Botón CTA Primario:** Gradiente `linear-gradient(135deg, #30EEE2 0%, #3C84CE 100%)` con texto oscuro `#0A0C10` en peso 700 para contraste WCAG AA.

### C. Tipografías Oficiales
- **Títulos y Cabeceras:** `Poppins` (pesos 600, 700, 800) para un tono tecnológico moderno.
- **Cuerpo, Tablas e Inputs:** `Inter` (pesos 400, 500, 600).
- **Valores Financieros y Códigos:** `Inter` con `font-feature-settings: "tnum"` (cifras tabulares monoespaciadas).

### D. Configuración de White-Labeling (Marca Blanca en 5 Minutos)
Implementar `config/branding.php` y su helper tipado `useBranding()` en React/TypeScript:
- `company_name`: Razón social o fantasía (ej. "Xamanen Platform Core").
- `logo_url`: Ruta del logotipo optimizado sobre fondo oscuro.
- `primary_color`: Color identitario principal reemplazable (`#30EEE2`).
- `tax_id`: Identificador fiscal predeterminado para encabezados y comprobantes.
- `currency_symbol`: Símbolo monetario (`$` o `USD`).

---

## 3. NÚCLEO OBLIGATORIO DE LA PLATAFORMA BASE (5 MÓDULOS TRONCALES)

La plataforma base debe dejar operativos al 100% los siguientes componentes:

### 1. Autenticación Multi-Rol y Seguridad
- Roles de usuario estándar del sistema:
  - `super_admin` (Acceso total al sistema y configuraciones).
  - `admin` (Gestión operativa y reportes).
  - `operador` (Carga y gestión de datos).
  - `cliente` / `usuario_externo` (Portal de solo lectura o autoservicio).
- Políticas de autorización (Laravel Policies) y Middleware de control de roles.
- Vistas de Login, Perfil de Usuario y soporte de autenticación en dos pasos (2FA).

### 2. Auditoría Forense ISO / Trazabilidad
- Modelo, migración y middleware `AuditLog` para registrar automáticamente eventos críticos:
  - Usuario responsable, Acción realizada, Entidad modificada, Datos antes/después (JSON diff), IP del cliente y User-Agent.
- Panel visual de consulta de auditoría con filtros por fecha, usuario y módulo.

### 3. Layout General Aurora Glass & Navegación
- Layout maestro responsivo (`AuthenticatedLayout.tsx`) con:
  - **Sidebar Colapsable:** Menú de navegación con iconos `lucide-react`, agrupamiento por secciones y estado activo en Cyan.
  - **Topbar Superior:** Barra de búsqueda global, selector de perfil/branding, reloj/estado y disparador de notificaciones.
  - **Área de Contenido:** Contenedor ergonómico con fondo Dark Void y animaciones de transición fluidas.

### 4. Dashboard Ejecutivo Base con KPIs y Gráficos
- Vista principal `Dashboard.tsx` con:
  - 4 tarjetas de KPIs principales (Total Actividad, Tasa de Cumplimiento, Alertas Activas, Usuarios Conectados).
  - Gráfico interactivo de tendencia mensual (usando Recharts o Chart.js con paleta Aurora Glass).
  - Tabla de actividad reciente conectada con el módulo de Auditoría Forense.

### 5. Notificaciones y Despliegue Containerizado
- Centro de notificaciones in-app en cabecera con contador de no leídos.
- Plantilla de correo HTML responsive con estética dark corporativa.
- `Dockerfile` y `docker-compose.yml` listos para entorno local y producción con HTTPS.

---

## 4. SEEDER DE DEMOSTRACIÓN BASE (BASE DEMO DATA)
Crea `BasePlatformDemoSeeder.php` con cuentas de prueba listas para ingresar:
- **Super Admin:** `admin@xamanen.com` / `password`
- **Operador Demo:** `operador@xamanen.com` / `password`
- **Cliente Demo:** `cliente@xamanen.com` / `password`
- **Logs de Auditoría:** 15 registros de eventos simulados en los últimos 7 días para poblar la tabla de actividad.

---

## 5. REGLAS DE ORO DEL ALCANCE
- ❌ **Cero dependencias innecesarias:** Mantener el bundle ligero (menos de 300ms de respuesta en navegación Inertia).
- ❌ **Tipado riguroso:** Prohibido el uso de `any` en TypeScript; todos los modelos deben tener su interface correspondiente en `@/types`.
- ❌ **Totalmente desacoplado:** El Core Engine no debe depender de lógica de negocio particular para permitir ser clonado como base de cualquier vertical sin refactorizaciones.
