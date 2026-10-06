/**
 * Represents a formal clinical and biomechanical report issued for an amputee patient.
 *
 * @class ClinicalReport
 */
export class ClinicalReport {
    /**
     * @param {Object} params - Initialization parameters.
     * @param {number} [params.id=0] - Report identifier.
     * @param {string} [params.reportCode=''] - Clinical file code (e.g. EXP-CLIN-2026-084).
     * @param {string} [params.issueDate=''] - Emission date.
     * @param {string} [params.clinicName=''] - Emitting healthcare center name.
     * @param {string} [params.clinicUnit=''] - Specialized department and tax registry.
     * @param {number} [params.patientId=0] - Linked patient identifier.
     * @param {string} [params.patientName=''] - Patient full name.
     * @param {string} [params.dni=''] - Patient National Identification Number.
     * @param {number} [params.age=0] - Patient age in years.
     * @param {string} [params.diagnosis=''] - Clinical diagnosis and amputation level.
     * @param {string} [params.prosthesisCode=''] - Associated prosthesis serial code.
     * @param {string} [params.evaluationPeriod=''] - Assessed time window.
     * @param {string} [params.summary=''] - Executive clinical adherence & biomechanical summary.
     * @param {Array<Object>} [params.indicators=[]] - Quantitative gait kinematic indicators.
     * @param {string} [params.medicalRecommendation=''] - Prescribed follow-up recommendations.
     * @param {string} [params.therapistName=''] - Certifying physiotherapist name.
     * @param {string} [params.therapistRole=''] - Professional title.
     * @param {string} [params.therapistRegistry=''] - Medical college registration code.
     */
    constructor({
                    id = 0,
                    reportCode = 'EXP-CLIN-2026-084',
                    issueDate = '12/09/2026',
                    clinicName = 'CENTRO DE REHABILITACIÓN FÍSICA LIMA SUR',
                    clinicUnit = 'Unidad de Biomecánica y Rehabilitación Protésica • RUC 20608945123',
                    patientId = 1,
                    patientName = 'Carlos Mendoza Arias',
                    dni = '45892104',
                    age = 38,
                    diagnosis = 'Transtibial Derecho (K3)',
                    prosthesisCode = 'PR-2026-TT-084',
                    evaluationPeriod = 'Último Mes (12/08/2026 - 12/09/2026)',
                    summary = '',
                    indicators = [],
                    medicalRecommendation = '',
                    therapistName = 'Lic. Diego Salazar Mendoza',
                    therapistRole = 'Tecnólogo Médico - Fisioterapeuta',
                    therapistRegistry = 'CTMP 14820'
                } = {}) {
        this.id = id;
        this.reportCode = reportCode;
        this.issueDate = issueDate;
        this.clinicName = clinicName;
        this.clinicUnit = clinicUnit;
        this.patientId = patientId;
        this.patientName = patientName;
        this.dni = dni;
        this.age = age;
        this.diagnosis = diagnosis;
        this.prosthesisCode = prosthesisCode;
        this.evaluationPeriod = evaluationPeriod;
        this.summary = summary;
        this.indicators = indicators;
        this.medicalRecommendation = medicalRecommendation;
        this.therapistName = therapistName;
        this.therapistRole = therapistRole;
        this.therapistRegistry = therapistRegistry;
    }

    /**
     * Converts quantitative gait indicators into CSV data rows.
     * @returns {string} Formatted CSV string.
     */
    toCsvData() {
        const headers = ["Indicador Biomecánico", "Valor Obtenido", "Rango de Normalidad", "Evaluación Clínica"];
        const rows = this.indicators.map(ind => [
            `"${ind.name}"`,
            `"${ind.value}"`,
            `"${ind.normalRange}"`,
            `"${ind.evaluation}"`
        ]);
        return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }
}
