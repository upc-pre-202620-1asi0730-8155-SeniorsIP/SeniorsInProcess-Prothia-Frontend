const clinicSubscription = () => import('./views/clinic-subscription-view.vue');

const billingRoutes = [
    {
        path: '',
        name: 'clinic-subscription',
        component: clinicSubscription,
        meta: { title: 'Suscripción Clínica', hideTopbar: true }
    }
];

export default billingRoutes;
