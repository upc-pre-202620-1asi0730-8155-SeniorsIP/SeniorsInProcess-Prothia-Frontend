# PROTHIA Frontend

Frontend de una plataforma web orientada a la rehabilitación de pacientes con prótesis, diseñada para conectar a pacientes amputados, técnicos ortoprotésicos y medicos/terapeutas en un flujo único de atención, seguimiento y mantenimiento.

El proyecto presenta una estructura modular basada en Domain-Driven Design (DDD), con portales específicos por rol y una interfaz moderna construida con Vue 3 + Vite.

## Descripción del proyecto

Prothia ayuda a gestionar:

- pacientes y su historial clínico,
- prescripciones y ejercicios terapéuticos,
- alertas de monitorización y análisis de marcha,
- inventario y mantenimiento de prótesis,
- coordinación entre taller y medicos/terapeutas,
- reportes clínicos y facturación de suscripciones,
- experiencia digital para pacientes con acceso a su progreso y actividades.

La solución está pensada como una demostración funcional de un ecosistema de salud digital para prótesis y rehabilitación, con navegación por roles:

- Paciente amputado
- Técnico ortoprotésico
- Terapeuta / medico

## Características principales

- Portal de selección de rol con idioma configurable
- Dashboard principal con KPIs de pacientes, adherencia y alertas
- Gestión de pacientes y datos clínicos
- Editor de prescripciones por fase terapéutica
- Monitorización de alertas por anomalías de movimiento o carga
- Módulo de taller con inventario y mantenimientos preventivos
- Módulo de reportes clínicos y analítica
- Módulo de suscripción y facturación
- Integración con API REST mock mediante JSON Server
- Arquitectura modular por dominio en `src/`

## Stack tecnológico

- Vue 3
- Vite
- Vue Router
- Pinia
- PrimeVue + PrimeFlex + PrimeIcons
- Axios
- Vue I18n
- JSON Server

## Estructura del proyecto

```text
.
├── public/
├── server/
│   └── db.json
├── src/
│   ├── analytics/
│   ├── billing/
│   ├── communication/
│   ├── iam/
│   ├── monitoring/
│   ├── patient-portal/
│   ├── patients/
│   ├── prescription/
│   ├── shared/
│   ├── workshop/
│   ├── app.vue
│   ├── i18n.js
│   ├── main.js
│   ├── pinia.js
│   └── router.js
├── .env.development
├── .env.production
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── package-lock.json
```


## Módulos principales

- `src/shared`: layout, navegación, idioma, home y componentes reutilizables
- `src/patients`: registro y catálogo de pacientes
- `src/prescription`: planificación de ejercicios terapéuticos
- `src/monitoring`: alertas, umbrales y análisis de monitoreo
- `src/workshop`: taller ortoprotésico, inventario y mantenimiento
- `src/analytics`: reportes clínicos y métricas
- `src/billing`: suscripciones y facturación
- `src/communication`: coordinación entre áreas
- `src/patient-portal`: vista para pacientes amputados
- `src/iam`: autenticación y manejo de usuarios

## Nota de arquitectura

El proyecto sigue una organización por dominios con niveles como:

- `domain`: modelos y lógica de negocio
- `application`: stores y casos de uso
- `infrastructure`: clientes HTTP y adaptadores
- `presentation`: vistas, componentes y rutas

Esto ayuda a mantener la aplicación escalable y alineada con principios de DDD.

## Estado del proyecto

Es un frontend de demostración / académico centrado en la experiencia de usuario y la organización modular de un sistema de rehabilitación protésica.

## Contribución

Este repositorio está orientado a uso académico y desarrollo colaborativo dentro del proyecto Seniors in Process. Si deseas extenderlo, puedes abrir una rama nueva, aplicar cambios y realizar una pull request.
