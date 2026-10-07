import { BaseApi } from "../../shared/infrastructure/base-api.js";
import { BaseEndpoint } from "../../shared/infrastructure/base-endpoint.js";

const iamApiUrl = import.meta.env.VITE_IAM_API_URL || import.meta.env.VITE_PROTHIA_PLATFORM_API_URL_3 || import.meta.env.VITE_PROTHIA_PLATFORM_API_URL;
const messagesEndpointPath = import.meta.env.VITE_MESSAGES_ENDPOINT_PATH || "/messages";
const transmissionsEndpointPath = "/transmissions";

/**
 * Infrastructure API client for the Communication Bounded Context.
 * Manages HTTP communication for patient-specialist messaging channels and orthoprosthetic workshop coordination.
 *
 * @class CommunicationApi
 * @extends BaseApi
 */
export class CommunicationApi extends BaseApi {
    /**
     * @private
     * @type {BaseEndpoint}
     */
    #messagesEndpoint;
    /**
     * @private
     * @type {BaseEndpoint}
     */
    #transmissionsEndpoint;

    /**
     * Initializes the CommunicationApi client with its dedicated endpoints.
     */
    constructor() {
        super(iamApiUrl);
        this.#messagesEndpoint = new BaseEndpoint(this, messagesEndpointPath);
        this.#transmissionsEndpoint = new BaseEndpoint(this, transmissionsEndpointPath);
    }

    /**
     * Retrieves all clinical messages for the active conversation channel.
     *
     * @returns {Promise<import('axios').AxiosResponse>} Axios response containing message resources.
     */
    getMessages() {
        return this.#messagesEndpoint.getAll();
    }

    /**
     * Retrieves a specific clinical message by its identifier.
     *
     * @param {number|string} id - Message identifier.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getMessageById(id) {
        return this.#messagesEndpoint.getById(id);
    }

    /**
     * Sends a new clinical message into the consultation channel.
     *
     * @param {Object} resource - Raw message payload to transmit.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    sendMessage(resource) {
        return this.#messagesEndpoint.create(resource);
    }

    /**
     * Retrieves all clinical transmissions sent to orthoprosthetic workshops.
     *
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getTransmissions() {
        return this.#transmissionsEndpoint.getAll();
    }

    /**
     * Transmits a new clinical record to an orthoprosthetic workshop.
     *
     * @param {Object} resource - Transmission resource payload.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    createTransmission(resource) {
        return this.#transmissionsEndpoint.create(resource);
    }
}

