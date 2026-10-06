import {PrescribedExercise} from "./prescribed-exercise.entity.js";

/**
 * Prescription (therapeutic plan) assigned to a patient.
 *
 * @class Prescription
 */
export class Prescription {
    /**
     * @param {Object} params - Entity attributes.
     * @param {?number} [params.id=null] - Prescription identifier.
     * @param {?number} [params.patientId=null] - Patient the plan belongs to.
     * @param {number} [params.phaseNumber=1] - Rehabilitation phase number.
     * @param {string} [params.phaseName='Inicial'] - Rehabilitation phase name.
     * @param {number} [params.durationWeeks=4] - Plan duration in weeks.
     * @param {number} [params.frequencyPerWeek=5] - Sessions per week.
     * @param {Array<Object|PrescribedExercise>} [params.exercises=[]] - Exercises of the plan.
     */
    constructor({ id = null, patientId = null, phaseNumber = 1, phaseName = 'Inicial',
                    durationWeeks = 4, frequencyPerWeek = 5, exercises = [] }) {
        this.id = id;
        this.patientId = patientId;
        this.phaseNumber = phaseNumber;
        this.phaseName = phaseName;
        this.durationWeeks = durationWeeks;
        this.frequencyPerWeek = frequencyPerWeek;
        this.exercises = exercises.map(exercise => new PrescribedExercise({...exercise}));
    }

    /** @returns {boolean} True when the plan has exercises and every dosage is filled in. */
    get isComplete() {
        return this.exercises.length > 0 && this.exercises.every(exercise => exercise.isComplete);
    }

    /**
     * Appends a library exercise to the plan.
     * @param {import('./exercise.entity.js').Exercise} exercise - Library exercise.
     */
    addExercise(exercise) {
        this.exercises.push(new PrescribedExercise({ exerciseId: exercise.id, name: exercise.name }));
    }

    /**
     * Removes the exercise at the given position.
     * @param {number} index - Position inside the plan.
     */
    removeExerciseAt(index) {
        this.exercises.splice(index, 1);
    }
}
