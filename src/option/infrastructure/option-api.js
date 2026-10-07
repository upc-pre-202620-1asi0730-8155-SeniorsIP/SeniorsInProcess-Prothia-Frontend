import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const monitoringApiUrl    = import.meta.env.VITE_MONITORING_API_URL || import.meta.env.VITE_PROTHIA_PLATFORM_API_URL_2 || import.meta.env.VITE_PROTHIA_PLATFORM_API_URL;
const optionsEndpointPath = import.meta.env.VITE_OPTIONS_ENDPOINT_PATH || "/options";

/**
 * Infrastructure gateway for Option bounded-context endpoints.
 *
 * @class OptionApi
 * @extends BaseApi
 */
export class OptionApi extends BaseApi {
    /**
     * @type {BaseEndpoint}
     * @private
     */
    #optionsEndpoint;

    /** Creates the endpoint client for options. */
    constructor() {
        super(monitoringApiUrl);
        this.#optionsEndpoint = new BaseEndpoint(this, optionsEndpointPath);
    }

    /**
     * Fetches all navigation options.
     * @returns {Promise<import('axios').AxiosResponse>} Promise resolving to the options' response.
     */
    getOptions() {
        return this.#optionsEndpoint.getAll();
    }
}
