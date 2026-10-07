import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const clinicalApiUrl     = import.meta.env.VITE_CLINICAL_API_URL || import.meta.env.VITE_PROTHIA_PLATFORM_API_URL;
const patientsEndpointPath = import.meta.env.VITE_PATIENTS_ENDPOINT_PATH || "/patients";

/**
 * Infrastructure gateway for Patients bounded-context endpoints.
 *
 * @class PatientsApi
 * @extends BaseApi
 */
export class PatientsApi extends BaseApi {
    /**
     * @type {BaseEndpoint}
     * @private
     */
    #patientsEndpoint;

    /** Creates the endpoint client for patients. */
    constructor() {
        super(clinicalApiUrl);
        this.#patientsEndpoint = new BaseEndpoint(this, patientsEndpointPath);
    }

    /** @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the patients' response. */
    getPatients() {
        return this.#patientsEndpoint.getAll();
    }

    /**
     * @param {number|string} id - Patient identifier.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the patient response.
     */
    getPatientById(id) {
        return this.#patientsEndpoint.getById(id);
    }

    /**
     * @param {Object} resource - Patient resource payload.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the created patient response.
     */
    createPatient(resource) {
        return this.#patientsEndpoint.create(resource);
    }
}
