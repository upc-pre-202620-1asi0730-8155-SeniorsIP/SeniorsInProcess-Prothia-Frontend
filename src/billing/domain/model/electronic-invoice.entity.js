/**
 * Represents an institutional electronic tax invoice issued to a clinical facility.
 *
 * @class ElectronicInvoice
 */
export class ElectronicInvoice {
    /**
     * @param {Object} params - Initialization parameters.
     * @param {number} [params.id=0] - Unique internal identifier.
     * @param {string} [params.invoiceNumber=''] - Electronic invoice series number (e.g. F001-000842).
     * @param {string} [params.issueDate=''] - Emission date string.
     * @param {string} [params.concept=''] - Description of billed services or subscription quota.
     * @param {number} [params.amount=0] - Total monetary amount billed.
     * @param {string} [params.currency='$'] - Currency symbol ($ or S/.).
     * @param {string} [params.status='paid'] - Payment status ('paid', 'pending', 'cancelled').
     * @param {string} [params.statusLabel='Pagado'] - Human-readable status tag.
     * @param {string} [params.downloadUrl=''] - Direct link or URI to download official PDF invoice.
     */
    constructor({
                    id = 0,
                    invoiceNumber = '',
                    issueDate = '',
                    concept = '',
                    amount = 0,
                    currency = '$',
                    status = 'paid',
                    statusLabel = 'Pagado',
                    downloadUrl = ''
                } = {}) {
        this.id = id;
        this.invoiceNumber = invoiceNumber;
        this.issueDate = issueDate;
        this.concept = concept;
        this.amount = amount;
        this.currency = currency;
        this.status = status;
        this.statusLabel = statusLabel;
        this.downloadUrl = downloadUrl;
    }

    /**
     * Formats the invoice amount as currency string.
     * @returns {string} Formatted price (e.g. $1,428.00).
     */
    get formattedAmount() {
        return `${this.currency}${Number(this.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    /**
     * Checks if the invoice has been fully settled.
     * @returns {boolean} True if paid.
     */
    get isSettled() {
        return this.status === 'paid';
    }
}
