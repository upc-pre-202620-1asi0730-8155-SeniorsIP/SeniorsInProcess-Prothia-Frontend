/**
 * Represents a formal clinical transmission of biomechanical data sent to an orthoprosthetic workshop.
 *
 * @class ClinicalTransmission
 */
export class ClinicalTransmission {
    /**
     * @param {Object} params - Initialization parameters.
     * @param {number} [params.id=0] - Transmission identifier.
     * @param {number} [params.patientId=1] - Patient identifier.
     * @param {string} [params.patientName=''] - Patient full name.
     * @param {string} [params.patientDni=''] - Patient National Identification Number.
     * @param {string} [params.workshopName=''] - Recipient orthoprosthetic center.
     * @param {Array<string>} [params.sharedModules=[]] - List of authorized data modules.
     * @param {string} [params.technicalNotes=''] - Clinical observations for the prosthetist.
     * @param {string} [params.status='confirmed'] - Transmission status ('confirmed', 'pending').
     * @param {string} [params.statusLabel='Recibido y Confirmado por Taller'] - Human-readable status label.
     * @param {string} [params.summary=''] - Brief description of transmitted record.
     * @param {string} [params.createdAt=''] - Transmission date.
     */
    constructor({
                    id = 0,
                    patientId = 1,
                    patientName = 'Carlos Mendoza Arias',
                    patientDni = '45892104',
                    workshopName = 'Ortopedia Avanzada S.A.C. (Ing. Roberto Valdivia)',
                    sharedModules = [],
                    technicalNotes = '',
                    status = 'confirmed',
                    statusLabel = 'Recibido y Confirmado por Taller',
                    summary = '',
                    createdAt = new Date().toLocaleDateString('es-PE')
                } = {}) {
        this.id = id;
        this.patientId = patientId;
        this.patientName = patientName;
        this.patientDni = patientDni;
        this.workshopName = workshopName;
        this.sharedModules = sharedModules;
        this.technicalNotes = technicalNotes;
        this.status = status;
        this.statusLabel = statusLabel;
        this.summary = summary;
        this.createdAt = createdAt;
    }

    /**
     * Checks if the transmission has been acknowledged by the orthoprosthetist.
     * @returns {boolean} True if confirmed.
     */
    get isConfirmed() {
        return this.status === 'confirmed';
    }
}
