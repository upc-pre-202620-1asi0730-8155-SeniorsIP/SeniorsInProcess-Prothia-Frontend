/**
 * Prosthesis entity within the Profiles & Asset Management / Workshop bounded context.
 *
 * @class Prosthesis
 */
export class Prosthesis {
    /**
     * @param {Object} [params={}]
     * @param {?number} [params.id=null]
     * @param {string} [params.serialNumber=''] - N° de Serie (e.g. 'PR-2026-TT-084')
     * @param {string} [params.type=''] - Tipo & Componente (e.g. 'Transtibial Carbono')
     * @param {string} [params.patientName=''] - Paciente Asociado (e.g. 'Carlos Mendoza Arias')
     * @param {string} [params.clinicName=''] - Clínica Vinculada (e.g. 'Rehab Lima Sur')
     * @param {number} [params.accumulatedCycles=0] - Ciclos Acumulados (e.g. 342100)
     * @param {number} [params.cycleLimit=800000] - Umbral preventivo (e.g. 800000)
     * @param {string} [params.lastService=''] - Fecha y tipo de servicio (e.g. '15/05/2026 (Encaje)')
     * @param {'optimal'|'warning'|'critical'} [params.status='optimal'] - Estado de fatiga
     * @param {number} [params.batteryLevel=85] - Nivel de batería telemetría
     * @param {'online'|'offline'} [params.sensorStatus='online'] - Estado de telemetría IoT
     * @param {string} [params.kLevel='K3'] - Functional K-level
     * @param {string} [params.socketType='Fibra de Carbono'] - Tipo de encaje
     * @param {string} [params.kneeType='N/A'] - Tipo de rodilla
     * @param {string} [params.footType='Pie de respuesta dinámica'] - Tipo de pie
     */
    constructor({
                    id = null,
                    serialNumber = '',
                    type = '',
                    patientName = '',
                    clinicName = '',
                    accumulatedCycles = 0,
                    cycleLimit = 800000,
                    lastService = '',
                    status = 'optimal',
                    batteryLevel = 85,
                    sensorStatus = 'online',
                    kLevel = 'K3',
                    socketType = 'Fibra de Carbono',
                    kneeType = 'N/A',
                    footType = 'Pie de respuesta dinámica'
                } = {}) {
        this.id = id;
        this.serialNumber = serialNumber;
        this.type = type;
        this.patientName = patientName;
        this.clinicName = clinicName;
        this.accumulatedCycles = accumulatedCycles;
        this.cycleLimit = cycleLimit;
        this.lastService = lastService;
        this.status = status;
        this.batteryLevel = batteryLevel;
        this.sensorStatus = sensorStatus;
        this.kLevel = kLevel;
        this.socketType = socketType;
        this.kneeType = kneeType;
        this.footType = footType;
    }

    /** Formats cycles with thousand separators and threshold, e.g. '342,100 / 800k' */
    get formattedCycles() {
        const kLimit = this.cycleLimit >= 1000 ? `${Math.round(this.cycleLimit / 1000)}k` : `${this.cycleLimit}`;
        return `${Number(this.accumulatedCycles).toLocaleString()} / ${kLimit}`;
    }

    /** Percentage of cycle limit reached */
    get wearPercentage() {
        return Math.min(100, Math.round((this.accumulatedCycles / this.cycleLimit) * 100));
    }
}
