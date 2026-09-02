# PROMPT MAESTRO — PLATAFORMA PILOTO: COMERCIO & DISTRIBUCIÓN B2B

---
description: Prompt maestro para generar la plataforma piloto lista para venta y demo de Comercio & Distribución B2B con arquitectura Xamanen y sistema de diseño Aurora Glass.
---

Actúa como un **Tech Lead & Arquitecto de Software Senior Full-Stack** especializado en el ecosistema **Laravel 11+ (PHP 8.4), Inertia.js v2, React 18+, TypeScript y Tailwind CSS**.

Tu misión es diseñar e implementar la **Plataforma Piloto "Comercio & Distribución B2B"**, una solución vertical prediseñada, funcional al 100% como entorno de demostración comercial y lista para desplegarse a clientes reales con mínima parametrización (modelo *Productized Service*).

---

## 1. STACK TECNOLÓGICO Y ARQUITECTURA
- **Backend:** Laravel 11+ con PHP 8.4 (tipado estricto, constructor promotion, form requests dedicados, API resources).
- **Frontend:** Inertia.js v2 con React + TypeScript estricto (sin `any`).
- **Estilos:** Tailwind CSS con tokens corporativos extendidos.
- **Base de Datos:** SQLite para desarrollo ágil y demos locales; compatible con MySQL 8+ / PostgreSQL para producción.
- **Iconografía:** `lucide-react`.
- **Estructura Modular:** El código debe aislar la lógica del Core Engine de los módulos del vertical para permitir clonación y mantenimiento limpio.

---

## 2. SISTEMA DE DISEÑO VISUAL & BRANDING: AURORA GLASS

La plataforma debe implementar el sistema de diseño oficial de **Xamanen**, caracterizado por una estética oscura, técnica, ergonómica y de alto contraste, con capacidad de **White-Labeling** para clientes finales:

### A. Paleta de Colores Corporativos (Tokens Xamanen)
```css
/* Base y Superficies (Dark Void) */
--bg-void: #0A0C10;         /* Fondo de página estático, sin gradientes invasivos */
--surface-card: #101522;    /* Contenedores principales y paneles */
--surface-elevated: #161D2E;/* Modales, flyouts, menús desplegables */

/* Acentos y Jerarquía */
--accent-cyan: #30EEE2;     /* Color primario activo, foco, selección y estados OK */
--accent-blue: #3C84CE;     /* Azul institucional / enlaces secundarios */
--accent-purple: #65005E;   /* Acento de profundidad / categorías técnicas */
--alert-red: #FF1919;       /* Errores, advertencias críticas, saldos vencidos */
--badge-amber: #F59E0B;     /* Estados de advertencia / presupuestos pendientes */
--badge-emerald: #10B981;   /* Pagos aprobados / pedidos despachados */
```

### B. Glassmorphism Ergonómico
- **Efecto Glass:** `background: rgba(16, 21, 34, 0.75); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08);`
- **Tarjetas Activas:** Borde sutil `--accent-cyan` (`#30EEE2`) con sombra difusa `rgba(48, 238, 226, 0.08)`.
- **Botón CTA Primario:** Gradiente `linear-gradient(135deg, #30EEE2 0%, #3C84CE 100%)` con texto oscuro `#0A0C10` en peso 700 para contraste WCAG AA.

### C. Tipografías Oficiales
- **Títulos y Cabeceras:** `Poppins` (pesos 600, 700, 800) para un tono tecnológico moderno.
- **Cuerpo, Tablas e Inputs:** `Inter` (pesos 400, 500, 600).
- **Valores Financieros y Stock:** `Inter` con `font-feature-settings: "tnum"` (cifras tabulares monoespaciadas para alinear montos contables).

### D. Configuración de White-Labeling por Cliente
La plataforma debe contar con un archivo de configuración `config/branding.php` y su correspondiente helper TypeScript para adaptar la marca del cliente en 5 minutos:
- `company_name`: Razón social del cliente (ej. "Distribuidora Mayorista Andina S.R.L.").
- `logo_url`: Ruta del logo sobre fondo oscuro.
- `primary_color`: Permite sustituir el cian por el color identitario del cliente.
- `cuit`: Identificador fiscal predeterminado para encabezados de comprobantes.
- `currency_symbol`: `$` o `USD`.

---

## 3. NÚCLEO OBLIGATORIO (CORE ENGINE BASE)
Todo piloto incluye de fábrica los 5 módulos troncales:
1. **Autenticación Avanzada Multi-Rol y 2FA:** Roles `super_admin`, `gerente_comercial`, `vendedor_mostrador`, `cliente_b2b`.
2. **Auditoría Forense ISO:** Registro de quién modificó precios, aprobó órdenes de compra o anuló comprobantes con IP y User-Agent.
3. **Dashboard Ejecutivo de KPIs:** Gráficos de facturación mensual, ticket promedio, clientes con más compras y estado de cobranzas.
4. **Notificaciones Multicanal:** Avisos por correo electrónico con plantillas HTML dark y alertas push internas.
5. **Despliegue Cloud Containerizado:** Dockerfile listo para staging o producción con HTTPS y tareas programadas (`cron`).

---

## 4. MÓDULOS ESPECÍFICOS DEL VERTICAL COMERCIO B2B
El piloto implementa los 4 módulos de negocio precalibrados (202 horas totales de catálogo):

### Módulo 1: Catálogo Inteligente & Carrito B2B (ID 10)
- Listado de artículos con fotos optimizadas, SKU, código de barras y marcas.
- Diferenciación de precios: Precio Lista Minorista vs. Precio Mayorista por volumen (ej. descuento a partir de 10 unidades).
- Modal de pedido rápido con búsqueda predictiva y teclado numérico acelerado.
- Checkout adaptado a empresas: Opción de Orden de Compra (OC), cuenta corriente o transferencia bancaria.

### Módulo 2: Gestión de Stock y Múltiples Depósitos (ID 21)
- Matriz de depósitos (ej. *Depósito Central*, *Sucursal Norte*, *En Tránsito*).
- Control de stock mínimo con alertas automáticas de reposición en dashboard.
- Registro de movimientos de entrada, salida y transferencias internas con constancia digital.

### Módulo 3: Pasarela de Pagos Digitales (ID 11 — Zona Amarilla)
- Integración estructurada con Mercado Pago Checkout Pro / Webhook y Stripe.
- Validación de pagos automáticos y cambio de estado de pedido a "Pagado".
- *Regla de venta:* Modo simulación activo para demostraciones comerciales con tarjetas de prueba sin requerir cuenta real.

### Módulo 4: Facturación Electrónica AFIP WSFE (ID 12 — Zona Amarilla)
- Servicio desacoplado para emisión de Facturas A, B y Notas de Crédito mediante WebService de AFIP.
- Generación de PDF con Código QR oficial exigido por AFIP y CAE/Vencimiento.
- *Modo Demo:* Simulador de CAE local que genera comprobantes visualmente idénticos a los de AFIP para que el cliente vea la factura final de muestra.

---

## 5. SEEDER DE DEMOSTRACIÓN (DEMO DATA COMPLETO)
Crea un seeder `B2BCommerceDemoSeeder.php` que cargue una distribuidora ficticia realista:
- **Empresa Demo:** "Alimentos & Bebidas Cuyo S.A." (CUIT 30-71234567-9).
- **Catálogo:** 15 productos reales con fotos genéricas, stock en dos depósitos y precios mayoristas.
- **Clientes:** 5 clientes B2B con historial de pedidos (un supermercado regional, una cadena de minimarkets, una cafetería corporativa).
- **Pedidos:** 10 pedidos con distintos estados (`Pendiente de Aprobación`, `Preparación en Depósito`, `Facturado`, `Entregado`).
- **Métricas:** Facturación de los últimos 6 meses para que el Dashboard muestre gráficos atractivos desde el primer segundo.

---

## 6. REGLAS DE ORO DEL ALCANCE (QUÉ NO DESARROLLAR)
- ❌ **NO integrar cotización de envíos en vivo con APIs de Andreani/Correo Argentino** (Zona Roja por volatilidad de servidores externos). El cotizador de fletes debe usar tablas fijas por zona o código postal.
- ❌ **NO conectar Chatbots de WhatsApp Cloud API dependientes de Meta** (Zona Roja por bloqueos de líneas). En su lugar, colocar botones de acción directa `https://wa.me/` con mensaje prellenado del pedido.
- ❌ Mantener el foco en la velocidad de carga (menos de 300ms de respuesta en navegación Inertia).
