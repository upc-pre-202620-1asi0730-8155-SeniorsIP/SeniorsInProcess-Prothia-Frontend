import { defineStore } from "pinia";
import { ref } from "vue";
import { AnalyticsApi } from "../infrastructure/analytics-api.js";
import { ClinicalReportAssembler } from "../infrastructure/clinical-report.assembler.js";
import { ClinicalReport } from "../domain/model/clinical-report.entity.js";

const analyticsApi = new AnalyticsApi();

/**
 * Application service store for the Analytics bounded context.
 * Coordinates consolidated biomechanical clinical reports and data exports.
 *
 * @module useAnalyticsStore
 */
export const useAnalyticsStore = defineStore('analytics', () => {
    /** @type {import('vue').Ref<ClinicalReport[]>} */
    const reports = ref([]);
    /** @type {import('vue').Ref<ClinicalReport>} */
    const activeReport = ref(new ClinicalReport());
    const reportsLoaded = ref(false);
    const errors = ref([]);

    /**
     * Loads clinical reports from the backend.
     * @returns {Promise<void>}
     */
    async function fetchReports() {
        try {
            const response = await analyticsApi.getReports();
            reports.value = ClinicalReportAssembler.toEntitiesFromResponse(response);
            if (reports.value.length > 0) {
                activeReport.value = reports.value[0];
            }
            reportsLoaded.value = true;
        } catch (error) {
            errors.value.push(error);
        }
    }

    /**
     * Sets the active report based on selected patient identifier.
     * @param {number|string} patientId - Patient identifier.
     */
    function selectPatientReport(patientId) {
        const idNum = Number(patientId);
        const found = reports.value.find(r => r.patientId === idNum);
        if (found) {
            activeReport.value = found;
        } else {
            activeReport.value = new ClinicalReport({
                id: idNum,
                patientId: idNum,
                reportCode: `EXP-CLIN-2026-08${idNum}`,
                issueDate: new Date().toLocaleDateString('es-PE'),
                patientName: `Paciente #${idNum}`,
                summary: `Sesión de reporte clínico dinámico para el paciente #${idNum}. Registro de marcha en proceso de estabilización.`,
                indicators: [
                    { name: 'Cadencia Media de Paso', value: '96 pasos/min', normalRange: '90 - 105 pasos/min', evaluation: 'Normal / Fluido', status: 'normal' },
                    { name: 'Simetría Bilateral de Carga', value: '91.5%', normalRange: '> 90.0%', evaluation: 'Adecuado', status: 'normal' },
                    { name: 'Ángulo de Flexión de Rodilla', value: '57°', normalRange: '55° - 65°', evaluation: 'Rango anatómico', status: 'normal' },
                    { name: 'Inclinación Lateral de Tronco', value: '11°', normalRange: '< 12°', evaluation: 'Estable', status: 'normal' }
                ],
                medicalRecommendation: 'Continuar con el régimen de ejercicios domiciliarios y seguimiento bimensual.'
            });
        }
    }

    /**
     * Exports the active clinical report indicators into a downloadable CSV file.
     * @param {ClinicalReport} [report] - Optional report to export, defaults to activeReport.
     */
    function exportCsv(report = activeReport.value) {
        const csvContent = report.toCsvData();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `reporte_${report.reportCode}_${report.patientName.replace(/\s+/g, '_')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Triggers the system print dialog for clinical report PDF generation.
     */
    function triggerPrint() {
        window.print();
    }

    return {
        reports,
        activeReport,
        reportsLoaded,
        errors,
        fetchReports,
        selectPatientReport,
        exportCsv,
        triggerPrint
    };
});

export default useAnalyticsStore;
