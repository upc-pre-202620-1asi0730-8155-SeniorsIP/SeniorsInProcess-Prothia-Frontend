// Lazy-loaded components
const prescriptionEditor = () => import('./views/prescription-editor.vue');

const prescriptionRoutes = [
    {   path: '', name: 'prescription-editor', component: prescriptionEditor,
        meta: { title: 'Exercise Prescription', headerTitle: 'prescription.header.title', headerSubtitle: 'prescription.header.subtitle' } }
];

export default prescriptionRoutes;
