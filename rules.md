# Reglas de Diseño y Sistema Visual — Presupuestador Grupo Xamanen

Este documento define las directrices y especificaciones de diseño basadas en la identidad visual oficial de **Grupo Xamanen** (concepto *"Aurora Glass"*), adaptadas específicamente para la plataforma de **Presupuestación de Software a Medida**.

---

## 1. Filosofía y Enfoque de Diseño

- **Concepto:** *Aurora Glass* — Futurista, tecnológico, confiable, moderno y de alta gama.
- **Propósito de la Plataforma:** Herramienta interactiva de cotización y estimación de software a medida.
- **Ergonomía Visual (Regla Crítica):** 
  - **Fondo estático:** Para evitar fatiga visual durante sesiones prolongadas de presupuestación, **no se deben utilizar animaciones de gradientes continuas ni fondos con movimientos bruscos o parpadeos**.
  - Se utiliza una base oscura sólida/profunda (*Dark Void*) con sutiles acentos lumínicos estáticos (glows/degradados fijos muy tenues) que preservan el estilo Aurora sin distraer ni forzar la vista.
  - Altos niveles de legibilidad y contraste en números, métricas y campos de entrada.

---

## 2. Paleta de Colores

```css
:root {
  /* Colores Principales "Aurora" */
  --xamanen-purple: #65005E;       /* Púrpura profundo de acento de marca */
  --xamanen-blue: #3C84CE;         /* Azul tecnológico corporativo */
  --xamanen-cyan: #30EEE2;         /* Cian / Neón brillante (Acento primario, focus, activos) */
  --xamanen-red: #FF1919;          /* Rojo Pop (Alertas, advertencias, costos fijos) */

  /* Fondos y Estructura (Dark Mode Estático y Cómodo) */
  --bg-dark-void: #0A0C10;         /* Fondo base general de la aplicación */
  --bg-surface: #101522;           /* Fondo de contenedores secundarios */
  --bg-surface-elevated: #161D2E;  /* Fondo de dropdowns, modales flotantes */

  /* Tipografía y Textos */
  --text-primary: #F0F2F5;         /* Texto principal de alto contraste */
  --text-muted: rgba(240, 242, 245, 0.70); /* Texto secundario / etiquetas */
  --text-dimmed: rgba(240, 242, 245, 0.45); /* Placeholders / hints */

  /* Estilos Glassmorphism */
  --glass-bg: rgba(16, 21, 34, 0.75);
  --glass-bg-hover: rgba(22, 29, 46, 0.85);
  --glass-border: 1px solid rgba(255, 255, 255, 0.08);
  --glass-border-accent: 1px solid rgba(48, 238, 226, 0.35);
  --glass-blur: 12px;

  /* Estados Funcionales */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-danger: #EF4444;
  --color-info: #3C84CE;
}
```

---

## 3. Tipografía

| Uso | Fuente | Pesos sugeridos | Características |
|---|---|---|---|
| **Títulos y Encabezados (H1 - H6)** | `Poppins`, sans-serif | 600 (Semi-Bold), 700 (Bold) | Letras geométricas modernas, espaciado `letter-spacing: 0.5px` |
| **Cuerpo, Inputs, Datos y UI** | `Inter`, sans-serif | 400 (Regular), 500 (Medium), 600 (Semi-Bold) | Máxima legibilidad, optimizada para interfaces y números |
| **Moneda y Valores Numéricos** | `Inter` (tabular-nums) | 600 (Semi-Bold), 700 (Bold) | `font-feature-settings: "tnum"` para alineación exacta de columnas de precios |

---

## 4. Componentes y Patrones UI

### 4.1. Paneles de Cristal (Glass Panels)
- **Superficie:** Fondo translúcido `rgba(16, 21, 34, 0.75)` con `backdrop-filter: blur(12px)`.
- **Borde:** `1px solid rgba(255, 255, 255, 0.08)`.
- **Radio de esquinas:** `border-radius: 12px` a `16px`.
- **Sombra:** `box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.40)`.

### 4.2. Tarjetas Seleccionables de Alcance / Módulos de Software
- **Estado por defecto:** Panel de cristal oscuro, borde sutil.
- **Estado Hover:** Elevación sutil `transform: translateY(-2px)`, borde levemente iluminado en azul/cian.
- **Estado Seleccionado (Checked):** Borde cian `rgba(48, 238, 226, 0.8)`, fondo con brillo tenue `rgba(48, 238, 226, 0.08)`, e indicador/checkbox activo en cian `#30EEE2`.

### 4.3. Campos de Formulario e Inputs
- **Fondo:** `rgba(255, 255, 255, 0.04)`.
- **Borde:** `1px solid rgba(255, 255, 255, 0.12)`.
- **Focus:** Borde `#30EEE2` con sombra de resplandor suave `box-shadow: 0 0 0 3px rgba(48, 238, 226, 0.20)`.
- **Color de texto:** `#F0F2F5`.

### 4.4. Botones y Llamados a la Acción (CTA)
- **Botón Primario (Calcular / Generar Presupuesto / Enviar):**
  - Fondo: Gradiente lineal `linear-gradient(135deg, #30EEE2 0%, #3C84CE 100%)`.
  - Texto: `#0A0C10` (Oscuro, peso 700) para asegurar máximo contraste y legibilidad.
  - Hover: Resplandor sutil `box-shadow: 0 0 20px rgba(48, 238, 226, 0.4)`.
- **Botón Secundario / Reset:**
  - Fondo: `transparent`.
  - Borde: `1px solid rgba(255, 255, 255, 0.2)`.
  - Texto: `#F0F2F5`.
  - Hover: Fondo `rgba(255, 255, 255, 0.08)`.

### 4.5. Bloque Resumen de Cotización (Pricing Summary)
- Panel destacado fijo o sticky en escritorio.
- Desglose estructurado por categorías:
  - *Módulos Base / Arquitectura*
  - *Integraciones / Servicios Adicionales*
  - *Plazo estimado de entrega (Sprints / Semanas)*
  - *Rango de Inversión / Total Estimado* (en tamaño H2 o H3 con color `#30EEE2` o `#FFFFFF`).
- Descargo de responsabilidad o cláusula de validez del presupuesto con tipografía `text-dimmed`.

---

## 5. Criterios de Usabilidad y Rendimiento
1. **Contraste WCAG:** Todo texto debe superar un ratio de contraste mínimo de 4.5:1 contra los fondos oscuros.
2. **Cero Distracciones de Movimiento:** No emplear partículas flotantes invasivas, ni animaciones cíclicas infinitas en el fondo para favorecer la concentración en la selección de requerimientos técnicos.
3. **Diseño Adaptativo (Responsive):** Total compatibilidad con dispositivos móviles, tablets y monitores de escritorio panorámicos.
