# PROMPT MAESTRO — PLATAFORMA PILOTO: INDUSTRIA & CONTROL DE PLANTA

---
description: Prompt maestro para generar la plataforma piloto lista para venta y demo de Industria, Producción y Mantenimiento (CMMS) con arquitectura Xamanen y diseño Aurora Glass.
---

Actúa como un **Tech Lead & Arquitecto de Software Senior Full-Stack** especializado en el ecosistema **Laravel 11+ (PHP 8.4), Inertia.js v2, React 18+, TypeScript y Tailwind CSS**.

Tu misión es diseñar e implementar la **Plataforma Piloto "Industria & Control de Planta"**, una solución vertical prediseñada para fábricas, talleres metalmecánicos, plantas químicas y manufactura Pyme, lista para demostración comercial en vivo y despliegue rápido.

---

## 1. STACK TECNOLÓGICO Y ARQUITECTURA
- **Backend:** Laravel 11+ con PHP 8.4 (tipado estricto, eventos internos, jobs en cola para reportes pesados, API resources).
- **Frontend:** Inertia.js v2 con React + TypeScript estricto.
- **Estilos:** Tailwind CSS con tokens industriales oscuros de alto contraste.
- **Base de Datos:** SQLite / MySQL 8+ / PostgreSQL.
- **Dispositivos Target:** Diseño responsivo optimizado para **Tablets industriales y pantallas táctiles de operarios en planta**, además de computadoras de escritorio para jefes de planta.

---

## 2. SISTEMA DE DISEÑO VISUAL & BRANDING: AURORA GLASS INDUSTRIAL

La interfaz implementa el sistema **Aurora Glass** de Xamanen adaptado a entornos industriales con iluminación variable:

### A. Paleta de Colores (Tokens Xamanen)
```css
/* Base de Contraste Profundo */
--bg-void: #0A0C10;         /* Base general ergonómica, no cansa la vista en turnos largos */
--surface-card: #101522;    /* Tarjetas de máquinas, paneles de órdenes */
--surface-elevated: #161D2E;/* Modales de registro rápido de paradas */

/* Semáforo Operativo de Planta */
--status-running: #10B981;  /* Verde: Línea operando con normalidad */
--status-warning: #F59E0B;  /* Amarillo: Mantenimiento preventivo próximo / inspección pendiente */
--status-stopped: #FF1919;  /* Rojo: Parada de línea / falla crítica */

/* Acentos de Marca */
--accent-cyan: #30EEE2;     /* Foco interactivo, botones de acción rápida */
--accent-blue: #3C84CE;     /* Filtros y navegación secundaria */
--accent-purple: #65005E;   /* Acento para control de calidad y metrología */
```

### B. Componentes Táctiles para Operarios de Fábrica
- **Botones de Gran Calibre (Touch-friendly):** Áreas interactivas mínimas de `48px x 48px` para facilitar la carga con dedos o guantes livianos.
- **Lectura de Códigos QR:** Integración con cámara web/móvil usando librería HTML5 QR para escanear órdenes de trabajo y piezas sin periféricos caros.

### C. White-Labeling
Archivo `config/branding.php` con nombre de la planta (ej. "Industrias Metalúrgicas Cuyo S.A."), logo corporativo sobre fondo oscuro y colores del cliente.

---

## 3. NÚCLEO OBLIGATORIO (CORE ENGINE BASE)
1. **Autenticación Multi-Rol:** Roles `super_admin`, `jefe_planta`, `supervisor_turno`, `operario_linea`, `tecnico_mantenimiento`.
2. **Auditoría Forense ISO:** Registro de cada cambio de estado de lote, motivo de parada y firma de liberación de calidad con fecha, hora y usuario.
3. **Dashboard Ejecutivo OEE:** Gráficos de disponibilidad estimada de máquinas, horas de parada del mes y porcentaje de piezas aprobadas vs. rechazadas.
4. **Notificaciones Automáticas:** Alertas urgentes a supervisores ante paradas de máquina mayores a 15 minutos.
5. **Despliegue Cloud / Local:** Dockerfile optimizado para servidor local en planta o nube privada.

---

## 4. MÓDULOS ESPECÍFICOS DEL VERTICAL INDUSTRIA (268 HORAS DE CATÁLOGO)

### Módulo 1: Control de Producción y Trazabilidad por QR (ID 18 — Zona Amarilla)
- Órdenes de Fabricación (OF) con número de lote, cantidad proyectada y fecha de entrega.
- Estados de avance lineales: `Programada` ➔ `Corte / Mecanizado` ➔ `Tratamiento / Pintura` ➔ `Armado / Embalaje` ➔ `Control Final`.
- Impresión de etiquetas con Código QR único por lote para seguimiento pieza a pieza.

### Módulo 2: Control de Calidad en Línea y Ensayos (ID 20)
- Fichas de inspección técnica: Registro de medidas dimensionales, tolerancia y aspecto visual.
- Aprobación o desvío a Scrap / Retrabajo con justificación obligatoria.

### Módulo 3: CMMS Mantenimiento Preventivo y Correctivo (ID 19)
- Ficha técnica por máquina: Marca, modelo, año, manuales en PDF adjuntos.
- Plan de mantenimiento por horas de uso estimadas o calendario (ej. "Cambio de lubricante cada 500 horas").
- Registro de paradas de máquina en 5 segundos desde tablet: el operario selecciona motivo (`Falla mecánica`, `Falta de material`, `Corte eléctrico`) sin fricción.

### Módulo 4: Gestión de Stock y Depósitos de Materia Prima (ID 21)
- Stock de chapa, perfiles, tornillería y consumibles con punto de pedido mínimo.

### Módulo 5: Gestión de Contratistas y Control de EPP (ID 6)
- Control de vencimiento de ART y certificados de seguridad de técnicos externos antes de ingresar a planta.

### Módulo 6: Firma Digital de Actas en Tablet (ID 27)
- Canvas táctil interactivo para firma digital de remitos de entrega y partes diarios de turno.

---

## 5. SEEDER DE DEMOSTRACIÓN (DEMO DATA INDUSTRIAL)
Crea un seeder `IndustrialPlantDemoSeeder.php`:
- **Fábrica Demo:** "Precisión Andina Mecanizados S.R.L."
- **Maquinarias:** 6 equipos (2 Centros de Mecanizado CNC, 1 Prensa Hidráulica de 200T, 1 Torno Paralelo, 1 Cabina de Pintura Electrostática, 1 Compresor Industrial).
- **Órdenes de Producción:** 8 órdenes vivas en distintos sectores de la planta.
- **Mantenimientos:** 2 preventivos al día, 1 alerta de preventivo vencido y 3 órdenes de trabajo resueltas.
- **Operarios:** 4 usuarios de planta con avatares y turnos asignados.

---

## 6. REGLAS DE ORO DEL ALCANCE (CÓMO DECIR "NO" AL CLIENTE)
- ❌ **NO conectar sensores físicos de telemetría a PLC ni cablear tableros eléctricos** (Zona Roja IDs 22 y 3). Si el cliente lo pide: *"El sistema es de gestión y control operativo. Los operarios cargan métricas desde tablets en 5 segundos. No realizamos conexiones físicas a PLC para no comprometer las garantías de los fabricantes de maquinaria."*
- ❌ **NO sincronización bidireccional compleja Offline-First** (Zona Roja ID 5). La interfaz está optimizada para Wi-Fi de planta y guarda en caché local transitoria para subida automática al recuperar red.
