import { Prosthesis } from "../domain/model/prosthesis.entity.js";

/**
 * Maps prosthesis resources into domain entities.
 *
 * @class ProsthesisAssembler
 */
export class ProsthesisAssembler {
    /**
     * @param {Object} resource
     * @returns {Prosthesis}
     */
    static toEntityFromResource(resource) {
        return new Prosthesis({ ...resource });
    }

    /**
     * @param {import('axios').AxiosResponse<Array<Object>|Object>} response
     * @returns {Prosthesis[]}
     */
    static toEntitiesFromResponse(response) {
        if (!response || response.status !== 200) {
            return [];
        }
        const resources = Array.isArray(response.data) ? response.data : (response.data['prostheses'] || []);
        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
