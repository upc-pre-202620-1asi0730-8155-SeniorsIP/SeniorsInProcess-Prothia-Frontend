const clinicalReports = () => import('./views/clinical-reports-view.vue');

const analyticsRoutes = [
    {
        path: '',
        name: 'clinical-reports',
        component: clinicalReports,
        meta: { title: 'Reportes & Analítica', hideTopbar: true }
    }
];

export default analyticsRoutes;
