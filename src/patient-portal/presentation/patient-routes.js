const myDayView = () => import('./views/my-day-view.vue');
const liveTelemetryView = () => import('./views/live-telemetry-view.vue');
const gaitHistoryView = () => import('./views/gait-history-view.vue');
const patientExercisesView = () => import('./views/patient-exercises-view.vue');
const patientMessagesView = () => import('./views/patient-messages-view.vue');

const patientPortalRoutes = [
    {
        path: 'my-day',
        name: 'patient-my-day',
        component: myDayView,
        meta: {
            title: 'Mi Día',
            role: 'patient',
            signOut: true
        }
    },
    {
        path: 'dashboard',
        redirect: { name: 'patient-my-day' }
    },
    {
        path: 'live-telemetry',
        name: 'patient-live-telemetry',
        component: liveTelemetryView,
        meta: {
            title: 'Telemetría en Vivo',
            role: 'patient',
            signOut: true
        }
    },
    {
        path: 'gait-history',
        name: 'patient-gait-history',
        component: gaitHistoryView,
        meta: {
            title: 'Historial y Marcha',
            role: 'patient',
            signOut: true
        }
    },
    {
        path: 'prosthesis',
        redirect: { name: 'patient-gait-history' }
    },
    {
        path: 'exercises',
        name: 'patient-exercises',
        component: patientExercisesView,
        meta: {
            title: 'Mis Ejercicios',
            role: 'patient',
            signOut: true
        }
    },
    {
        path: 'messages',
        name: 'patient-messages',
        component: patientMessagesView,
        meta: {
            title: 'Mensajes',
            role: 'patient',
            signOut: true
        }
    },
    {
        path: '',
        redirect: { name: 'patient-my-day' }
    }
];

export default patientPortalRoutes;
