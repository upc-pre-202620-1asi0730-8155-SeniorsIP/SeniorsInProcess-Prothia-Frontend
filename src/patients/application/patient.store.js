/**
 * Application service store for the Patients bounded context.
 * It coordinates patient use cases and keeps UI-facing state.
 *
 * @module usePatientStore
 */
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {PatientsApi} from "../infrastructure/patients-api.js";
import {PatientAssembler} from "../infrastructure/patient.assembler.js";

const patientsApi = new PatientsApi();

/**
 * Reactive store that exposes Patients commands and queries.
 *
 * @returns {Object} Store state and actions.
 */
const usePatientStore = defineStore('patients', () => {
    /** @type {import('vue').Ref<import('../domain/model/patient.entity.js').Patient[]>} */
    const patients = ref([]);
    /** @type {import('vue').Ref<Error[]>} */
    const errors = ref([]);
    /** @type {import('vue').Ref<boolean>} */
    const patientsLoaded = ref(false);
    /** @type {import('vue').ComputedRef<number>} */
    const patientsCount = computed(() => patients.value.length);

    /** Loads patients from infrastructure and updates the application state. */
    function fetchPatients() {
        return patientsApi.getPatients().then(response => {
            patients.value = PatientAssembler.toEntitiesFromResponse(response);
            errors.value = [];
            patientsLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
            patientsLoaded.value = true;
        });
    }

    /**
     * @param {number|string} id - Patient identifier.
     * @returns {import('../domain/model/patient.entity.js').Patient|undefined} Matching patient, if loaded.
     */
    function getPatientById(id) {
        const numericId = Number(id);
        return patients.value.find(patient => patient.id === numericId);
    }

    /**
     * Registers a patient in the backend and appends it to local state.
     * @param {import('../domain/model/patient.entity.js').Patient|Object} patient - Patient entity to persist.
     * @returns {Promise<import('../domain/model/patient.entity.js').Patient>} Resolves when the patient was stored.
     */
    function addPatient(patient) {
        errors.value = [];
        return patientsApi.createPatient(PatientAssembler.toResourceFromEntity(patient)).then(response => {
            const created = PatientAssembler.toEntityFromResource(response.data);
            patients.value.push(created);
            errors.value = [];
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
        patientsCount,
        fetchPatients,
        getPatientById,
        addPatient,
        updatePatient,
        deletePatient
    };
});

export default usePatientStore;
export { usePatientStore };
