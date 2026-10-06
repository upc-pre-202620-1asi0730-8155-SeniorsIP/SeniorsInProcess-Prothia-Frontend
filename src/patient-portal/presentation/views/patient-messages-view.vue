<script setup>
import { ref, onMounted, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { useCommunicationStore } from "../../../communication/application/communication.store.js";

const toast = useToast();
const communicationStore = useCommunicationStore();

const newMessage = ref('');
const messages = computed(() => communicationStore.messages);

onMounted(() => {
  if (!communicationStore.messagesLoaded) {
    communicationStore.fetchMessages();
  }
});

async function sendMessage() {
  const text = newMessage.value.trim();
  if (!text) return;

  await communicationStore.sendMessage(text, 'Carlos Mendoza', 'Paciente');
  newMessage.value = '';

  toast.add({
    severity: 'success',
    summary: 'Mensaje Enviado',
    detail: 'Tu consulta fue entregada al canal del Lic. Diego Salazar.',
    life: 3000
  });

  // Simulated auto-reply from therapist specialist
  setTimeout(() => {
    communicationStore.messages.push({
      id: Date.now() + 1,
      sender: 'therapist',
      senderName: 'Lic. Diego Salazar',
      senderRole: 'Fisioterapeuta',
      text: 'Recibido Carlos, revisaré los registros de telemetría de tu prótesis PR-2026-TT-084 y te responderé en breve.',
      timestamp: 'Ahora',
      isSystem: false,
      status: 'delivered'
    });
  }, 2500);
}
</script>

<template>
  <div class="patient-messages-page">
    <div class="chat-layout">
      <!-- Left Sidebar: Clinical Team Info -->
      <aside class="clinical-info-sidebar">
        <!-- Team Card -->
        <article class="assigned-team-card">
          <span class="section-tag">EQUIPO CLÍNICO ASIGNADO</span>

          <div class="therapist-profile">
            <div class="therapist-avatar">DS</div>
            <div class="therapist-details">
              <h3 class="therapist-name">Lic. Diego Salazar M.</h3>
              <p class="therapist-role">Fisioterapeuta Especialista</p>
              <span class="online-indicator">
                <span class="dot-green" /> Conectado hoy
              </span>
            </div>
          </div>

          <div class="clinical-meta-list">
            <div class="meta-item">
              <span class="meta-label">INSTITUCIÓN</span>
              <span class="meta-val">Centro de Rehabilitación Física Lima Sur</span>
            </div>

            <div class="meta-item">
              <span class="meta-label">HORARIO DE RESPUESTAS</span>
              <span class="meta-val">Lunes a Viernes: 8:00 AM - 5:00 PM</span>
            </div>

            <div class="meta-item">
              <span class="meta-label">PRÓXIMA CONSULTA PRESENCIAL</span>
              <span class="meta-val meta-val--highlight">18 de Septiembre, 10:00 AM</span>
            </div>
          </div>
        </article>

        <!-- Protected Channel Note -->
        <div class="protected-channel-card">
          <h4 class="protected-title">Canal Clínico Protegido</h4>
          <p class="protected-desc">
            Los mensajes y reportes intercambiados forman parte de tu expediente médico bajo cifrado de datos.
          </p>
        </div>
      </aside>

      <!-- Right Column: Chat Box -->
      <main class="chat-main-card">
        <!-- Chat Header -->
        <header class="chat-header">
          <div>
            <h2 class="chat-title">Conversación con Lic. Diego Salazar</h2>
            <p class="chat-subtitle">Rehabilitación de Prótesis Transtibial • Sesiones Domiciliarias</p>
          </div>
          <span class="channel-badge">Canal Seguro</span>
        </header>

        <!-- Message Stream Area -->
        <div class="messages-stream">
          <div
              v-for="msg in messages"
              :key="msg.id"
              class="msg-wrapper"
              :class="{
              'msg-wrapper--user': msg.sender === 'user',
              'msg-wrapper--therapist': msg.sender === 'therapist',
              'msg-wrapper--system': msg.isSystem
            }"
          >
            <!-- System Notice Chip -->
            <div v-if="msg.isSystem" class="system-chip">
              {{ msg.text }}
            </div>

            <!-- User Bubble -->
            <div v-else-if="msg.sender === 'user'" class="bubble bubble--user">
              <p class="bubble-text">{{ msg.text }}</p>
              <span class="bubble-time">{{ msg.timestamp }}</span>
            </div>

            <!-- Therapist Bubble -->
            <div v-else-if="msg.sender === 'therapist'" class="bubble bubble--therapist">
              <div class="bubble-therapist-header">
                <span class="therapist-sender-name">{{ msg.senderName }}</span>
                <span class="therapist-sender-role">{{ msg.senderRole }}</span>
              </div>
              <p class="bubble-text">{{ msg.text }}</p>
              <span class="bubble-time">{{ msg.timestamp }}</span>
            </div>
          </div>
        </div>

        <!-- Chat Input Bar -->
        <footer class="chat-input-bar">
          <button type="button" class="btn-attach" title="Adjuntar registro">
            <i class="pi pi-paperclip" />
          </button>
          <input
              v-model="newMessage"
              type="text"
              placeholder="Escribe tu consulta o mensaje a tu terapeuta aquí..."
              class="chat-input-field"
              @keyup.enter="sendMessage"
          />
          <button
              type="button"
              class="btn-send"
              :disabled="!newMessage.trim()"
              @click="sendMessage"
          >
            Enviar →
          </button>
        </footer>
      </main>
    </div>
  </div>
</template>

<style scoped>
.patient-messages-page {
  max-width: 1280px;
  margin: 0 auto;
}

.chat-layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 1.5rem;
  min-height: calc(100vh - 180px);
}

/* Left Sidebar */
.clinical-info-sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.assigned-team-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid var(--pt-border);
  box-shadow: 0 1px 3px rgba(10, 31, 51, 0.04);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.section-tag {
  font-size: 0.65625rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #0f766e;
}

.therapist-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1.15rem;
  border-bottom: 1px solid #f1f5f9;
}

.therapist-avatar {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: #e6f4f5;
  color: #0f766e;
  font-weight: 800;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.therapist-details {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.therapist-name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--pt-navy-900);
}

.therapist-role {
  margin: 0;
  font-size: 0.75rem;
  color: #64748b;
}

.online-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #16a34a;
  margin-top: 0.2rem;
}

.dot-green {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #16a34a;
}

.clinical-meta-list {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.meta-label {
  font-size: 0.625rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #64748b;
}

.meta-val {
  font-size: 0.8125rem;
  color: #334155;
  line-height: 1.35;
}

.meta-val--highlight {
  font-weight: 700;
  color: var(--pt-navy-900);
}

/* Protected Channel */
.protected-channel-card {
  background: #e6f4f5;
  border: 1px solid #b2dfdb;
  border-radius: 14px;
  padding: 1.25rem 1.4rem;
  margin-top: auto;
}

.protected-title {
  margin: 0 0 0.35rem;
  font-size: 0.8125rem;
  font-weight: 800;
  color: #0f766e;
}

.protected-desc {
  margin: 0;
  font-size: 0.75rem;
  color: #334155;
  line-height: 1.45;
}

/* Right Chat Column */
.chat-main-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid var(--pt-border);
  box-shadow: 0 1px 3px rgba(10, 31, 51, 0.04);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.75rem;
  border-bottom: 1px solid #f1f5f9;
}

.chat-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--pt-navy-900);
}

.chat-subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.78125rem;
  color: #64748b;
}

.channel-badge {
  font-size: 0.6875rem;
  font-weight: 700;
  color: #94a3b8;
}

/* Messages Stream */
.messages-stream {
  flex: 1;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  overflow-y: auto;
  background: #fafbfc;
}

.msg-wrapper {
  display: flex;
  width: 100%;
}

.msg-wrapper--user {
  justify-content: flex-end;
}

.msg-wrapper--therapist {
  justify-content: flex-start;
}

.msg-wrapper--system {
  justify-content: center;
  margin: 0.5rem 0;
}

.system-chip {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 0.35rem 1rem;
  font-size: 0.71875rem;
  color: #64748b;
  font-weight: 600;
  text-align: center;
}

/* Bubbles */
.bubble {
  max-width: 72%;
  border-radius: 14px;
  padding: 1.1rem 1.35rem;
  position: relative;
  box-shadow: 0 1px 3px rgba(10, 31, 51, 0.04);
}

.bubble--user {
  background: #071c2f;
  color: #ffffff;
  border-bottom-right-radius: 4px;
}

.bubble--user .bubble-time {
  color: #94a3b8;
  display: block;
  text-align: right;
  font-size: 0.65625rem;
  margin-top: 0.5rem;
}

.bubble--therapist {
  background: #f1f5f9;
  color: #1e293b;
  border-bottom-left-radius: 4px;
}

.bubble-therapist-header {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.45rem;
}

.therapist-sender-name {
  font-size: 0.8125rem;
  font-weight: 800;
  color: var(--pt-navy-900);
}

.therapist-sender-role {
  font-size: 0.6875rem;
  color: #64748b;
}

.bubble--therapist .bubble-time {
  color: #94a3b8;
  display: block;
  font-size: 0.65625rem;
  margin-top: 0.5rem;
}

.bubble-text {
  margin: 0;
  font-size: 0.84375rem;
  line-height: 1.55;
}

/* Input Bar */
.chat-input-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: #ffffff;
  border-top: 1px solid #f1f5f9;
}

.btn-attach {
  background: transparent;
  border: none;
  font-size: 1.15rem;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease;
}

.btn-attach:hover {
  color: var(--pt-navy-900);
}

.chat-input-field {
  flex: 1;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 0.65rem 1.25rem;
  font-size: 0.8125rem;
  color: var(--pt-navy-900);
  outline: none;
  transition: border-color 0.15s ease;
}

.chat-input-field:focus {
  border-color: #0f766e;
  background: #ffffff;
}

.btn-send {
  background: #0f766e;
  color: #ffffff;
  border: none;
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 0.65rem 1.25rem;
  border-radius: 999px;
  cursor: pointer;
  transition: opacity 0.15s ease;
  white-space: nowrap;
}

.btn-send:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-send:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

@media (max-width: 900px) {
  .chat-layout {
    grid-template-columns: 1fr;
  }
}
</style>
