import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const prosthesesEndpointPath = import.meta.env.VITE_PROSTHESES_ENDPOINT_PATH || "/prostheses";
const mechanicalAlertsEndpointPath = import.meta.env.VITE_MECHANICAL_ALERTS_ENDPOINT_PATH || "/mechanicalAlerts";
const maintenancesEndpointPath = import.meta.env.VITE_MAINTENANCES_ENDPOINT_PATH || "/maintenanceSchedules";

/**
 * Infrastructure gateway for Workshop / Profiles & Asset bounded-context endpoints.
 *
 * @class WorkshopApi
 * @extends BaseApi
 */
export class WorkshopApi extends BaseApi {
    /** @type {BaseEndpoint} */
    #prosthesesEndpoint;
    /** @type {BaseEndpoint} */
    #mechanicalAlertsEndpoint;
    /** @type {BaseEndpoint} */
    #maintenancesEndpoint;

    constructor() {
        super();
        this.#prosthesesEndpoint = new BaseEndpoint(this, prosthesesEndpointPath);
        this.#mechanicalAlertsEndpoint = new BaseEndpoint(this, mechanicalAlertsEndpointPath);
        this.#maintenancesEndpoint = new BaseEndpoint(this, maintenancesEndpointPath);
    }

    getProstheses() {
        return this.#prosthesesEndpoint.getAll();
    }

    getProsthesisById(id) {
        return this.#prosthesesEndpoint.getById(id);
    }

    createProsthesis(resource) {
        return this.#prosthesesEndpoint.create(resource);
    }

    getMechanicalAlerts() {
        return this.#mechanicalAlertsEndpoint.getAll();
    }

    getMaintenances() {
        return this.#maintenancesEndpoint.getAll();
    }

    createMaintenance(resource) {
        return this.#maintenancesEndpoint.create(resource);
    }
}
