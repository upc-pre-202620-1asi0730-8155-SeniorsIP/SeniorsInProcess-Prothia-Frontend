import {ClinicSubscription} from "../domain/model/clinic-subscription.entity.js";

/**
 * Assembler for converting between ClinicSubscription entities and API resources.
 *
 * @class ClinicSubscriptionAssembler
 */
export class ClinicSubscriptionAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return new ClinicSubscription();
        return new ClinicSubscription({
            id: resource.id || 1,
            planName: resource.planName,
            status: resource.status,
            planType: resource.planType,
            annualFee: Number(resource.annualFee ?? 1428),
            monthlyEquivalent: Number(resource.monthlyEquivalent ?? 119),
            startDate: resource.startDate,
            renewalDate: resource.renewalDate,
            usedQuota: Number(resource.usedQuota ?? 24),
            totalQuota: Number(resource.totalQuota ?? 50),
            paymentMethod: resource.paymentMethod ? {...resource.paymentMethod} : null
        });
    }

    static toEntityFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}: ${response.statusText}`);
            return null;
        }
        const payload = Array.isArray(response.data) ? response.data[0] : response.data;
        if (!payload) return null;
        return this.toEntityFromResource(payload);
    }

    static toResourceFromEntity(entity) {
        return {
            id: entity.id || 1,
            planName: entity.planName,
            status: entity.status,
            planType: entity.planType,
            annualFee: Number(entity.annualFee),
            monthlyEquivalent: Number(entity.monthlyEquivalent),
            startDate: entity.startDate,
            renewalDate: entity.renewalDate,
            usedQuota: Number(entity.usedQuota),
            totalQuota: Number(entity.totalQuota),
            paymentMethod: {...entity.paymentMethod}
        };
    }
}
