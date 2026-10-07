import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const optionsEndpointPath = import.meta.env.VITE_OPTIONS_ENDPOINT_PATH;

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
        super();
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
