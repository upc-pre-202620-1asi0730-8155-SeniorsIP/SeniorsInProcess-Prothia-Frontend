import { ElectronicInvoice } from "../domain/model/electronic-invoice.entity.js";

/**
 * Transforms ElectronicInvoice DTO resources into domain entities and vice versa.
 */
export class ElectronicInvoiceAssembler {
    /**
     * Converts a raw API resource into an ElectronicInvoice domain entity.
     * @param {Object} resource - Raw invoice resource.
     * @returns {ElectronicInvoice} Domain entity instance.
     */
    static toEntityFromResource(resource) {
        if (!resource) return new ElectronicInvoice();
        return new ElectronicInvoice({
            id: resource.id,
            invoiceNumber: resource.invoiceNumber,
            issueDate: resource.issueDate,
            concept: resource.concept,
            amount: resource.amount,
            currency: resource.currency || '$',
            status: resource.status,
            statusLabel: resource.statusLabel,
            downloadUrl: resource.downloadUrl
        });
    }

    /**
     * Transforms an Axios response containing an array of invoice resources.
     * @param {import('axios').AxiosResponse} response - Axios response.
     * @returns {ElectronicInvoice[]} Array of ElectronicInvoice entities.
     */
    static toEntitiesFromResponse(response) {
        if (!response || !Array.isArray(response.data)) return [];
        return response.data.map(item => this.toEntityFromResource(item));
    }
}
