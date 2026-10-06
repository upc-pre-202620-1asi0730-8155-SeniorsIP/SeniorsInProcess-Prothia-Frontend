import { GaitSession } from "../domain/model/gait-session.entity.js";

/**
 * Assembler transforming raw telemetry session resources into GaitSession domain entities.
 * Part of the Monitoring Bounded Context.
 *
 * @class GaitSessionAssembler
 */
export class GaitSessionAssembler {
    /**
     * Converts a single raw session resource into a domain entity.
     *
     * @static
     * @param {Object} resource - Raw data object.
     * @returns {GaitSession} Instantiated GaitSession entity.
     */
    static toEntityFromResource(resource) {
        if (!resource) return new GaitSession();
        return new GaitSession({
            id: resource.id,
            datetime: resource.datetime,
            duration: resource.duration,
            steps: resource.steps,
            cadence: resource.cadence,
            symmetry: resource.symmetry,
            symmetryType: resource.symmetryType || 'green',
            alerts: resource.alerts || '0 incidentes',
            alertType: resource.alertType || 'green',
            impact: resource.impact || '620 N'
        });
    }

    /**
     * Converts an array of session resources from an HTTP response.
     *
     * @static
     * @param {Object} response - Axios HTTP response.
     * @returns {GaitSession[]} Array of GaitSession instances.
     */
    static toEntitiesFromResponse(response) {
        if (!response || !Array.isArray(response.data)) {
            return [];
        }
        return response.data.map(item => this.toEntityFromResource(item));
    }
}
