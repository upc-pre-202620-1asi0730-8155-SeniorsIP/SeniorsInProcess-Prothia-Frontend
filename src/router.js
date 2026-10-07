import {createRouter, createWebHistory} from "vue-router";
import Layout from "./shared/presentation/components/layout.vue";
import WorkshopLayout from "./workshop/presentation/components/workshop-layout.vue";
import PatientLayout from "./patient-portal/presentation/components/patient-layout.vue";
import Home from "./shared/presentation/views/home.vue";
import RoleSelector from "./shared/presentation/views/role-selector.vue";
import patientRoutes from "./patients/presentation/patient-routes.js";
import prescriptionRoutes from "./prescription/presentation/prescription-routes.js";
import monitoringRoutes from "./monitoring/presentation/monitoring-routes.js";
import workshopRoutes from "./workshop/presentation/workshop-routes.js";
import patientPortalRoutes from "./patient-portal/presentation/patient-routes.js";
import communicationRoutes from "./communication/presentation/communication-routes.js";
import analyticsRoutes from "./analytics/presentation/analytics-routes.js";
import billingRoutes from "./billing/presentation/billing-routes.js";

// Define lazy-loaded components for routes
const about = () => import('./shared/presentation/views/about.vue');
const pageNotFound = () => import('./shared/presentation/views/page-not-found.vue');

const routes = [
    // 1. Main Role Selection Screen (Root /)
    {
        path: '/',
        name: 'role-selector',
        component: RoleSelector,
        meta: { title: 'Seleccionar Rol' }
    },
    {
        path: '/select-role',
        redirect: '/'
    },

    // 2. Orthoprosthetic Technician Portal (Orthopedic Workshop)
    {
        path: '/technician',
        component: WorkshopLayout,
        children: workshopRoutes
    },

    // 3. Amputee Patient Portal
    {
        path: '/patient',
        component: PatientLayout,
        children: patientPortalRoutes
    },

    // 4. Clinical Therapist Portal (Original Paths and Layout Intact)
    {
        path: '/',
        component: Layout,
        children: [
            { path: 'home',            name: 'home',          component: Home,        meta: { title: 'Home', headerAction: { label: 'shell.register-patient', to: '/patients/new' }, signOut: true } },
            { path: 'about',           name: 'about',         component: about,       meta: { title: 'About' } },
            { path: 'publishing',      name: 'publishing',    children: publishingRoutes },
            { path: 'patients',        name: 'patients',      children: patientRoutes },
            { path: 'prescriptions',   name: 'prescriptions', children: prescriptionRoutes },
            { path: 'alerts',          name: 'alerts',        children: monitoringRoutes },
            { path: 'workshops',       name: 'workshops',     children: communicationRoutes },
            { path: 'reports',         name: 'reports',       children: analyticsRoutes },
            { path: 'subscription',    name: 'subscription',  children: billingRoutes }
        ]
    },

    // 5. Page not found
    { path: '/:pathMatch(.*)*', name: 'not-found', component: pageNotFound, meta: { title: 'Page Not Found' } }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes,
});

router.beforeEach((to, from) => {
    let baseTitle = 'Prothia';
    const pageTitle = to.meta['title'] || 'Portal';
    document.title = `${baseTitle} - ${pageTitle}`;
    return true;
});

export default router;