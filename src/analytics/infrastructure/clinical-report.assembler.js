import { ClinicalReport } from "../domain/model/clinical-report.entity.js";

/**
 * Transforms ClinicalReport API resources into domain entities.
 */
export class ClinicalReportAssembler {
    /**
     * Converts a raw report resource into a ClinicalReport entity.
     * @param {Object} resource - Raw data object.
     * @returns {ClinicalReport} Domain entity instance.
     */
    static toEntityFromResource(resource) {
        if (!resource) return new ClinicalReport();
        return new ClinicalReport({
            id: resource.id,
            reportCode: resource.reportCode,
            issueDate: resource.issueDate,
            clinicName: resource.clinicName,
            clinicUnit: resource.clinicUnit,
            patientId: resource.patientId,
            patientName: resource.patientName,
            dni: resource.dni,
            age: resource.age,
            diagnosis: resource.diagnosis,
            prosthesisCode: resource.prosthesisCode,
            evaluationPeriod: resource.evaluationPeriod,
            summary: resource.summary,
            indicators: resource.indicators || [],
            medicalRecommendation: resource.medicalRecommendation,
            therapistName: resource.therapistName,
            therapistRole: resource.therapistRole,
            therapistRegistry: resource.therapistRegistry
        });
    }

    /**
     * Transforms an Axios response containing an array of report resources.
     * @param {import('axios').AxiosResponse} response - Axios response.
     * @returns {ClinicalReport[]} Array of entities.
     */
    static toEntitiesFromResponse(response) {
        if (!response || !Array.isArray(response.data)) return [];
        return response.data.map(item => this.toEntityFromResource(item));
    }

    static toResourceFromEntity(entity) {
        return {
            reportCode: entity.reportCode,
            issueDate: entity.issueDate,
            clinicName: entity.clinicName,
            clinicUnit: entity.clinicUnit,
            patientId: Number(entity.patientId),
            patientName: entity.patientName,
            dni: entity.dni,
            age: Number(entity.age),
            diagnosis: entity.diagnosis,
            prosthesisCode: entity.prosthesisCode,
            evaluationPeriod: entity.evaluationPeriod,
            summary: entity.summary,
            indicators: (entity.indicators || []).map(ind => ({
                name: ind.name,
                value: ind.value,
                normalRange: ind.normalRange,
                evaluation: ind.evaluation,
                status: ind.status || 'normal'
            })),
            medicalRecommendation: entity.medicalRecommendation,
            therapistName: entity.therapistName,
            therapistRole: entity.therapistRole,
            therapistRegistry: entity.therapistRegistry
        };
    }
}
