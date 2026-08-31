---
description: Actúa como un **Tech Lead & Arquitecto de Software Senior Full-Stack** especializado en el ecosistema Laravel y TypeScript.
---

Actúa como un **Tech Lead & Arquitecto de Software Senior Full-Stack** especializado en el ecosistema Laravel y TypeScript.

### Contexto del Proyecto
Necesito diseñar e implementar un sistema monolítico a medida que integra **CRM + CPQ (Cotizador interactivo) + Gestión operativa de tickets/proyectos**. El objetivo principal es cotizar desarrollos de software a medida, estimar tiempos/costos y gestionar el ciclo de vida del proyecto una vez aprobado. 

El sistema tiene foco estratégico en empresas del sector **Minería** y **Medio Ambiente**, pero debe ser 100% adaptable a cualquier otra industria (Comercio, Servicios, etc.).

---

### Stack Tecnológico
* **Backend:** Laravel 11+ (PHP 8.3+)
* **Frontend:** Inertia.js con React (o Vue 3) + TypeScript + Tailwind CSS
* **Base de Datos:** SQLite (diseñada con migraciones e índices optimizados para máxima agilidad en desarrollo)
* **Control de Acceso:** Esquema multi-rol flexible (Policies o Spatie Laravel-Permission)

---

### Perfiles y Roles de Usuario
1. `super_admin`: Visión global, métricas, administración de usuarios y configuración base.
2. `vendedor`: Alta y seguimiento de clientes, generación de presupuestos y gestión comercial.
3. `cliente`: Portal para revisar, aceptar o rechazar cotizaciones, consultar estado de avance y descargar entregables.
4. `equipo_tecnico`: Capacidad multi-rol flexible (`desarrollador`, `diseñador`, `testing`, `usuario_validador`) para permitir que un mismo usuario asuma múltiples responsabilidades técnicas.

---

### Reglas de Negocio y Módulos Clave

1. **Gestión de Clientes (Mini-CRM):**
   * Registro de clientes con segmentación por rubro/industria (`mineria`, `medio_ambiente`, `comercio`, `servicios`, `otro`).
   * Historial de presupuestos y estado de cada negociación por cliente.

2. **Motor de Cotización (CPQ) - Enfoque MVP:**
   * **Catálogo inicial precargado (Seeders/Config):** Para maximizar la velocidad de desarrollo en este MVP, el catálogo de tipos de software (Web, App Móvil, SaaS, Landing, etc.) y módulos/features se inicializará mediante **Seeders / archivos de configuración** (el CRUD administrativo para editar precios desde la UI se dejará para una fase posterior).
   * **Plantillas / Presets por Industria:** Opciones rápidas para preseleccionar módulos según el rubro:
     * *Plantilla Minería / Ambiente:* Monitoreo/sensores, reportes ambientales, control de faena/seguridad, mapas/GIS, modo offline.
     * *Plantilla Comercio / E-commerce:* Catálogo, carrito, pasarela de pago, stock, facturación.
     * *Personalizado:* Selección modular desde cero.
   * **Matriz de Esfuerzo (Alineada al desarrollo con IA):** Desglose de horas estimadas con menor carga en codificación base y mayor peso en **integración, testing, validación y QA**, más costos fijos de infraestructura (dominio, hosting, licencias).
   * **Cálculo de Tiempos:** Estimación automática de fecha de entrega en **días hábiles** (excluyendo sábados y domingos según la capacidad diaria del equipo).

3. **Ciclo de Vida y Gestión Operativa (Tickets / Proyectos):**
   * **Fase Comercial:** `Borrador` ➔ `Enviado / En Espera` ➔ `Aceptado` / `Rechazado`.
   * **Fase Operativa:** Al aceptarse la cotización, se genera automáticamente el proyecto/ticket (`Por iniciar`, `En desarrollo`, `En testing / validación`, `Entregado`).
   * Asignación individual o conjunta a desarrolladores, notas internas, comentarios y subida de archivos adjuntos.

4. **Calendario y Disponibilidad:**
   * Vista de calendario con días sombreados según la carga de trabajo comprometida del equipo (lunes a viernes).

---

### Metodología de Trabajo por Sprints

Para trabajar de forma iterativa y ordenada, divide la entrega en fases. En este primer mensaje genera **únicamente el Sprint 1**:

* **Sprint 1 (Fase Actual):**
  1. Arquitectura general y Diagrama Entidad-Relación (ERD) / Esquema de base de datos en SQLite (tablas: `users`, `roles`, `clients`, `software_types`, `features`, `quotes`, `quote_items`, `projects/tickets`, `ticket_assignments`, `attachments`, `comments`).
  2. Migraciones completas de Laravel 11+ con índices y relaciones clave.
  3. Seeders con el catálogo inicial de tipos de software, módulos y plantillas (incluyendo Minería, Medio Ambiente y Comercio).
  4. Tipos/interfaces globales de TypeScript (`types/models.d.ts`).
  5. Estructura de carpetas recomendada para el monolito Laravel + Inertia TS.

Comienza entregando exclusivamente el contenido del **Sprint 1** con código limpio, tipado estricto y explicaciones precisas.