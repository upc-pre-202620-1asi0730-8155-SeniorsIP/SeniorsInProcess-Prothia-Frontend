/**
 * MaintenanceSchedule entity: Programación de mantenimiento preventivo.
 *
 * @class MaintenanceSchedule
 */
export class MaintenanceSchedule {
    /**
     * @param {Object} [params={}]
     * @param {?number} [params.id=null]
     * @param {string} [params.serialNumber=''] - e.g. 'PR-2025-TF-004'
     * @param {string} [params.patientName=''] - e.g. 'Hugo Paredes'
     * @param {string} [params.scheduledDate=''] - e.g. '08/10/2026'
     * @param {string} [params.interventionType=''] - e.g. 'Recambio de fluido y amortiguador'
     * @param {string} [params.technicianName=''] - e.g. 'Ing. Roberto Valdivia'
     * @param {'scheduled'|'completed'|'in_progress'} [params.status='scheduled']
     * @param {string} [params.notes='']
     */
    constructor({
                    id = null,
                    serialNumber = '',
                    patientName = '',
                    scheduledDate = '',
                    interventionType = '',
                    technicianName = 'Ing. Roberto Valdivia',
                    status = 'scheduled',
                    notes = ''
                } = {}) {
        this.id = id;
        this.serialNumber = serialNumber;
        this.patientName = patientName;
        this.scheduledDate = scheduledDate;
        this.interventionType = interventionType;
        this.technicianName = technicianName;
        this.status = status;
        this.notes = notes;
    }
}
