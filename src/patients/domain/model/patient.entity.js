/**
 * Patient entity within the Patients bounded context.
 *
 * @class Patient
 */
export class Patient {
    /**
     * @param {Object} params - Entity attributes.
     * @param {?number} [params.id=null] - Patient identifier.
     * @param {string} [params.fullName=''] - Full name.
     * @param {string} [params.dni=''] - National identity document number.
     * @param {number} [params.age=0] - Age in years.
     * @param {string} [params.amputation=''] - Amputation level (e.g. 'Transtibial Der.').
     * @param {string} [params.kLevel=''] - Functional level, K1 to K4.
     * @param {string} [params.prosthesisCode=''] - Linked prosthesis identifier.
     * @param {number} [params.adherence=0] - Monthly adherence percentage.
     * @param {number} [params.symmetry=0] - Current gait symmetry percentage.
     * @param {'alert'|'critical'|'stable'} [params.status='stable'] - Clinical status.
     */
    constructor({ id = null, fullName = '', dni = '', age = 0, amputation = '', kLevel = '',
                    prosthesisCode = '', adherence = 0, symmetry = 0, status = 'stable' }) {
        this.id = id;
        this.fullName = fullName;
        this.dni = dni;
        this.age = age;
        this.amputation = amputation;
        this.kLevel = kLevel;
        this.prosthesisCode = prosthesisCode;
        this.adherence = adherence;
        this.symmetry = symmetry;
        this.status = status;
    }

    /** @returns {string} Label used by patient selectors, e.g. 'Carlos (Transtibial Der. - K3)'. */
    get selectLabel() {
        return `${this.fullName} (${this.amputation} - ${this.kLevel})`;
    }
}
