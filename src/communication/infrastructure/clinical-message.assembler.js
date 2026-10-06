import { ClinicalMessage } from "../domain/model/clinical-message.entity.js";

/**
 * Assembler responsible for transforming raw message resources into ClinicalMessage domain entities.
 * Part of the Communication Bounded Context.
 *
 * @class ClinicalMessageAssembler
 */
export class ClinicalMessageAssembler {
    /**
     * Converts a single raw message resource into a domain entity.
     *
     * @static
     * @param {Object} resource - Raw resource from the communication endpoint.
     * @returns {ClinicalMessage} Instantiated ClinicalMessage entity.
     */
    static toEntityFromResource(resource) {
        if (!resource) return new ClinicalMessage();
        return new ClinicalMessage({
            id: resource.id,
            sender: resource.sender,
            senderName: resource.senderName,
            senderRole: resource.senderRole,
            text: resource.text,
            timestamp: resource.timestamp,
            isSystem: resource.isSystem,
            status: resource.status || 'delivered'
        });
    }

    /**
     * Converts an array of raw message resources into an array of domain entities.
     *
     * @static
     * @param {Object} response - Axios HTTP response object containing an array of message resources.
     * @returns {ClinicalMessage[]} Array of ClinicalMessage entity instances.
     */
    static toEntitiesFromResponse(response) {
        if (!response || !Array.isArray(response.data)) {
            return [];
        }
        return response.data.map(resource => this.toEntityFromResource(resource));
    }

    /**
     * Transforms a ClinicalMessage entity or parameters into a transport DTO.
     *
     * @static
     * @param {ClinicalMessage|Object} message - Entity or message object.
     * @returns {Object} JSON payload ready for transmission.
     */
    static toResourceFromEntity(message) {
        return {
            id: message.id,
            sender: message.sender,
            senderName: message.senderName,
            senderRole: message.senderRole,
            text: message.text,
            timestamp: message.timestamp,
            isSystem: Boolean(message.isSystem),
            status: message.status || 'delivered'
        };
    }
}
