import {BaseApi} from "../../shared/infrastructure/base-api.js";
import {BaseEndpoint} from "../../shared/infrastructure/base-endpoint.js";
import {ThresholdAssembler} from "./threshold.assembler.js";
import {GaitSessionAssembler} from "./gait-session.assembler.js";

const alertsEndpointPath = import.meta.env.VITE_ALERTS_ENDPOINT_PATH;
const thresholdsEndpointPath = import.meta.env.VITE_THRESHOLDS_ENDPOINT_PATH;
const gaitSessionsEndpointPath = import.meta.env.VITE_GAIT_SESSIONS_ENDPOINT_PATH || '/gait-sessions';

/**
 * Monitoring Bounded Context API client handling alerts, thresholds and gait sessions.
 *
 * @class MonitoringApi
 * @extends BaseApi
 */
export class MonitoringApi extends BaseApi {
    #alertsEndpoint;
    #thresholdsEndpoint;
    #gaitSessionsEndpoint;

    constructor() {
        super();
        this.#alertsEndpoint = new BaseEndpoint(this, alertsEndpointPath);
        this.#thresholdsEndpoint = new BaseEndpoint(this, thresholdsEndpointPath);
        this.#gaitSessionsEndpoint = new BaseEndpoint(this, gaitSessionsEndpointPath);
    }

    getAlerts() {
        return this.#alertsEndpoint.getAll();
    }

    resolveAlert(id) {
        return this.http.put(`${alertsEndpointPath}/${id}/resolve`);
    }

    getThresholdProfiles() {
        return this.#thresholdsEndpoint.getAll();
    }

    createThresholdProfile(profile) {
        return this.#thresholdsEndpoint.create(ThresholdAssembler.toCreateResourceFromEntity(profile));
    }

    updateThresholdProfile(profile) {
        return this.#thresholdsEndpoint.update(profile.id, ThresholdAssembler.toUpdateResourceFromEntity(profile));
    }

    getGaitSessions() {
        return this.#gaitSessionsEndpoint.getAll();
    }

    createGaitSession(session) {
        return this.#gaitSessionsEndpoint.create(GaitSessionAssembler.toResourceFromEntity(session));
    }
}
