import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const reportsEndpointPath = "/reports";

/**
 * Infrastructure API client for the Analytics Bounded Context.
 * Manages consolidated clinical reports and telemetry export datasets.
 *
 * @class AnalyticsApi
 * @extends BaseApi
 */
export class AnalyticsApi extends BaseApi {
    /** @type {BaseEndpoint} */
    #reportsEndpoint;

    constructor() {
        super();
        this.#reportsEndpoint = new BaseEndpoint(this, reportsEndpointPath);
    }

    /**
     * Retrieves all clinical reports.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getReports() {
        return this.#reportsEndpoint.getAll();
    }

    /**
     * Retrieves a specific clinical report by identifier.
     * @param {number|string} id - Report identifier.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getReportById(id) {
        return this.#reportsEndpoint.getById(id);
    }
}
