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
import {useCommunicationStore} from "../../communication/application/communication.store.js";

const prescriptionApi = new PrescriptionApi();

const EXERCISE_INSTRUCTIONS_MAP = {
    1: {
        category: 'Equilibrio y Carga',
        instructions: 'De pie junto a una barra de apoyo, descarga gradualmente el 100% de tu peso sobre la prótesis durante 5 segundos antes de retornar a la posición bípeda.'
    },
    2: {
        category: 'Fuerza de Gemelo y Muñón',
        instructions: 'Elevación rítmica del talón del pie contralateral para compensar el brazo de palanca y activar la musculatura del muñón residual.'
    },
    3: {
        category: 'Rango Articular',
        instructions: 'Mantener el torso erguido evitando la lordosis lumbar excesiva al balancear la extremidad protésica hacia adelante.'
    },
    4: {
        category: 'Patrón de Marcha',
        instructions: 'Sesión de 15 minutos en pasillo interior con sincronización de sensores inerciales IMU.'
    }
};

/**
 * Reactive store that exposes Prescription commands and queries.
 *
 * @returns {Object} Store state and actions.
 */
const usePrescriptionStore = defineStore('prescription', () => {
    /** @type {import('vue').Ref<import('../domain/model/exercise.entity.js').Exercise[]>} */
    const exercises = ref([]);
    /** @type {import('vue').Ref<Prescription[]>} Stored prescriptions. */
    const prescriptions = ref([]);
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
    const exercisesLoaded = ref(false);
    const prescriptionsLoaded = ref(false);

    function syncPatientExercisesFromPrescription() {
        const activePlan = prescriptions.value.find(p => Number(p.patientId) === 1) || prescriptions.value[0];
        if (activePlan && activePlan.exercises?.length) {
            const prevMap = new Map(patientExercises.value.map(item => [item.id, item]));
            patientExercises.value = activePlan.exercises.map((ex, idx) => {
                const exId = Number(ex.exerciseId || ex.id || idx + 1);
                const meta = EXERCISE_INSTRUCTIONS_MAP[exId] || {
                    category: 'Rehabilitación Protésica',
                    instructions: 'Ejecuta el movimiento de forma controlada manteniendo la alineación de la pelvis y descarga simétrica.'
                };
                const prev = prevMap.get(exId);
                return {
                    id: exId,
                    num: String(idx + 1).padStart(2, '0'),
                    category: meta.category,
                    title: ex.name,
                    instructions: meta.instructions,
                    param1: prev?.isDone ? `Series realizadas: ${ex.sets} de ${ex.sets}` : `Series: ${ex.sets}`,
                    param2: prev?.isDone ? `Esfuerzo percibido: ${prev.rpe}` : `Repeticiones: ${ex.reps}`,
                    param3: prev?.isDone ? null : `Descanso: ${ex.restSeconds} segundos`,
                    isDone: prev ? prev.isDone : false,
                    doneTime: prev ? prev.doneTime : null,
                    rpe: prev ? prev.rpe : null
                };
            });
        }
    }

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

            const doneCount = patientExercises.value.filter(e => e.isDone).length;
            const total = patientExercises.value.length;
            const percentage = Math.round((doneCount / total) * 100);
            const commStore = useCommunicationStore();
            commStore.addSystemNotification(
                `El paciente Carlos Mendoza completó el ejercicio "${target.title}" (Esfuerzo Borg: ${effortScore}/10). Progreso diario: ${doneCount}/${total} (${percentage}%).`
            );
        }
    }

    /** Loads the exercise library. */
    function fetchExercises() {
        return prescriptionApi.getExercises().then(response => {
            exercises.value = ExerciseAssembler.toEntitiesFromResponse(response);
            exercisesLoaded.value = true;
        }).catch(error => {
            errors.value.push(error);
            exercisesLoaded.value = true;
        });
    }

    /** Loads stored prescriptions. */
    function fetchPrescriptions() {
        return prescriptionApi.getPrescriptions().then(response => {
            prescriptions.value = PrescriptionAssembler.toEntitiesFromResponse(response);
            syncPatientExercisesFromPrescription();
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
        return prescriptions.value.find(prescription => Number(prescription.patientId) === Number(patientId));
    }

    /**
     * Starts editing the plan of a patient: a copy of the stored one, or a new draft.
     * @param {number} patientId - Patient identifier.
     */
    function selectPatient(patientId) {
        const stored = getPrescriptionByPatientId(patientId);
        draft.value = stored
            ? new Prescription({
                ...stored,
                exercises: (stored.exercises || []).map(ex => ({...ex}))
            })
            : new Prescription({ patientId: Number(patientId) });
    }

    /**
     * Persists the draft, creating or updating the patient's prescription in the backend.
     * @returns {Promise<any>} Resolves when the plan was saved.
     */
    function saveDraft() {
        if (!draft.value) return Promise.resolve();
        const existingInDb = prescriptions.value.find(p => Number(p.patientId) === Number(draft.value.patientId) && p.id && p.id < 1000000000000);

        const resource = {
            id: existingInDb ? existingInDb.id : undefined,
            patientId: Number(draft.value.patientId),
            phaseNumber: Number(draft.value.phaseNumber || 2),
            phaseName: String(draft.value.phaseName || 'Ajuste'),
            durationWeeks: Number(draft.value.durationWeeks || 4),
            frequencyPerWeek: Number(draft.value.frequencyPerWeek || 5),
            exercises: (draft.value.exercises || []).map(ex => ({
                exerciseId: Number(ex.exerciseId || ex.id || 1),
                name: String(ex.name || ''),
                sets: Number(ex.sets || 3),
                reps: Number(ex.reps || 10),
                restSeconds: Number(ex.restSeconds || 45)
            }))
        };

        const request = existingInDb
            ? prescriptionApi.updatePrescription(resource).catch(err => {
                if (err?.response?.status === 404) {
                    return prescriptionApi.createPrescription(resource);
                }
                throw err;
            })
            : prescriptionApi.createPrescription(resource);

        return request.then(response => {
            const saved = PrescriptionAssembler.toEntityFromResource(response.data);
            const index = prescriptions.value.findIndex(prescription => prescription.id === saved.id || Number(prescription.patientId) === Number(saved.patientId));
            if (index >= 0) prescriptions.value[index] = saved; else prescriptions.value.push(saved);
            draft.value = new Prescription({
                ...saved,
                exercises: (saved.exercises || []).map(ex => ({...ex}))
            });
            syncPatientExercisesFromPrescription();
            return saved;
        }).catch(error => {
            errors.value.push(error);
            throw error;
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
