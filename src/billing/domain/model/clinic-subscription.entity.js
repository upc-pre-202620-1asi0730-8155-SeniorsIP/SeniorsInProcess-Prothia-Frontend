/**
 * Represents the institutional clinical subscription of a healthcare facility.
 *
 * @class ClinicSubscription
 */
export class ClinicSubscription {
    /**
     * @param {Object} params - Initialization parameters.
     * @param {string} [params.planName='Plan Centro de Rehabilitación'] - Name of the subscription plan.
     * @param {string} [params.status='Activo • Vigente'] - Status badge label.
     * @param {string} [params.planType='Plan Clínico Anual'] - Type of plan (Annual, Monthly).
     * @param {number} [params.annualFee=1428] - Annual billing amount in USD.
     * @param {number} [params.monthlyEquivalent=119] - Equivalent monthly breakdown in USD.
     * @param {string} [params.startDate='12 de Septiembre de 2026'] - Contract subscription date.
     * @param {string} [params.renewalDate='12 de Septiembre de 2027'] - Next scheduled renewal date.
     * @param {number} [params.usedQuota=24] - Currently assigned patient slots.
     * @param {number} [params.totalQuota=50] - Maximum contracted patient slots.
     * @param {Object} [params.paymentMethod=null] - Registered payment method details.
     */
    constructor({
                    planName = 'Plan Centro de Rehabilitación',
                    status = 'Activo • Vigente',
                    planType = 'Plan Clínico Anual',
                    annualFee = 1428,
                    monthlyEquivalent = 119,
                    startDate = '12 de Septiembre de 2026',
                    renewalDate = '12 de Septiembre de 2027',
                    usedQuota = 24,
                    totalQuota = 50,
                    paymentMethod = null
                } = {}) {
        this.planName = planName;
        this.status = status;
        this.planType = planType;
        this.annualFee = annualFee;
        this.monthlyEquivalent = monthlyEquivalent;
        this.startDate = startDate;
        this.renewalDate = renewalDate;
        this.usedQuota = usedQuota;
        this.totalQuota = totalQuota;
        this.paymentMethod = paymentMethod || {
            brand: 'VISA',
            cardTitle: 'Tarjeta Corporativa terminada en 4281',
            expiry: '08/29',
            autoRenew: true
        };
    }

    /**
     * Calculates the quota occupancy percentage.
     * @returns {number} Integer between 0 and 100.
     */
    get quotaPercentage() {
        if (!this.totalQuota) return 0;
        return Math.round((this.usedQuota / this.totalQuota) * 100);
    }

    /**
     * Computes the remaining available patient slots.
     * @returns {number} Available slots.
     */
    get availableQuota() {
        return Math.max(0, this.totalQuota - this.usedQuota);
    }

    /**
     * Determines whether the clinic is approaching its patient capacity limit (>80%).
     * @returns {boolean} True if near capacity.
     */
    get isNearLimit() {
        return this.quotaPercentage >= 80;
    }
}
