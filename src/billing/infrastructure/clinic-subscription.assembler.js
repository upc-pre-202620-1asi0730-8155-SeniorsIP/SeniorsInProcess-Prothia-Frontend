import { ClinicSubscription } from "../domain/model/clinic-subscription.entity.js";

/**
 * Transforms ClinicSubscription DTO resources into domain entities and vice versa.
 */
export class ClinicSubscriptionAssembler {
    /**
     * Converts a raw API resource into a ClinicSubscription domain entity.
     * @param {Object} resource - Raw data object from API.
     * @returns {ClinicSubscription} Domain entity instance.
     */
    static toEntityFromResource(resource) {
        if (!resource) return new ClinicSubscription();
        return new ClinicSubscription({
            planName: resource.planName,
            status: resource.status,
            planType: resource.planType,
            annualFee: resource.annualFee,
            monthlyEquivalent: resource.monthlyEquivalent,
            startDate: resource.startDate,
            renewalDate: resource.renewalDate,
            usedQuota: resource.usedQuota,
            totalQuota: resource.totalQuota,
            paymentMethod: resource.paymentMethod
        });
    }

    /**
     * Converts a domain entity into a serializable resource.
     * @param {ClinicSubscription} entity - Domain entity.
     * @returns {Object} Plain JavaScript object suitable for JSON transmission.
     */
    static toResourceFromEntity(entity) {
        return {
            planName: entity.planName,
            status: entity.status,
            planType: entity.planType,
            annualFee: entity.annualFee,
            monthlyEquivalent: entity.monthlyEquivalent,
            startDate: entity.startDate,
            renewalDate: entity.renewalDate,
            usedQuota: entity.usedQuota,
            totalQuota: entity.totalQuota,
            paymentMethod: entity.paymentMethod
        };
    }
}
