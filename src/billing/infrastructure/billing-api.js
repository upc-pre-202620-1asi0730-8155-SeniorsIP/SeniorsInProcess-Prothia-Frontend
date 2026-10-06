import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const subscriptionEndpointPath = "/clinicSubscription";
const invoicesEndpointPath = "/invoices";

/**
 * Infrastructure API client for the Billing Bounded Context.
 * Manages institutional subscriptions, quotas, and electronic invoices.
 *
 * @class BillingApi
 * @extends BaseApi
 */
export class BillingApi extends BaseApi {
    /** @type {BaseEndpoint} */
    #subscriptionEndpoint;
    /** @type {BaseEndpoint} */
    #invoicesEndpoint;

    constructor() {
        super();
        this.#subscriptionEndpoint = new BaseEndpoint(this, subscriptionEndpointPath);
        this.#invoicesEndpoint = new BaseEndpoint(this, invoicesEndpointPath);
    }

    /**
     * Retrieves current clinical subscription details.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getSubscription() {
        return this.http.get(subscriptionEndpointPath);
    }

    /**
     * Updates subscription settings or patient quota.
     * @param {Object} resource - Updated subscription resource.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    updateSubscription(resource) {
        return this.http.put(subscriptionEndpointPath, resource);
    }

    /**
     * Retrieves electronic invoices issued to the clinic.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getInvoices() {
        return this.#invoicesEndpoint.getAll();
    }
}
