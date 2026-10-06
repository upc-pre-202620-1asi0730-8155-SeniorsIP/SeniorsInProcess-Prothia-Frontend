import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { CommunicationApi } from "../infrastructure/communication-api.js";
import { ClinicalMessageAssembler } from "../infrastructure/clinical-message.assembler.js";
import { ClinicalMessage } from "../domain/model/clinical-message.entity.js";
import { ClinicalTransmission } from "../domain/model/clinical-transmission.entity.js";
import { ClinicalTransmissionAssembler } from "../infrastructure/clinical-transmission.assembler.js";

const communicationApi = new CommunicationApi();

/**
 * Default fallback messages used if the API server is unreachable.
 * @type {ClinicalMessage[]}
 */
const defaultMessages = [
    new ClinicalMessage({
        id: 1,
        sender: 'user',
        senderName: 'Carlos Mendoza',
        senderRole: 'Paciente',
        text: 'Hola Lic. Diego, completé la rutina de hoy. Noté una ligera presión en el borde lateral distal del encaje al minuto 20 de la caminata, pero sin dolor agudo. ¿Debo colocarme una capa extra de media o lo mantengo igual?',
        timestamp: 'Ayer 18:20',
        isSystem: false,
        status: 'read'
    }),
    new ClinicalMessage({
        id: 2,
        sender: 'therapist',
        senderName: 'Lic. Diego Salazar',
        senderRole: 'Fisioterapeuta',
        text: '¡Hola Carlos! Revisé los datos de tu sesión telemétrica de ayer: tu simetría de apoyo estuvo en 94%, lo cual es un resultado excelente. Esa ligera presión es esperable mientras el muñón se tonifica. Mantén el mismo número de medias hoy y descansa 1 minuto extra entre series. Si mañana persiste enrojecimiento por más de 15 minutos al retirar el encaje, avísame para coordinar una alineación con el taller ortopédico.',
        timestamp: 'Hoy 08:45',
        isSystem: false,
        status: 'delivered'
    }),
    new ClinicalMessage({
        id: 3,
        sender: 'system',
        senderName: 'Sistema Prothia',
        senderRole: 'Sistema',
        text: 'El sistema compartió automáticamente tu sesión de hoy (3 de 4 ejercicios completados - 75%)',
        timestamp: 'Hoy 09:30',
        isSystem: true,
        status: 'delivered'
    })
];

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
    const transmissions = ref([
        new ClinicalTransmission({
            id: 1,
            patientId: 1,
            patientName: "Carlos Mendoza Arias",
            patientDni: "45892104",
            workshopName: "Ortopedia Avanzada S.A.C. (Ing. Roberto Valdivia)",
            sharedModules: ["symmetry", "impact_alerts", "clinical_notes"],
            technicalNotes: "Paciente Carlos Mendoza presenta leve compensación con inclinación lateral hacia el lado sano a partir del minuto 18 de marcha. Se recomienda revisar el ángulo estático del pilón o eventual recalibración de la flexión del tobillo en el siguiente mantenimiento preventivo.",
            status: "confirmed",
            statusLabel: "Recibido y Confirmado por Taller",
            summary: "Informe de adaptación inicial y 300,000 ciclos acumulados.",
            createdAt: "12/09/2026"
        })
    ]);
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
     * Falls back to default clinical seed messages if the server is offline or empty.
     *
     * @returns {Promise<ClinicalMessage[]>}
     */
    async function fetchMessages() {
        loading.value = true;
        try {
            const response = await communicationApi.getMessages();
            const entities = ClinicalMessageAssembler.toEntitiesFromResponse(response);
            if (entities.length > 0) {
                messages.value = entities;
            } else {
                messages.value = [...defaultMessages];
            }
            messagesLoaded.value = true;
            return messages.value;
        } catch (error) {
            errors.value.push(error);
            messages.value = [...defaultMessages];
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
     * @returns {Promise<ClinicalMessage>} Newly sent message entity.
     */
    async function sendMessage(text, senderName = 'Carlos Mendoza', senderRole = 'Paciente') {
        const cleanText = text.trim();
        if (!cleanText) return null;

        const newMsgEntity = new ClinicalMessage({
            id: Date.now(),
            sender: 'user',
            senderName,
            senderRole,
            text: cleanText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSystem: false,
            status: 'sent'
        });

        // Optimistic UI update
        messages.value.push(newMsgEntity);

        try {
            const payload = ClinicalMessageAssembler.toResourceFromEntity(newMsgEntity);
            await communicationApi.sendMessage(payload);
            newMsgEntity.status = 'delivered';
        } catch (error) {
            errors.value.push(error);
            // Even if offline, the optimistic message remains visible for the session
        }

        return newMsgEntity;
    }

    /**
     * Loads all transmissions sent to orthoprosthetic workshops.
     * @returns {Promise<void>}
     */
    async function fetchTransmissions() {
        try {
            const response = await communicationApi.getTransmissions();
            const entities = ClinicalTransmissionAssembler.toEntitiesFromResponse(response);
            if (entities.length > 0) {
                transmissions.value = entities;
            }
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
            await communicationApi.createTransmission(payload);
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
        fetchTransmissions,
        transmitReport
    };
});

export default useCommunicationStore;
