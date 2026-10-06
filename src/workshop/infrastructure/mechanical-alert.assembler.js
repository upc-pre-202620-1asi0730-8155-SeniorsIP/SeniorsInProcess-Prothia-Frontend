import { MechanicalAlert } from "../domain/model/mechanical-alert.entity.js";

/**
 * Maps mechanical alert resources into domain entities.
 *
 * @class MechanicalAlertAssembler
 */
export class MechanicalAlertAssembler {
    /**
     * @param {Object} resource
     * @returns {MechanicalAlert}
     */
    static toEntityFromResource(resource) {
        return new MechanicalAlert({ ...resource });
    }

    /**
     * @param {import('axios').AxiosResponse<Array<Object>|Object>} response
     * @returns {MechanicalAlert[]}
     */
    static toEntitiesFromResponse(response) {
        if (!response || response.status !== 200) {
            return [];
        }
        const resources = Array.isArray(response.data) ? response.data : (response.data['mechanicalAlerts'] || []);
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
