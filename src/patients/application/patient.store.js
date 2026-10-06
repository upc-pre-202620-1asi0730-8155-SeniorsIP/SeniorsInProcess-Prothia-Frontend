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
import {Patient} from "../domain/model/patient.entity.js";

const patientsApi = new PatientsApi();

const defaultPatients = [
    new Patient({
        id: 1,
        fullName: "Carlos Mendoza Arias",
        dni: "45892104",
        age: 38,
        amputation: "Transtibial Der.",
        kLevel: "K3",
        prosthesisCode: "PR-2026-TT-084",
        adherence: 88,
        symmetry: 92,
        status: "alert"
    }),
    new Patient({
        id: 2,
        fullName: "Roberto Sánchez P.",
        dni: "40129845",
        age: 45,
        amputation: "Transfemoral Izq.",
        kLevel: "K2",
        prosthesisCode: "PR-2026-TF-012",
        adherence: 72,
        symmetry: 81,
        status: "critical"
    }),
    new Patient({
        id: 3,
        fullName: "María Vega Castro",
        dni: "10845921",
        age: 52,
        amputation: "Transtibial Bilateral",
        kLevel: "K3",
        prosthesisCode: "PR-2026-TT-055",
        adherence: 95,
        symmetry: 96,
        status: "stable"
    }),
    new Patient({
        id: 4,
        fullName: "Jorge Alarcón Ruiz",
        dni: "72458912",
        age: 29,
        amputation: "Transtibial Izq.",
        kLevel: "K4",
        prosthesisCode: "PR-2026-TT-091",
        adherence: 91,
        symmetry: 94,
        status: "stable"
    })
];

/**
 * Reactive store that exposes Patients commands and queries.
 *
 * @returns {Object} Store state and actions.
 */
const usePatientStore = defineStore('patients', () => {
    /** @type {import('vue').Ref<Patient[]>} */
    const patients = ref([...defaultPatients]);
    /** @type {import('vue').Ref<Error[]>} */
    const errors = ref([]);
    /** @type {import('vue').Ref<boolean>} */
    const patientsLoaded = ref(true);
    /** @type {import('vue').ComputedRef<number>} */
    const patientsCount = computed(() => patients.value.length);

    /** Loads patients from infrastructure and updates the application state. */
    function fetchPatients() {
        return patientsApi.getPatients().then(response => {
            const list = PatientAssembler.toEntitiesFromResponse(response);
            if (list.length > 0) {
                patients.value = list;
            }
            patientsLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
            patientsLoaded.value = true;
        });
    }

    /**
     * @param {number|string} id - Patient identifier.
     * @returns {Patient|undefined} Matching patient, if loaded.
     */
    function getPatientById(id) {
        const idNum = parseInt(id);
        return patients.value.find(patient => patient.id === idNum);
    }

    /**
     * Registers a patient and appends it to local state optimistically.
     * @param {Patient|Object} patient - Patient entity to persist.
     * @returns {Promise<Patient>} Resolves when the patient was stored.
     */
    function addPatient(patient) {
        const entity = patient instanceof Patient ? patient : new Patient(patient);
        if (!entity.id) entity.id = Date.now();
        patients.value.push(entity);

        return patientsApi.createPatient(entity).then(response => {
            const persisted = PatientAssembler.toEntityFromResource(response.data);
            const index = patients.value.findIndex(p => p.id === entity.id || p.dni === entity.dni);
            if (index !== -1) {
                patients.value[index] = persisted;
            }
            return persisted;
        }).catch(error => {
            errors.value.push(error);
            return entity;
        });
    }

    return { patients, errors, patientsLoaded, patientsCount, fetchPatients, getPatientById, addPatient };
});

export { usePatientStore };
export default usePatientStore;
