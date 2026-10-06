import {Patient} from "../domain/model/patient.entity.js";

/**
 * Maps patient resources into domain entities.
 *
 * @class PatientAssembler
 */
export class PatientAssembler {
    /**
     * @param {Object} resource - Patient resource payload.
     * @returns {Patient} Patient entity.
     */
    static toEntityFromResource(resource) {
        return new Patient({...resource});
    }

    /**
     * @param {import('axios').AxiosResponse<Array<Object>|Object>} response - HTTP response with patient resources.
     * @returns {Patient[]} Patient entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['patients'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
