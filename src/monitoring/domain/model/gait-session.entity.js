/**
 * GaitSession entity representing a recorded biomechanical walking session.
 * Part of the Monitoring Bounded Context.
 *
 * @class GaitSession
 */
export class GaitSession {
    /**
     * @param {Object} [params={}] - Initialization parameters.
     * @param {?number} [params.id=null] - Unique session identifier.
     * @param {string} [params.datetime=''] - Date and time of session recording.
     * @param {string} [params.duration=''] - Formatted duration string e.g. '24 min'.
     * @param {string|number} [params.steps=0] - Total step count accumulated.
     * @param {string} [params.cadence=''] - Average cadence e.g. '88 pasos/min'.
     * @param {string} [params.symmetry=''] - Symmetry percentage and clinical grade.
     * @param {'green'|'teal'|'yellow'|'orange'|'red'} [params.symmetryType='green'] - Visual tone indicator.
     * @param {string} [params.alerts='0 incidentes'] - Alert count or summary.
     * @param {'green'|'yellow'|'orange'|'red'} [params.alertType='green'] - Alert severity tone.
     * @param {string} [params.impact='620 N'] - Average heel strike impact force.
     */
    constructor({
        id = null,
        datetime = '',
        duration = '',
        steps = 0,
        cadence = '',
        symmetry = '',
        symmetryType = 'green',
        alerts = '0 incidentes',
        alertType = 'green',
        impact = '620 N'
    } = {}) {
        this.id = id;
        this.datetime = datetime;
        this.duration = duration;
        this.steps = steps;
        this.cadence = cadence;
        this.symmetry = symmetry;
        this.symmetryType = symmetryType;
        this.alerts = alerts;
        this.alertType = alertType;
        this.impact = impact;
    }
}
