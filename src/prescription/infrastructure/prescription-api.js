import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const exercisesEndpointPath     = import.meta.env.VITE_EXERCISES_ENDPOINT_PATH;
const prescriptionsEndpointPath = import.meta.env.VITE_PRESCRIPTIONS_ENDPOINT_PATH;

/**
 * Infrastructure gateway for Prescription bounded-context endpoints.
 *
 * @class PrescriptionApi
 * @extends BaseApi
 */
export class PrescriptionApi extends BaseApi {
    /** @type {BaseEndpoint} @private */
    #exercisesEndpoint;
    /** @type {BaseEndpoint} @private */
    #prescriptionsEndpoint;

    /** Creates endpoint clients for exercises and prescriptions. */
    constructor() {
        super();
        this.#exercisesEndpoint = new BaseEndpoint(this, exercisesEndpointPath);
        this.#prescriptionsEndpoint = new BaseEndpoint(this, prescriptionsEndpointPath);
    }

    /** @returns {Promise<import('axios').AxiosResponse>} Exercise library response. */
    getExercises() {
        return this.#exercisesEndpoint.getAll();
    }

    /** @returns {Promise<import('axios').AxiosResponse>} Prescriptions response. */
    getPrescriptions() {
        return this.#prescriptionsEndpoint.getAll();
    }

    /** @param {Object} resource - Prescription payload. @returns {Promise<import('axios').AxiosResponse>} Created prescription. */
    createPrescription(resource) {
        return this.#prescriptionsEndpoint.create(resource);
    }

    /** @param {Object} resource - Prescription payload (must include id). @returns {Promise<import('axios').AxiosResponse>} Updated prescription. */
    updatePrescription(resource) {
        return this.#prescriptionsEndpoint.update(resource.id, resource);
    }
}
