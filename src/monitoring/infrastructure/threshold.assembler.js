import {ThresholdProfile} from "../domain/model/threshold-profile.entity.js";

/**
 * Maps threshold profile resources into domain entities.
 *
 * @class ThresholdAssembler
 */
export class ThresholdAssembler {
    /** @param {Object} resource - Profile resource. @returns {ThresholdProfile} Profile entity. */
    static toEntityFromResource(resource) {
        return new ThresholdProfile({...resource});
    }

    /**
     * @param {import('axios').AxiosResponse<Array<Object>|Object>} response - HTTP response with profile resources.
     * @returns {ThresholdProfile[]} Profile entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['thresholds'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
