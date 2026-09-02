# PROMPT MAESTRO — PLATAFORMA PILOTO: GESTIÓN DE SERVICIOS & CONSULTORÍA

---
description: Prompt maestro para generar la plataforma piloto de Servicios Profesionales, Helpdesk SLA, Time Tracking y Abonos Recurrentes con sistema Aurora Glass.
---

Actúa como un **Tech Lead & Arquitecto de Software Senior Full-Stack** especializado en el ecosistema **Laravel 11+ (PHP 8.4), Inertia.js v2, React 18+, TypeScript y Tailwind CSS**.

Tu misión es diseñar e implementar la **Plataforma Piloto "Gestión de Servicios & Consultoría"**, una solución vertical pensada para agencias digitales, consultoras contables/legales, empresas de soporte IT, mantenimiento técnico y prestadores de servicios profesionales que cobran por horas o mediante abonos mensuales.

---

## 1. STACK TECNOLÓGICO Y ARQUITECTURA
- **Backend:** Laravel 11+ con PHP 8.4 (recurrent cronjobs, políticas de autorización de clientes, API resources).
- **Frontend:** Inertia.js v2 con React + TypeScript estricto.
- **Estilos:** Tailwind CSS con estética Aurora Glass ejecutiva.
- **Base de Datos:** SQLite / MySQL 8+ / PostgreSQL.
- **Portal Público de Clientes:** Área restringida con login donde cada cliente puede abrir tickets, ver horas consumidas y descargar facturas o actas de conformidad.

---

## 2. SISTEMA DE DISEÑO VISUAL & BRANDING: AURORA GLASS EJECUTIVO

Estética limpia, ejecutiva y elegante para transmitir solidez corporativa:

### A. Paleta de Colores (Tokens Xamanen)
```css
--bg-void: #0A0C10;         /* Base oscura elegante */
--surface-card: #101522;    /* Tarjetas de contratos, tickets y horas */
--surface-elevated: #161D2E;/* Modales de imputación de horas */

/* Semáforo de SLA y Prioridades */
--priority-urgent: #FF1919; /* Crítico / SLA menor a 2 horas */
--priority-medium: #F59E0B; /* Media / SLA estándar 24 horas */
--priority-low: #3C84CE;    /* Baja / Planificada */
--status-closed: #10B981;   /* Ticket resuelto y aprobado por cliente */

/* Acentos */
--accent-cyan: #30EEE2;     /* Foco, botones de nuevo ticket y temporizador de horas */
--accent-teal: #14B8A6;     /* Distintivo de contratos recurrentes */
--accent-purple: #65005E;   /* Métricas de rentabilidad */
```

### B. Componentes Clave
- **Temporizador en Vivo (Play/Stop Stopwatch):** Componente flotante en la barra superior para que el profesional inicie y pause el cronómetro de la tarea en un clic.
- **Barra de Consumo de Horas:** Indicador gráfico de progreso (ej. `32/40 hs consumidas este mes - 80%`) con alerta visual en amarillo/rojo al acercarse al límite del abono.

---

## 3. NÚCLEO OBLIGATORIO (CORE ENGINE BASE)
1. **Autenticación Multi-Rol:** `super_admin`, `director_cuentas`, `consultor_senior`, `tecnico`, `cliente_empresa`.
2. **Auditoría Forense ISO:** Registro de cada cambio en estados de tickets y aprobación de horas facturables.
3. **Dashboard Ejecutivo:** Rentabilidad por contrato, horas totales trabajadas en el mes, cumplimiento de SLAs en porcentaje.
4. **Notificaciones Multicanal:** Aviso al cliente cuando su ticket cambia a "En Revisión" o "Resuelto".
5. **Infraestructura Cloud:** Dockerfile con HTTPS y programación de tareas cron para cortes de facturación.

---

## 4. MÓDULOS ESPECÍFICOS DEL VERTICAL SERVICIOS (238 HORAS DE CATÁLOGO)

### Módulo 1: Portal de Clientes y Tickets SLA (ID 23)
- Mesa de ayuda (Helpdesk) con tickets categorizados por servicio.
- Contador regresivo de vencimiento de SLA según prioridad (Urgente 4h, Normal 24h, Baja 72h).
- Hilo de conversación interno (notas entre técnicos no visibles para el cliente) y mensajes públicos con adjuntos.

### Módulo 2: Time Tracking y Horas Facturables (ID 24)
- Registro de horas imputadas a clientes, contratos o proyectos específicos.
- Selector de tipo de hora: *Facturable contra abono*, *Hora extra facturable*, *Hora de cortesía / No facturable*.
- Exportación en un clic a planilla Excel y PDF con resumen mensual para adjuntar a la factura.

### Módulo 3: Gestión de Contratos y Abonos Recurrentes (ID 25 — Zona Amarilla)
- Ficha de contrato con monto mensual fijo, cupo de horas incluidas y valor de la hora excedente.
- Renovaciones automáticas con alertas 30 días antes del vencimiento.
- Generación automática de la orden de cobro mensual en el día de corte configurado.

### Módulo 4: Agenda y Turnos Online (ID 26 — Zona Amarilla)
- Calendario de visitas técnicas o reuniones de consultoría con asignación de profesional.
- Generación y descarga automática de archivos `.ics` compatibles con Google Calendar, Outlook y Apple Calendar.
- *Regla de alcance:* No realizar sincronizaciones bidireccionales complejas con APIs de Google/Microsoft; usar exportación `.ics` limpia y robusta.

### Módulo 5: Firma Digital de Actas de Servicio (ID 27)
- Hoja de cierre de servicio con firma digital del cliente en pantalla táctil o ratón.
- Generación instantánea del comprobante de conformidad en PDF membretado con hash criptográfico y fecha/hora.

---

## 5. SEEDER DE DEMOSTRACIÓN (DEMO DATA SERVICIOS)
Crea un seeder `ServicesDemoSeeder.php`:
- **Empresa Demo:** "Nexus Tech Consulting & IT Solutions".
- **Clientes:** 4 empresas clientes con abonos activos (un sanatorio privado, un estudio contable, una cadena de farmacias y una importadora).
- **Contratos:** 3 contratos con abonos de 20hs, 40hs y 80hs mensuales (uno de ellos en 90% de consumo para mostrar la alerta visual).
- **Tickets:** 10 tickets con diferentes prioridades y estados SLA.
- **Registros de Horas:** 25 entradas de horas con descripciones profesionales realistas.

---

## 6. REGLAS DE ORO DEL ALCANCE
- ❌ **NO conectar Chatbots de WhatsApp Cloud API oficiales de Meta** (Zona Roja ID 14 por burocracia de homologación y cobros variables por mensaje). Colocar en el portal un botón directo de WhatsApp con el número del ticket de soporte.
- ❌ **NO integrar sincronización bidireccional continua con Google Calendar** (Zona Amarilla simplificada). Las citas se gestionan en la plataforma y se añaden vía archivo `.ics`.
