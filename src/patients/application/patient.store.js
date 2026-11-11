import {defineStore} from "pinia";
import {ref} from "vue";
import {PatientsApi} from "../infrastructure/patients-api.js";
import {PatientAssembler} from "../infrastructure/patient.assembler.js";

const patientsApi = new PatientsApi();

const usePatientStore = defineStore('patients', () => {
    const patients = ref([]);
    const errors = ref([]);
    const patientsLoaded = ref(false);

    function fetchPatients() {
        return patientsApi.getPatients().then(response => {
            patients.value = PatientAssembler.toEntitiesFromResponse(response);
            patientsLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
            patientsLoaded.value = true;
        });
    }

    function getPatientById(id) {
        const numericId = Number(id);
        return patients.value.find(patient => patient.id === numericId);
    }

    function addPatient(patient) {
        return patientsApi.createPatient(PatientAssembler.toResourceFromEntity(patient)).then(response => {
            const created = PatientAssembler.toEntityFromResource(response.data);
            patients.value.push(created);
            return created;
        }).catch(error => {
            errors.value.push(error);
            throw error;
        });
    }

    function updatePatient(patient) {
        return patientsApi.updatePatient(PatientAssembler.toResourceFromEntity(patient)).then(response => {
            const updated = PatientAssembler.toEntityFromResource(response.data);
            const index = patients.value.findIndex(p => p.id === updated.id);
            if (index !== -1) patients.value[index] = updated;
        }).catch(error => {
            errors.value.push(error);
        });
    }

    function deletePatient(patient) {
        return patientsApi.deletePatient(patient.id).then(() => {
            const index = patients.value.findIndex(p => p.id === patient.id);
            if (index !== -1) patients.value.splice(index, 1);
        }).catch(error => {
            errors.value.push(error);
        });
    }

    return {
        patients,
        errors,
        patientsLoaded,
        fetchPatients,
        getPatientById,
        addPatient,
        updatePatient,
        deletePatient
    };
});

export default usePatientStore;
export { usePatientStore };
