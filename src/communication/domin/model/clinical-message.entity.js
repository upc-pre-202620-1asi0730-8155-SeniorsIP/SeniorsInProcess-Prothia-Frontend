/**
 * ClinicalMessage entity representing secure communication between patients and clinical specialists.
 * Part of the Communication Bounded Context.
 *
 * @class ClinicalMessage
 */
export class ClinicalMessage {
    /**
     * @param {Object} [params={}] - Initialization parameters.
     * @param {?number} [params.id=null] - Unique message identifier.
     * @param {'user'|'therapist'|'technician'|'system'} [params.sender='user'] - Sender role category.
     * @param {string} [params.senderName=''] - Full name of the message sender.
     * @param {?string} [params.senderRole=''] - Professional or patient role title.
     * @param {string} [params.text=''] - Message content payload.
     * @param {string} [params.timestamp=''] - Formatted timestamp or relative time.
     * @param {boolean} [params.isSystem=false] - Whether this is an automated system notification.
     * @param {'sent'|'delivered'|'read'} [params.status='delivered'] - Delivery status indicator.
     */
    constructor({
                    id = null,
                    sender = 'user',
                    senderName = '',
                    senderRole = '',
                    text = '',
                    timestamp = '',
                    isSystem = false,
                    status = 'delivered'
                } = {}) {
        this.id = id;
        this.sender = sender;
        this.senderName = senderName;
        this.senderRole = senderRole;
        this.text = text;
        this.timestamp = timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        this.isSystem = Boolean(isSystem);
        this.status = status;
    }

    /**
     * Checks if the message originated from a clinical professional.
     * @returns {boolean}
     */
    get isFromSpecialist() {
        return this.sender === 'therapist' || this.sender === 'technician';
    }

    /**
     * Checks if the message originated from the patient.
     * @returns {boolean}
     */
    get isFromPatient() {
        return this.sender === 'user';
    }
}
