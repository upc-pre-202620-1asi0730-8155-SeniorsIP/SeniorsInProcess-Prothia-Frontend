/**
 * Exercise included in a prescription, with its dosage.
 *
 * @class PrescribedExercise
 */
export class PrescribedExercise {
    /**
     * @param {Object} params - Entity attributes.
     * @param {number} params.exerciseId - Identifier of the library exercise.
     * @param {string} [params.name=''] - Name shown in the plan.
     * @param {?number} [params.sets=null] - Number of sets.
     * @param {?number} [params.reps=null] - Repetitions per set.
     * @param {?number} [params.restSeconds=null] - Rest between sets, in seconds.
     */
    constructor({ exerciseId, name = '', sets = null, reps = null, restSeconds = null }) {
        this.exerciseId = exerciseId;
        this.name = name;
        this.sets = sets;
        this.reps = reps;
        this.restSeconds = restSeconds;
    }

    /** @returns {boolean} True when sets, reps and rest are all filled in. */
    get isComplete() {
        return [this.sets, this.reps, this.restSeconds].every(value => Number(value) > 0);
    }
}
