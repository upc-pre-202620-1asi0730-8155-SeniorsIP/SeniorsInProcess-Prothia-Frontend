// Lazy-loaded components
const patientList = () => import('./views/patient-list.vue');
const patientForm = () => import('./views/patient-form.vue');

const headerTitle = 'patients.header.title';
const headerSubtitle = 'patients.header.subtitle';

const patientRoutes = [
    {   path: '',      name: 'patients-list', component: patientList,
        meta: { title: 'Patients', headerTitle, headerSubtitle, headerAction: { label: 'patients.new', to: '/patients/new' } } },
    {   path: 'new',   name: 'patients-new',  component: patientForm,
        meta: { title: 'New Patient', headerTitle: 'patient-form.title' } },
    {   path: ':id',   name: 'patients-record',
        redirect: to => ({ path: '/reports', query: { patientId: to.params.id } }) }
];

export default patientRoutes;
