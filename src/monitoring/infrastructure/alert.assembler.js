import {Alert} from "../domain/model/alert.entity.js";

/**
 * Maps alert resources into domain entities.
 *
 * @class AlertAssembler
 */
export class AlertAssembler {
    /** @param {Object} resource - Alert resource. @returns {Alert} Alert entity. */
    static toEntityFromResource(resource) {
        return new Alert({...resource});
    }

    /**
     * Parses alert resources from a response, newest first.
     * @param {import('axios').AxiosResponse<Array<Object>|Object>} response - HTTP response with alert resources.
     * @returns {Alert[]} Alert entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['alerts'];

        return resources
            .map(resource => this.toEntityFromResource(resource))
            .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
    }
}
