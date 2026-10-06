import { defineStore } from "pinia";
import { ref } from "vue";
import { BillingApi } from "../infrastructure/billing-api.js";
import { ClinicSubscriptionAssembler } from "../infrastructure/clinic-subscription.assembler.js";
import { ElectronicInvoiceAssembler } from "../infrastructure/electronic-invoice.assembler.js";
import { ClinicSubscription } from "../domain/model/clinic-subscription.entity.js";

const billingApi = new BillingApi();

/**
 * Application service store for the Billing bounded context.
 * Coordinates institutional SaaS subscriptions, patient seat quotas and electronic invoicing.
 *
 * @module useBillingStore
 */
export const useBillingStore = defineStore('billing', () => {
    /** @type {import('vue').Ref<ClinicSubscription>} */
    const subscription = ref(new ClinicSubscription());
    /** @type {import('vue').Ref<import('../domain/model/electronic-invoice.entity.js').ElectronicInvoice[]>} */
    const invoices = ref([]);
    const subscriptionLoaded = ref(false);
    const invoicesLoaded = ref(false);
    const errors = ref([]);

    /**
     * Loads the institutional clinic subscription details from the backend.
     * @returns {Promise<void>}
     */
    async function fetchSubscription() {
        try {
            const response = await billingApi.getSubscription();
            subscription.value = ClinicSubscriptionAssembler.toEntityFromResource(response.data);
            subscriptionLoaded.value = true;
        } catch (error) {
            errors.value.push(error);
        }
    }

    /**
     * Loads the electronic tax invoices history.
     * @returns {Promise<void>}
     */
    async function fetchInvoices() {
        try {
            const response = await billingApi.getInvoices();
            invoices.value = ElectronicInvoiceAssembler.toEntitiesFromResponse(response);
            invoicesLoaded.value = true;
        } catch (error) {
            errors.value.push(error);
        }
    }

    /**
     * Upgrades the maximum patient quota capacity for the clinic.
     * @param {number} newCapacity - New quota limit (e.g. 100).
     * @returns {Promise<void>}
     */
    async function upgradeQuota(newCapacity = 100) {
        subscription.value.totalQuota = newCapacity;
        try {
            const payload = ClinicSubscriptionAssembler.toResourceFromEntity(subscription.value);
            await billingApi.updateSubscription(payload);
        } catch (error) {
            errors.value.push(error);
        }
    }

    /**
     * Updates the credit card details on file.
     * @param {Object} paymentMethod - Payment method object.
     * @returns {Promise<void>}
     */
    async function updatePaymentMethod(paymentMethod) {
        subscription.value.paymentMethod = paymentMethod;
        try {
            const payload = ClinicSubscriptionAssembler.toResourceFromEntity(subscription.value);
            await billingApi.updateSubscription(payload);
        } catch (error) {
            errors.value.push(error);
        }
    }

    return {
        subscription,
        invoices,
        subscriptionLoaded,
        invoicesLoaded,
        errors,
        fetchSubscription,
        fetchInvoices,
        upgradeQuota,
        updatePaymentMethod
    };
});

export default useBillingStore;
