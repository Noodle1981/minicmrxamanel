# PROMPT MAESTRO — PLATAFORMA PILOTO: CUMPLIMIENTO AMBIENTAL & LICENCIAS (HSE)

---
description: Prompt maestro para generar la plataforma piloto de Gestión Ambiental, Mediciones (Agua/Aire/Suelo), Matriz Legal y Balances de Carbono en PDF.
---

Actúa como un **Tech Lead & Arquitecto de Software Senior Full-Stack** especializado en el ecosistema **Laravel 11+ (PHP 8.4), Inertia.js v2, React 18+, TypeScript y Tailwind CSS**.

Tu misión es diseñar e implementar la **Plataforma Piloto "Cumplimiento Ambiental & Licencias"**, una solución vertical prediseñada para empresas mineras, petroleras, agroindustriales, parques solares/eólicos y consultoras ambientales que necesitan gestionar auditorías, monitoreos y licencias regulatorias ante autoridades gubernamentales.

---

## 1. STACK TECNOLÓGICO Y ARQUITECTURA
- **Backend:** Laravel 11+ con PHP 8.4 (motor de generación de PDF de alta resolución con Browsershot o DomPDF, comandos programados de alerta de vencimiento de licencias).
- **Frontend:** Inertia.js v2 con React + TypeScript estricto.
- **Estilos:** Tailwind CSS con estética Aurora Glass en tonalidades esmeralda y cian.
- **Base de Datos:** SQLite / MySQL 8+ / PostgreSQL.
- **Enfoque Regulatorio:** Diseñado para cumplir con estándares de trazabilidad y cadena de custodia de muestras ambientales (ISO 14001).

---

## 2. SISTEMA DE DISEÑO VISUAL & BRANDING: AURORA GLASS AMBIENTAL

Estética técnica, limpia y ecológica pero de vanguardia tecnológica:

### A. Paleta de Colores (Tokens Xamanen)
```css
--bg-void: #0A0C10;         /* Base oscura de contraste */
--surface-card: #101522;    /* Tarjetas de parámetros y puntos de monitoreo */
--surface-elevated: #161D2E;/* Modales de carga de análisis de laboratorio */

/* Estados de Cumplimiento Regulatorio */
--compliance-ok: #10B981;   /* Verde esmeralda: Dentro de los límites legales permitidos */
--compliance-alert: #F59E0B;/* Amarillo: Parámetro en límite de tolerancia (zona de aviso) */
--compliance-breach: #FF1919;/* Rojo: Exceso de límite legal / infracción normativa */

/* Acentos */
--accent-emerald: #10B981;  /* Acento primario temático ambiental */
--accent-cyan: #30EEE2;     /* Foco activo y botones de acción principal */
--accent-blue: #3C84CE;     /* Filtros y gráficos de tendencias históricas */
```

### B. Componentes Visuales Clave
- **Semáforo de Límites Regulatorios:** Cada parámetro medido (ej. DBO, Plomo, pH, Partículas en suspensión) muestra visualmente su valor frente al límite fijado por la norma (barra de rango con zona segura y zona de peligro).
- **Indicador de Vencimiento de Licencias:** Tarjetas con cuenta regresiva de días para el vencimiento de Declaraciones de Impacto Ambiental (DIA) y permisos de vertido.

---

## 3. NÚCLEO OBLIGATORIO (CORE ENGINE BASE)
1. **Autenticación Multi-Rol:** `super_admin`, `director_hse`, `auditor_ambiental`, `tecnico_muestreador`, `autoridad_reguladora` (modo solo lectura para inspecciones).
2. **Auditoría Forense ISO:** Registro inalterable de cada carga o edición de ensayos de laboratorio con fecha, hora, usuario e IP (cadena de custodia).
3. **Dashboard Ejecutivo HSE:** Mapa de puntos de muestreo, porcentaje de cumplimiento normativo global del mes y toneladas de CO2 proyectadas.
4. **Notificaciones Automáticas:** Correos automáticos de alerta 60, 30 y 15 días antes del vencimiento de una licencia o permiso hídrico.
5. **Infraestructura Cloud:** Dockerfile con HTTPS y copias de seguridad automáticas en S3 para resguardo documental legal.

---

## 4. MÓDULOS ESPECÍFICOS DEL VERTICAL AMBIENTAL (186 HORAS DE CATÁLOGO)

### Módulo 1: Mediciones Ambientales (Agua, Aire, Suelo) (ID 7)
- Registro de puntos de muestreo georreferenciados (nombre, código de estación, coordenadas fijas Lat/Lng).
- Carga de planillas de campo y protocolos de laboratorio: pH, conductividad, metales pesados, DBO, caudal, material particulado PM10/PM2.5.
- Gráficos interactivos de evolución histórica por punto y por estación estacional.

### Módulo 2: Matriz de Cumplimiento Legal y Licencias (ID 8)
- Catálogo de normativas aplicables (Leyes nacionales, provinciales, ordenanzas municipales y resoluciones hídricas).
- Requisitos operacionales asignados a responsables con fecha límite y archivo de evidencia adjunto (resolución oficial escaneada en PDF).
- Estado de cumplimiento: `Vigente`, `En Renovación`, `Por Vencer`, `No Cumplido`.

### Módulo 3: Informes Técnicos y Balances de Carbono en PDF (ID 9)
- Calculadora de emisiones de Gases de Efecto Invernadero (GEI - Alcance 1 y 2): Consumo de combustible diésel, energía eléctrica de red y gas natural.
- Generador de Informes Técnicos Ejecutivos en PDF con membrete oficial, firmas responsables, tablas de mediciones y gráficos comparativos listos para entregar a ministerios o secretarías de ambiente.

### Módulo 4: Gestión de Contratistas y Control de EPP (ID 6)
- Control de personal y cuadrillas ambientales en terreno: Inducciones de seguridad vial y faena, entrega de EPP específicos para manipulación de muestras químicas y seguros de accidentes personales al día.

---

## 5. SEEDER DE DEMOSTRACIÓN (DEMO DATA AMBIENTAL)
Crea un seeder `EnvironmentalDemoSeeder.php`:
- **Empresa Demo:** "Minera Sierra Grande S.A. — División Gestión Ambiental".
- **Estaciones de Muestreo:** 4 puntos reales (ej. *Estación E-01: Río Blanco Aguas Arriba*, *Estación E-02: Descarga Efluente Tratado*, *Estación A-01: Monitoreo de Polvo en Dique*, *Estación S-01: Suelo Perimetral Campamento*).
- **Mediciones:** 16 análisis de laboratorio de los últimos 4 meses con parámetros normales y uno en advertencia amarilla para demostrar el semáforo al cliente.
- **Matriz Legal:** 8 requisitos legales con evidencias en PDF simuladas y 1 licencia próxima a vencer (en 20 días) para activar la alarma.
- **Reporte:** 1 balance de huella de carbono generado y descargable en un clic.

---

## 6. REGLAS DE ORO DEL ALCANCE
- ❌ **NO conectar boyas o sensores IoT telemétricos por satélite en tiempo real** (Zona Roja IDs 3 y 4 por pérdida de conectividad en cordillera y costos exorbitantes de brokers). Si el cliente lo pide: *"El sistema centraliza las planillas de laboratorio certificado y protocolos de campo validados bajo cadena de custodia formal, que es lo que exige la legislación ambiental para tener validez legal ante fiscalías y secretarías."*
- ❌ **NO sincronización offline compleja** (Zona Roja ID 5). La plataforma cuenta con formulario de carga rápida optimizado para dispositivos móviles que sube los datos al retornar a zona con señal Wi-Fi o 4G.
