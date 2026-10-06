const workshopCoordination = () => import('./views/workshop-coordination-view.vue');

const communicationRoutes = [
    {
        path: '',
        name: 'workshop-coordination',
        component: workshopCoordination,
        meta: { title: 'Talleres Ortopédicos', hideTopbar: true }
    }
];

export default communicationRoutes;
