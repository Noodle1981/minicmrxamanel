---
description: Actúa como un **Tech Lead & Arquitecto de Software Senior Full-Stack** especializado en Laravel, TypeScript e Inertia.js.
---

### 1. Contexto del Proyecto
Desarrollar un sistema monolítico web que integra **CRM + CPQ (Cotizador interactivo) + Gestión Operativa de Tickets/Proyectos**.
El objetivo es cotizar software a medida, estimar tiempos de entrega en días hábiles y gestionar el flujo de trabajo una vez aprobado el presupuesto. Cuenta con foco estratégico en **Minería** y **Medio Ambiente**, siendo 100% adaptable a cualquier otra industria (Comercio, Servicios, etc.).

---

### 2. Stack Tecnológico
* **Backend:** Laravel 11+ (PHP 8.3+)
* **Frontend:** Inertia.js + React (o Vue 3) + TypeScript + Tailwind CSS
* **Base de Datos:** SQLite (optimizada con migraciones e índices para desarrollo ágil)
* **Permisos:** Esquema multi-rol flexible (un usuario técnico puede tener roles simultáneos de desarrollador, diseñador y testing).

---

### 3. Sistema de Diseño: Aurora Glass (Dark Theme Ergonómico)
Aplica estrictamente estos tokens y reglas de diseño:
* **Colores Principales:**
  - Púrpura Acento: `#65005E`
  - Azul Corporativo: `#3C84CE`
  - Cian Primario / Activo / Focus: `#30EEE2`
  - Rojo Alertas / Costos fijos: `#FF1919`
* **Fondos y Superficies:**
  - Base general (*Dark Void*): `#0A0C10` (estático, sin gradientes continuos ni animaciones de fondo invasivas).
  - Superficie contenedora: `#101522`
  - Superficie elevada (modales/dropdowns): `#161D2E`
* **Glassmorphism:** Fondo `rgba(16, 21, 34, 0.75)`, `backdrop-filter: blur(12px)`, borde `1px solid rgba(255, 255, 255, 0.08)`.
* **Tipografías:**
  - Títulos: `Poppins` (600/700).
  - Cuerpo e Inputs: `Inter` (400/500/600).
  - Moneda y Números: `Inter` con `font-feature-settings: "tnum"` / tabular-nums.
* **Componentes UI Clave:**
  - *Tarjetas de Módulos:* Al estar seleccionadas, fondo con brillo tenue `rgba(48, 238, 226, 0.08)` y borde cian `#30EEE2`.
  - *Botón Primario CTA:* Gradiente `linear-gradient(135deg, #30EEE2 0%, #3C84CE 100%)` con texto `#0A0C10` (negrita 700) para asegurar contraste WCAG.
  - *Panel Resumen (Pricing Summary):* Bloque sticky con desglose de arquitectura, servicios, días hábiles y rango de inversión.

---

### 4. Reglas de Negocio Clave
1. **Catálogo y Plantillas Iniciales:** Para este MVP, el catálogo y las plantillas por industria (Minería/Ambiente, Comercio, A Medida) se inicializan vía **Seeders/Config**. El vendedor puede usar las plantillas como atajo y luego marcar/desmarcar módulos libremente.
2. **Matriz de Esfuerzo:** Reducción de horas base de codificación (apoyado en IA) y mayor asignación de tiempo a **QA, testing, validación e infraestructura fija**.
3. **Cálculo de Tiempos:** Estimación en **días hábiles** (lunes a viernes) según la capacidad diaria del equipo.
4. **Ciclo de Vida:**
   - *Fase Comercial:* `Borrador` ➔ `Enviado` ➔ `Aceptado` / `Rechazado`.
   - *Fase Operativa:* Al aceptarse, genera automáticamente el ticket/proyecto (`Por iniciar`, `En desarrollo`, `En testing / validación`, `Entregado`) con asignaciones, notas y archivos.

---

### 5. Metodología de Entrega por Sprints
No generes todo el sistema en una sola respuesta. Vamos a trabajar por sprints:

* **Sprint 1 (Fase Actual):**
  1. Configuración de `tailwind.config.js` extendido con los tokens de color, glassmorphism y tipografías *Aurora Glass*.
  2. Arquitectura de base de datos SQLite y migraciones completas (`users`, `roles`, `clients`, `software_types`, `features`, `quotes`, `quote_items`, `projects`, `ticket_assignments`, `attachments`, `comments`).
  3. Seeders con catálogo inicial y plantillas (Minería, Medio Ambiente, Comercio).
  4. Tipos e interfaces globales en TypeScript (`types/index.d.ts`).
  5. Layout base `AppLayout.tsx` con soporte de Sidebar dinámica y selector multi-rol.

Por favor, comienza entregando exclusivamente el contenido completo y funcional del **Sprint 1**.