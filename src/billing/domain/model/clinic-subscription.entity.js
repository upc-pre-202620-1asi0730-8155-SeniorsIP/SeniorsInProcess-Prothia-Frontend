/**
 * Represents the institutional clinical subscription of a healthcare facility.
 *
 * @class ClinicSubscription
 */
export class ClinicSubscription {
    constructor({
                    id = 1,
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
        this.id = id;
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

    get quotaPercentage() {
        if (!this.totalQuota) return 0;
        return Math.round((this.usedQuota / this.totalQuota) * 100);
    }

    get availableQuota() {
        return Math.max(0, this.totalQuota - this.usedQuota);
    }

    get isNearLimit() {
        return this.quotaPercentage >= 80;
    }
}
