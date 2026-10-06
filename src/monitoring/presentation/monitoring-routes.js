// Lazy-loaded components
const alertCenter = () => import('./views/alert-center.vue');

const monitoringRoutes = [
    {   path: '', name: 'monitoring-alerts', component: alertCenter,
        meta: { title: 'Clinical Alerts', headerTitle: 'alerts.header.title', headerSubtitle: 'alerts.header.subtitle' } }
];

export default monitoringRoutes;
