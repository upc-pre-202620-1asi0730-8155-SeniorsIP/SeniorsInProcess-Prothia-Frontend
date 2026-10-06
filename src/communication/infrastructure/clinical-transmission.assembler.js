import { ClinicalTransmission } from "../domain/model/clinical-transmission.entity.js";

/**
 * Transforms ClinicalTransmission resources into domain entities and vice versa.
 */
export class ClinicalTransmissionAssembler {
    /**
     * Converts a raw transmission resource into a domain entity.
     * @param {Object} resource - Raw data object.
     * @returns {ClinicalTransmission} Entity instance.
     */
    static toEntityFromResource(resource) {
        if (!resource) return new ClinicalTransmission();
        return new ClinicalTransmission({
            id: resource.id,
            patientId: resource.patientId,
            patientName: resource.patientName,
            patientDni: resource.patientDni,
            workshopName: resource.workshopName,
            sharedModules: resource.sharedModules || [],
            technicalNotes: resource.technicalNotes,
            status: resource.status,
            statusLabel: resource.statusLabel,
            summary: resource.summary,
            createdAt: resource.createdAt
        });
    }

    /**
     * Converts a domain entity into a serializable resource.
     * @param {ClinicalTransmission} entity - Domain entity.
     * @returns {Object} JSON payload.
     */
    static toResourceFromEntity(entity) {
        return {
            id: entity.id,
            patientId: entity.patientId,
            patientName: entity.patientName,
            patientDni: entity.patientDni,
            workshopName: entity.workshopName,
            sharedModules: entity.sharedModules,
            technicalNotes: entity.technicalNotes,
            status: entity.status,
            statusLabel: entity.statusLabel,
            summary: entity.summary,
            createdAt: entity.createdAt
        };
    }

    /**
     * Transforms an Axios response containing an array of transmission resources.
     * @param {import('axios').AxiosResponse} response - Axios response.
     * @returns {ClinicalTransmission[]} Array of entities.
     */
    static toEntitiesFromResponse(response) {
        if (!response || !Array.isArray(response.data)) return [];
        return response.data.map(item => this.toEntityFromResource(item));
    }
}
