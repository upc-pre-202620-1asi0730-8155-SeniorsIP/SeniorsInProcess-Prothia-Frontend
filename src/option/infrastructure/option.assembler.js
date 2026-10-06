import {Option} from "../domain/model/option.entity.js";

/**
 * Maps option resources into domain entities.
 *
 * @class OptionAssembler
 */
export class OptionAssembler {
    /**
     * @param {Object} resource - Option resource payload.
     * @returns {Option} Option entity.
     */
    static toEntityFromResource(resource) {
        return new Option({...resource});
    }

    /**
     * Parses option resources from a response and maps them into entities sorted by order.
     *
     * @param {import('axios').AxiosResponse<Array<Object>|Object>} response - HTTP response with option resources.
     * @returns {Option[]} Option entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['options'];

        return resources
            .map(resource => this.toEntityFromResource(resource))
            .sort((a, b) => a.order - b.order);
    }
}
