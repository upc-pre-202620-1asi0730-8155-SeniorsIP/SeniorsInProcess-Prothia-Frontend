import {Prescription} from "../domain/model/prescription.entity.js";

/**
 * Maps prescription resources into domain entities.
 *
 * @class PrescriptionAssembler
 */
export class PrescriptionAssembler {
    /** @param {Object} resource - Prescription resource. @returns {Prescription} Prescription entity. */
    static toEntityFromResource(resource) {
        return new Prescription({...resource});
    }

    /**
     * @param {import('axios').AxiosResponse<Array<Object>|Object>} response - HTTP response with prescription resources.
     * @returns {Prescription[]} Prescription entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['prescriptions'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
