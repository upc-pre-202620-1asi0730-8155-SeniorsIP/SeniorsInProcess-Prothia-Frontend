import {Exercise} from "../domain/model/exercise.entity.js";

/**
 * Maps exercise resources into domain entities.
 *
 * @class ExerciseAssembler
 */
export class ExerciseAssembler {
    /** @param {Object} resource - Exercise resource. @returns {Exercise} Exercise entity. */
    static toEntityFromResource(resource) {
        return new Exercise({...resource});
    }

    /**
     * @param {import('axios').AxiosResponse<Array<Object>|Object>} response - HTTP response with exercise resources.
     * @returns {Exercise[]} Exercise entities.
     */
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.statusText}`);
            return [];
        }
        let resources = response.data instanceof Array ? response.data : response.data['exercises'];

        return resources.map(resource => this.toEntityFromResource(resource));
    }
}
