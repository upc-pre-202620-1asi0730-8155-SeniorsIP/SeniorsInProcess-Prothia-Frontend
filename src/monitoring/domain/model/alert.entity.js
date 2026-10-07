/**
 * Clinical alert raised by the biomechanical processing engine, within the Monitoring bounded context.
 *
 * @class Alert
 */
export class Alert {
    /**
     * @param {Object} params - Entity attributes.
     * @param {?number} [params.id=null] - Alert identifier.
     * @param {?number} [params.patientId=null] - Patient who triggered the alert.
     * @param {string} [params.patientName=''] - Short patient name.
     * @param {string} [params.deviationType=''] - Kind of deviation (e.g. 'Inclinación Pélvica Lateral').
     * @param {string} [params.recordedValue=''] - Value measured, with unit (e.g. '+14°').
     * @param {string} [params.threshold=''] - Threshold that was crossed (e.g. '>12°').
     * @param {'warning'|'critical'} [params.severity='warning'] - Severity.
     * @param {'pending'|'resolved'} [params.status='pending'] - Resolution status.
     * @param {string} [params.occurredAt=''] - ISO date-time of the event.
     */
    constructor({ id = null, patientId = null, patientName = '', deviationType = '', recordedValue = '',
                    threshold = '', severity = 'warning', status = 'pending', occurredAt = '' }) {
        this.id = id;
        this.patientId = patientId;
        this.patientName = patientName;
        this.deviationType = deviationType;
        this.recordedValue = recordedValue;
        this.threshold = threshold;
        this.severity = severity;
        this.status = status;
        this.occurredAt = occurredAt;
    }

    /** @returns {boolean} True while the alert awaits resolution. */
    get isPending() {
        return this.status === 'pending';
    }
}
