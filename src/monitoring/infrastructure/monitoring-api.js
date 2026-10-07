import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";

const monitoringApiUrl       = import.meta.env.VITE_MONITORING_API_URL || import.meta.env.VITE_PROTHIA_PLATFORM_API_URL_2 || import.meta.env.VITE_PROTHIA_PLATFORM_API_URL;
const alertsEndpointPath     = import.meta.env.VITE_ALERTS_ENDPOINT_PATH || "/alerts";
const thresholdsEndpointPath = import.meta.env.VITE_THRESHOLDS_ENDPOINT_PATH || "/thresholds";

/**
 * Infrastructure gateway for Monitoring bounded-context endpoints.
 *
 * @class MonitoringApi
 * @extends BaseApi
 */
export class MonitoringApi extends BaseApi {
    /** @type {BaseEndpoint} @private */
    #alertsEndpoint;
    /** @type {BaseEndpoint} @private */
    #thresholdsEndpoint;

    /** Creates endpoint clients for alerts and thresholds. */
    constructor() {
        super(monitoringApiUrl);
        this.#alertsEndpoint = new BaseEndpoint(this, alertsEndpointPath);
        this.#thresholdsEndpoint = new BaseEndpoint(this, thresholdsEndpointPath);
    }

    /** @returns {Promise<import('axios').AxiosResponse>} Alerts response. */
    getAlerts() {
        return this.#alertsEndpoint.getAll();
    }

    /** @param {Object} resource - Alert payload (must include id). @returns {Promise<import('axios').AxiosResponse>} Updated alert. */
    updateAlert(resource) {
        return this.#alertsEndpoint.update(resource.id, resource);
    }

    /** @returns {Promise<import('axios').AxiosResponse>} Threshold profiles response. */
    getThresholdProfiles() {
        return this.#thresholdsEndpoint.getAll();
    }

    /** @param {Object} resource - Profile payload. @returns {Promise<import('axios').AxiosResponse>} Created profile. */
    createThresholdProfile(resource) {
        return this.#thresholdsEndpoint.create(resource);
    }

    /** @param {Object} resource - Profile payload (must include id). @returns {Promise<import('axios').AxiosResponse>} Updated profile. */
    updateThresholdProfile(resource) {
        return this.#thresholdsEndpoint.update(resource.id, resource);
    }
}
