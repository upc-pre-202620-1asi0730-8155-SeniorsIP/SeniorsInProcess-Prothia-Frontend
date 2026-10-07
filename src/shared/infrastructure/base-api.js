import axios from "axios";

// import {iamInterceptor} from "../../iam/infrastructure/iam.interceptor.js";

const defaultPlatformApi = import.meta.env.VITE_PROTHIA_PLATFORM_API_URL || import.meta.env.VITE_LEARNING_PLATFORM_API_URL;

/**
 * Shared infrastructure base class that configures the HTTP client.
 *
 * @class BaseApi
 */
export class BaseApi {
    /**
     * @private
     * Axios HTTP client instance
     * @type {import('axios').AxiosInstance}
     */
    #http;

    /**
     * Initializes the Axios HTTP client with the specified base URL or the default platform API URL.
     *
     * @param {string} [baseUrl] - Custom base URL for the HTTP client instance.
     */
    constructor(baseUrl = defaultPlatformApi) {
        this.#http = axios.create({
            baseURL: baseUrl,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        });
        // Add interceptors for request/response if needed
        // this.#http.interceptors.request.use(iamInterceptor);
    }

    /**
     * Returns the configured Axios HTTP client.
     * @returns {import('axios').AxiosInstance}
     */
    get http() {
        return this.#http;
    }

}
