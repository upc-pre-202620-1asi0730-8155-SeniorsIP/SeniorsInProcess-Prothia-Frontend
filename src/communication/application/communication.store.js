import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { CommunicationApi } from "../infrastructure/communication-api.js";
import { ClinicalMessageAssembler } from "../infrastructure/clinical-message.assembler.js";
import { ClinicalMessage } from "../domain/model/clinical-message.entity.js";
import { ClinicalTransmission } from "../domain/model/clinical-transmission.entity.js";
import { ClinicalTransmissionAssembler } from "../infrastructure/clinical-transmission.assembler.js";

const communicationApi = new CommunicationApi();

/**
 * Application Store orchestrating use cases for the Communication Bounded Context.
 * Manages clinical message threads, real-time message sending, and delivery states.
 *
 * @module useCommunicationStore
 */
export const useCommunicationStore = defineStore('communication', () => {
    /** @type {import('vue').Ref<ClinicalMessage[]>} */
    const messages = ref([]);
    /** @type {import('vue').Ref<ClinicalTransmission[]>} */
    const transmissions = ref([]);
    /** @type {import('vue').Ref<boolean>} */
    const loading = ref(false);
    /** @type {import('vue').Ref<boolean>} */
    const messagesLoaded = ref(false);
    /** @type {import('vue').Ref<boolean>} */
    const transmissionsLoaded = ref(false);
    /** @type {import('vue').Ref<any[]>} */
    const errors = ref([]);

    /** Total count of conversation messages. */
    const messagesCount = computed(() => messages.value.length);

    /** Most recent message in the consultation channel. */
    const latestMessage = computed(() => {
        return messages.value.length > 0 ? messages.value[messages.value.length - 1] : null;
    });

    /**
     * Fetches clinical messages from the backend API.
     *
     * @returns {Promise<ClinicalMessage[]>}
     */
    async function fetchMessages() {
        loading.value = true;
        try {
            const response = await communicationApi.getMessages();
            messages.value = ClinicalMessageAssembler.toEntitiesFromResponse(response);
            messagesLoaded.value = true;
            return messages.value;
        } catch (error) {
            errors.value.push(error);
            messagesLoaded.value = true;
            return messages.value;
        } finally {
            loading.value = false;
        }
    }

    /**
     * Dispatches a new clinical message from the active user into the consultation channel.
     *
     * @param {string} text - Message body content.
     * @param {string} [senderName='Carlos Mendoza'] - Author display name.
     * @param {string} [senderRole='Paciente'] - Role title.
     * @param {string} [senderType='user'] - Sender type ('user' | 'therapist' | 'system').
     * @returns {Promise<ClinicalMessage>} Newly sent message entity.
     */
    async function sendMessage(text, senderName = 'Carlos Mendoza', senderRole = 'Paciente', senderType = 'user') {
        const cleanText = text.trim();
        if (!cleanText) return null;

        const newMsgEntity = new ClinicalMessage({
            id: Date.now(),
            sender: senderType,
            senderName,
            senderRole,
            text: cleanText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSystem: senderType === 'system',
            status: 'sent'
        });

        messages.value.push(newMsgEntity);

        try {
            const payload = ClinicalMessageAssembler.toResourceFromEntity(newMsgEntity);
            const response = await communicationApi.sendMessage(payload);
            if (response?.data) {
                const created = ClinicalMessageAssembler.toEntityFromResource(response.data);
                const idx = messages.value.indexOf(newMsgEntity);
                if (idx !== -1) messages.value[idx] = created;
                return created;
            }
            newMsgEntity.status = 'delivered';
        } catch (error) {
            errors.value.push(error);
        }

        return newMsgEntity;
    }

    function addSystemNotification(text) {
        return sendMessage(text, 'Sistema Prothia', 'Sistema', 'system');
    }

    /**
     * Loads all transmissions sent to orthoprosthetic workshops.
     * @returns {Promise<void>}
     */
    async function fetchTransmissions() {
        try {
            const response = await communicationApi.getTransmissions();
            transmissions.value = ClinicalTransmissionAssembler.toEntitiesFromResponse(response);
            transmissionsLoaded.value = true;
        } catch (error) {
            errors.value.push(error);
        }
    }

    /**
     * Dispatches a new clinical report transmission to an orthoprosthetic workshop.
     * @param {Object} transmissionData - Payload data.
     * @returns {Promise<ClinicalTransmission>}
     */
    async function transmitReport(transmissionData) {
        const newEntity = new ClinicalTransmission({
            id: Date.now(),
            ...transmissionData,
            status: 'confirmed',
            statusLabel: 'Recibido y Confirmado por Taller',
            createdAt: new Date().toLocaleDateString('es-PE')
        });

        transmissions.value.unshift(newEntity);

        try {
            const payload = ClinicalTransmissionAssembler.toResourceFromEntity(newEntity);
            const response = await communicationApi.createTransmission(payload);
            if (response?.data) {
                const created = ClinicalTransmissionAssembler.toEntityFromResource(response.data);
                const idx = transmissions.value.indexOf(newEntity);
                if (idx !== -1) transmissions.value[idx] = created;
                return created;
            }
        } catch (error) {
            errors.value.push(error);
        }

        return newEntity;
    }

    return {
        messages,
        transmissions,
        loading,
        messagesLoaded,
        transmissionsLoaded,
        errors,
        messagesCount,
        latestMessage,
        fetchMessages,
        sendMessage,
        addSystemNotification,
        fetchTransmissions,
        transmitReport
    };
});

export default useCommunicationStore;
