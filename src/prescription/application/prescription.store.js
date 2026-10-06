/**
 * Application service store for the Prescription bounded context.
 * It coordinates the exercise library and the plan being edited for a patient.
 *
 * @module usePrescriptionStore
 */
import {defineStore} from "pinia";
import {ref} from "vue";
import {PrescriptionApi} from "../infrastructure/prescription-api.js";
import {ExerciseAssembler} from "../infrastructure/exercise.assembler.js";
import {PrescriptionAssembler} from "../infrastructure/prescription.assembler.js";
import {Prescription} from "../domain/model/prescription.entity.js";

import {Exercise} from "../domain/model/exercise.entity.js";

const defaultExercises = [
    new Exercise({
        id: 1,
        name: 'Transferencia de Peso Lateral y Apoyo Unipodal',
        focus: ['Equilibrio', 'Carga progresiva en muñón']
    }),
    new Exercise({
        id: 2,
        name: 'Elevación de Talón Asistida en Barra',
        focus: ['Fuerza', 'Tríceps sural y estabilidad']
    }),
    new Exercise({
        id: 3,
        name: 'Puente de Glúteos con Prótesis',
        focus: ['Extensión de cadera', 'Anti-compensación lumbar']
    }),
    new Exercise({
        id: 4,
        name: 'Subida de Escalón (Step-up) 10 cm',
        focus: ['Coordinación', 'Potencia cuádriceps']
    })
];

const defaultPrescriptions = [
    new Prescription({
        id: 1,
        patientId: 1,
        phaseNumber: 2,
        phaseName: 'Ajuste',
        durationWeeks: 4,
        frequencyPerWeek: 5,
        exercises: [
            {
                exerciseId: 1,
                name: 'Transferencia de Peso Lateral y Apoyo Unipodal',
                sets: 3,
                reps: 12,
                restSeconds: 45
            },
            {
                exerciseId: 2,
                name: 'Elevación de Talón Asistida en Barra',
                sets: 3,
                reps: 10,
                restSeconds: 60
            }
        ]
    })
];

const prescriptionApi = new PrescriptionApi();

/**
 * Reactive store that exposes Prescription commands and queries.
 *
 * @returns {Object} Store state and actions.
 */
const usePrescriptionStore = defineStore('prescription', () => {
    /** @type {import('vue').Ref<Exercise[]>} */
    const exercises = ref([...defaultExercises]);
    /** @type {import('vue').Ref<Prescription[]>} Stored prescriptions. */
    const prescriptions = ref([...defaultPrescriptions]);
    /** @type {import('vue').Ref<?Prescription>} Plan being edited (a copy, not the stored one). */
    const draft = ref(null);
    /** @type {import('vue').Ref<any[]>} Active rehabilitation exercises for home tracking. */
    const patientExercises = ref([
        {
            id: 1,
            num: '01',
            category: 'Equilibrio y Carga',
            title: 'Transferencia de Peso Lateral y Apoyo Unipodal',
            instructions: 'De pie junto a una barra de apoyo, descarga gradualmente el 100% de tu peso sobre la prótesis durante 5 segundos antes de retornar a la posición bípeda.',
            param1: 'Series: 3',
            param2: 'Repeticiones: 12 por pierna',
            param3: 'Descanso: 45 segundos',
            isDone: false,
            doneTime: null,
            rpe: null
        },
        {
            id: 2,
            num: '02',
            category: 'Fuerza de Gemelo y Muñón',
            title: 'Elevación de Talón Asistida en Barra',
            instructions: 'Elevación rítmica del talón del pie contralateral para compensar el brazo de palanca y activar la musculatura del muñón residual.',
            param1: 'Series realizadas: 3 de 3',
            param2: 'Esfuerzo percibido: 3/10 (Leve)',
            param3: null,
            isDone: true,
            doneTime: '08:30 AM',
            rpe: '3/10 (Leve)'
        },
        {
            id: 3,
            num: '03',
            category: 'Rango Articular',
            title: 'Flexo-Extensión de Cadera en Bipedestación',
            instructions: 'Mantener el torso erguido evitando la lordosis lumbar excesiva al balancear la extremidad protésica hacia adelante.',
            param1: 'Series realizadas: 4 de 4',
            param2: 'Esfuerzo percibido: 4/10 (Moderado)',
            param3: null,
            isDone: true,
            doneTime: '10:05 AM',
            rpe: '4/10 (Moderado)'
        },
        {
            id: 4,
            num: '04',
            category: 'Patrón de Marcha',
            title: 'Caminata en Línea Recta con Biofeedback',
            instructions: 'Sesión de 15 minutos en pasillo interior con sincronización de sensores inerciales IMU.',
            param1: 'Duración: 15 min',
            param2: 'Cadencia media: 96 pasos/min',
            param3: null,
            isDone: true,
            doneTime: '10:45 AM',
            rpe: 'Cadencia 96 ppm'
        }
    ]);

    /** @type {import('vue').Ref<Error[]>} */
    const errors = ref([]);
    const exercisesLoaded = ref(true);
    const prescriptionsLoaded = ref(true);

    /**
     * Marks a home exercise as completed and records perceived effort.
     *
     * @param {number} exerciseId - Identifier of completed exercise.
     * @param {number} [effortScore=5] - Borg scale effort rating (1-10).
     */
    function markExerciseDone(exerciseId, effortScore = 5) {
        const target = patientExercises.value.find(e => e.id === exerciseId);
        if (target) {
            target.isDone = true;
            target.doneTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            target.param1 = 'Series realizadas: 3 de 3';
            target.param2 = `Esfuerzo percibido: ${effortScore}/10`;
            target.param3 = null;
            target.rpe = `${effortScore}/10`;
        }
    }

    /** Loads the exercise library. */
    function fetchExercises() {
        return prescriptionApi.getExercises().then(response => {
            const list = ExerciseAssembler.toEntitiesFromResponse(response);
            if (list.length > 0) {
                exercises.value = list;
            }
            exercisesLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
            exercisesLoaded.value = true;
        });
    }

    /** Loads stored prescriptions. */
    function fetchPrescriptions() {
        return prescriptionApi.getPrescriptions().then(response => {
            const list = PrescriptionAssembler.toEntitiesFromResponse(response);
            if (list.length > 0) {
                prescriptions.value = list;
            }
            prescriptionsLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
            prescriptionsLoaded.value = true;
        });
    }

    /**
     * @param {number} patientId - Patient identifier.
     * @returns {Prescription|undefined} Current stored prescription of the patient, if any.
     */
    function getPrescriptionByPatientId(patientId) {
        return prescriptions.value.find(prescription => prescription.patientId === patientId);
    }

    /**
     * Starts editing the plan of a patient: a copy of the stored one, or a new draft.
     * @param {number} patientId - Patient identifier.
     */
    function selectPatient(patientId) {
        const stored = getPrescriptionByPatientId(patientId);
        draft.value = stored
            ? new Prescription({...stored})
            : new Prescription({ patientId });
    }

    /**
     * Persists the draft, creating or updating the patient's prescription optimistically.
     * @returns {Promise<any>} Resolves when the plan was saved.
     */
    function saveDraft() {
        if (!draft.value) return Promise.resolve();
        const resource = JSON.parse(JSON.stringify(draft.value));
        if (!resource.id) {
            resource.id = Date.now();
        }
        const localEntity = new Prescription({ ...resource });
        const existingIndex = prescriptions.value.findIndex(p => p.patientId === localEntity.patientId || p.id === localEntity.id);
        if (existingIndex >= 0) {
            prescriptions.value[existingIndex] = localEntity;
        } else {
            prescriptions.value.push(localEntity);
        }

        const request = draft.value.id && draft.value.id < 1000000000000
            ? prescriptionApi.updatePrescription(resource)
            : prescriptionApi.createPrescription(resource);
        return request.then(response => {
            const saved = PrescriptionAssembler.toEntityFromResource(response.data);
            const index = prescriptions.value.findIndex(prescription => prescription.id === saved.id || prescription.patientId === saved.patientId);
            if (index >= 0) prescriptions.value[index] = saved; else prescriptions.value.push(saved);
            draft.value = new Prescription({...saved});
            return saved;
        }).catch(error => {
            errors.value.push(error);
            draft.value = localEntity;
            return localEntity;
        });
    }

    return {
        exercises, prescriptions, draft, errors, exercisesLoaded, prescriptionsLoaded,
        patientExercises, markExerciseDone,
        fetchExercises, fetchPrescriptions, getPrescriptionByPatientId, selectPatient, saveDraft
    };
});

export { usePrescriptionStore };
export default usePrescriptionStore;
