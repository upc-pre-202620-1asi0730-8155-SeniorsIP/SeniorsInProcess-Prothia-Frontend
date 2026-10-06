/**
 * MechanicalAlert entity: Recepción de alerta de mantenimiento requerido.
 *
 * @class MechanicalAlert
 */
export class MechanicalAlert {
    /**
     * @param {Object} [params={}]
     * @param {?number} [params.id=null]
     * @param {?number} [params.prosthesisId=null]
     * @param {string} [params.serialNumber=''] - e.g. 'PR-2025-TF-004'
     * @param {number} [params.cycles=0] - e.g. 814200
     * @param {number} [params.cycleLimit=800000] - Recommended threshold e.g. 800000
     * @param {string} [params.patientName=''] - e.g. 'Hugo Paredes'
     * @param {string} [params.kLevel='K2'] - e.g. 'K2'
     * @param {string} [params.component=''] - Component in risk
     * @param {string} [params.description=''] - Critical warning description
     * @param {'critical'|'warning'} [params.severity='critical']
     * @param {'pending'|'scheduled'|'resolved'} [params.status='pending']
     * @param {string} [params.occurredAt='']
     */
    constructor({
                    id = null,
                    prosthesisId = null,
                    serialNumber = '',
                    cycles = 0,
                    cycleLimit = 800000,
                    patientName = '',
                    kLevel = 'K2',
                    component = 'Amortiguador hidráulico de rodilla',
                    description = '',
                    severity = 'critical',
                    status = 'pending',
                    occurredAt = ''
                } = {}) {
        this.id = id;
        this.prosthesisId = prosthesisId;
        this.serialNumber = serialNumber;
        this.cycles = cycles;
        this.cycleLimit = cycleLimit;
        this.patientName = patientName;
        this.kLevel = kLevel;
        this.component = component;
        this.description = description;
        this.severity = severity;
        this.status = status;
        this.occurredAt = occurredAt;
    }

    /** Formatted cycle string, e.g. '814,200 Ciclos' */
    get formattedCycles() {
        return `${Number(this.cycles).toLocaleString()} Ciclos`;
    }

    /** Patient label with K-level, e.g. 'Paciente: Hugo Paredes (K2)' */
    get patientLabel() {
        return `Paciente: ${this.patientName} (${this.kLevel})`;
    }
}
