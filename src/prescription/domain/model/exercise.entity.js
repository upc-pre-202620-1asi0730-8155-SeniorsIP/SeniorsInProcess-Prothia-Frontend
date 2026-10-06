/**
 * Exercise from the therapeutic library, within the Prescription bounded context.
 *
 * @class Exercise
 */
export class Exercise {
    /**
     * @param {Object} params - Entity attributes.
     * @param {?number} [params.id=null] - Exercise identifier.
     * @param {string} [params.name=''] - Exercise name.
     * @param {string[]} [params.focus=[]] - Therapeutic focus tags (e.g. 'Equilibrio').
     */
    constructor({ id = null, name = '', focus = [] }) {
        this.id = id;
        this.name = name;
        this.focus = focus;
    }
}
