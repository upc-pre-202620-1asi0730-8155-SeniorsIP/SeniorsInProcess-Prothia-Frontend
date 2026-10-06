const fleetDashboard = () => import('./views/fleet-dashboard.vue');
const fleetInventory = () => import('./views/fleet-inventory.vue');
const preventiveMaintenance = () => import('./views/preventive-maintenance-view.vue');
const fatigueAlerts = () => import('./views/fatigue-alerts-view.vue');
const clinicsView = () => import('./views/clinics-view.vue');
const softwareLicense = () => import('./views/software-license-view.vue');

const workshopRoutes = [
    {
        path: 'dashboard',
        name: 'technician-dashboard',
        component: fleetDashboard,
        meta: {
            title: 'Dashboard de Flota',
            headerTitleKey: 'technician.headers.dashboard-title',
            headerSubtitleKey: 'technician.headers.dashboard-subtitle',
            headerTitle: 'Ortopedia Técnica Avanzada S.A.C.',
            headerSubtitle: 'Licencia de Taller Activa • 42 prótesis en telemetría de vida útil',
            headerAction: {
                label: '+ Registrar / Vincular Prótesis',
                actionKey: 'technician.actions.register-link',
                actionType: 'register-prosthesis'
            },
            role: 'technician',
            signOut: true
        }
    },
    {
        path: 'fleet',
        name: 'technician-fleet',
        component: fleetInventory,
        meta: {
            title: 'Flota de Prótesis',
            headerTitleKey: 'technician.headers.fleet-title',
            headerSubtitleKey: 'technician.headers.fleet-subtitle',
            headerTitle: 'Inventario y Flota de Prótesis',
            headerSubtitle: '42 dispositivos activos • Registro técnico y telemetría de vida útil',
            headerAction: {
                label: '+ Registrar Prótesis',
                actionKey: 'technician.actions.register',
                actionType: 'register-prosthesis'
            },
            role: 'technician',
            signOut: true
        }
    },
    {
        path: 'maintenance',
        name: 'technician-maintenance',
        component: preventiveMaintenance,
        meta: {
            title: 'Mantenimiento Preventivo',
            headerTitleKey: 'technician.headers.maintenance-title',
            headerSubtitleKey: 'technician.headers.maintenance-subtitle',
            headerTitle: 'Mantenimiento Preventivo',
            headerSubtitle: 'Programación de servicios técnicos anticipados para evitar fallas mecánicas',
            headerAction: {
                label: '+ Programar Mantenimiento',
                actionKey: 'technician.actions.schedule-maintenance',
                actionType: 'schedule-maintenance'
            },
            role: 'technician',
            signOut: true
        }
    },
    {
        path: 'fatigue-alerts',
        name: 'technician-fatigue-alerts',
        component: fatigueAlerts,
        meta: {
            title: 'Alertas de Fatiga',
            headerTitleKey: 'technician.headers.fatigue-title',
            headerSubtitleKey: 'technician.headers.fatigue-subtitle',
            headerTitle: 'Centro de Alertas de Fatiga Mecánica',
            headerSubtitle: 'Avisos telemétricos generados cuando una prótesis alcanza límites de desgaste o impacto',
            headerAction: null,
            role: 'technician',
            signOut: true
        }
    },
    {
        path: 'clinics',
        name: 'technician-clinics',
        component: clinicsView,
        meta: {
            title: 'Fichas de Clínicas',
            headerTitleKey: 'technician.headers.clinics-title',
            headerSubtitleKey: 'technician.headers.clinics-subtitle',
            headerTitle: 'Fichas Clínicas Compartidas',
            headerSubtitle: 'Informes autorizados por fisioterapeutas para coordinar calibraciones mecánicas',
            headerAction: null,
            role: 'technician',
            signOut: true
        }
    },
    {
        path: 'license',
        name: 'technician-license',
        component: softwareLicense,
        meta: {
            title: 'Licencia de Software',
            headerTitleKey: 'technician.headers.license-title',
            headerSubtitleKey: 'technician.headers.license-subtitle',
            headerTitle: 'Gestión de Licencia Técnica de Taller',
            headerSubtitle: 'Monitoreo telemétrico de flota protésica y facturación de licenciamiento',
            headerAction: null,
            role: 'technician',
            signOut: true
        }
    },
    {
        path: '',
        redirect: { name: 'technician-dashboard' }
    }
];

export default workshopRoutes;
