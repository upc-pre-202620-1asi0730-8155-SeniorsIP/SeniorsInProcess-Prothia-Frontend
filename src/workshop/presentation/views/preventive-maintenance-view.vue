<script setup>
import { ref, computed, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import useWorkshopStore from "../../application/workshop.store.js";

const store = useWorkshopStore();
const toast = useToast();

const selectedAppointment = ref(null);
const showAttendDialog = ref(false);
const serviceNotes = ref('');

const appointments = computed(() => {
  return store.maintenances.map(m => {
    let month = 'SEP';
    let day = '18';
    if (m.scheduledDate) {
      const parts = m.scheduledDate.split(/[-/]/);
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          day = parts[2];
          const mNum = parseInt(parts[1], 10);
          const months = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
          month = months[mNum - 1] || 'SEP';
        } else {
          day = parts[0];
          const mNum = parseInt(parts[1], 10);
          const months = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
          month = months[mNum - 1] || 'SEP';
        }
      }
    }

    const isPriority = (m.interventionType && (m.interventionType.toLowerCase().includes('inmediat') || m.interventionType.toLowerCase().includes('fatiga'))) ||
        (m.notes && m.notes.toLowerCase().includes('800k'));

    let badgeType = 'teal';
    if (isPriority) {
      badgeType = 'red';
    } else if (m.interventionType?.toLowerCase().includes('amortiguador') || m.notes?.toLowerCase().includes('amortiguador')) {
      badgeType = 'amber';
    }

    return {
      id: m.id,
      month,
      day,
      patientName: m.patientName,
      serialNumber: m.serialNumber,
      badgeText: m.interventionType || 'Mantenimiento Preventivo',
      badgeType,
      reason: m.notes || 'Mantenimiento técnico programado.',
      time: isPriority ? '09:00 AM (Prioritario)' : '10:00 AM',
      isPriority,
      status: m.status || 'scheduled'
    };
  });
});

onMounted(() => {
  store.fetchMaintenances();
});

function openAttendDialog(apt) {
  selectedAppointment.value = apt;
  serviceNotes.value = '';
  showAttendDialog.value = true;
}

function confirmAttendance() {
  if (selectedAppointment.value) {
    store.completeMaintenance(selectedAppointment.value.id, serviceNotes.value);
    toast.add({
      severity: 'success',
      summary: 'Servicio en Taller Iniciado',
      detail: `Se aperturó la orden de trabajo para ${selectedAppointment.value.patientName} (${selectedAppointment.value.serialNumber}).`,
      life: 3500
    });
  }
  showAttendDialog.value = false;
}
</script>

<template>
  <div class="preventive-maintenance-page">
    <div class="calendar-card">
      <!-- Card Header -->
      <div class="calendar-card__header">
        <div>
          <h2 class="calendar-card__title">Calendario de Revisiones Técnicas Agendadas</h2>
          <p class="calendar-card__subtitle">{{ appointments.filter(a => a.status === 'scheduled').length }} citas programadas para septiembre 2026</p>
        </div>
        <span class="week-badge">Semana 37</span>
      </div>

      <!-- Agenda Appointments List -->
      <div class="appointments-list">
        <div
            v-for="apt in appointments"
            :key="apt.id"
            class="appointment-item"
            :class="{ 'appointment-item--priority': apt.isPriority, 'appointment-item--completed': apt.status === 'completed' }"
        >
          <!-- Date Badge Box -->
          <div
              class="date-box"
              :class="apt.isPriority ? 'date-box--red' : 'date-box--teal'"
          >
            <span class="date-box__month">{{ apt.month }}</span>
            <span class="date-box__day">{{ apt.day }}</span>
          </div>

          <!-- Appointment Details -->
          <div class="appointment-details">
            <div class="appointment-details__header">
              <span class="patient-name">{{ apt.patientName }}</span>
              <span class="serial-tag">{{ apt.serialNumber }}</span>
              <span
                  class="badge-pill"
                  :class="`badge-pill--${apt.badgeType}`"
              >
                {{ apt.badgeText }}
              </span>
            </div>
            <p class="appointment-details__reason">
              <strong>Motivo:</strong> {{ apt.reason.replace(/^Motivo:\s*/, '') }}
            </p>
          </div>

          <!-- Right Action Area -->
          <div class="appointment-action">
            <span
                class="time-label"
                :class="{ 'time-label--priority': apt.isPriority }"
            >
              {{ apt.time }}
            </span>
            <button
                type="button"
                class="btn-attend"
                :class="apt.isPriority ? 'btn-attend--red' : 'btn-attend--teal'"
                :disabled="apt.status === 'completed'"
                @click="openAttendDialog(apt)"
            >
              {{ apt.status === 'completed' ? 'Atendido' : 'Atender en Taller' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Attendance Dialog Modal -->
    <pv-dialog
        v-model:visible="showAttendDialog"
        modal
        header="Aperturar Orden Técnica en Taller"
        :style="{ width: '480px' }"
    >
      <div v-if="selectedAppointment" class="attend-dialog-content">
        <div class="info-banner">
          <p class="patient-line"><strong>Paciente:</strong> {{ selectedAppointment.patientName }}</p>
          <p class="device-line"><strong>Prótesis:</strong> {{ selectedAppointment.serialNumber }}</p>
          <p class="motivo-line"><strong>Trabajo a realizar:</strong> {{ selectedAppointment.badgeText }}</p>
        </div>

        <div class="field">
          <label for="tech-notes">Observaciones de Inspección Inicial (Opcional)</label>
          <pv-textarea
              id="tech-notes"
              v-model="serviceNotes"
              rows="3"
              placeholder="Ej. Se verificó juego mecánico en rodilla, sin fugas evidentes..."
              fluid
          />
        </div>
      </div>
      <template #footer>
        <pv-button label="Cancelar" text @click="showAttendDialog = false" />
        <pv-button label="Iniciar Atención" severity="success" @click="confirmAttendance" />
      </template>
    </pv-dialog>
  </div>
</template>

<style scoped>
.preventive-maintenance-page {
  max-width: 1240px;
  margin: 0 auto;
}

.calendar-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid var(--pt-border);
  box-shadow: 0 1px 3px rgba(10, 31, 51, 0.05);
  padding: 1.75rem 2rem 2.25rem;
}

.calendar-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #f1f5f9;
}

.calendar-card__title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--pt-navy-900);
  line-height: 1.3;
}

.calendar-card__subtitle {
  margin: 0.35rem 0 0;
  font-size: 0.8125rem;
  color: #64748b;
}

.week-badge {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--pt-navy-900);
}

.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.appointment-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.1rem 1.4rem;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #eef2f6;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.appointment-item:hover {
  box-shadow: 0 4px 12px rgba(10, 31, 51, 0.04);
}

.appointment-item--priority {
  background: #fff5f5;
  border-color: #fecaca;
}

.appointment-item--completed {
  opacity: 0.65;
}

/* Date Box */
.date-box {
  width: 50px;
  height: 52px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.date-box--teal {
  background: #e6f4f5;
  color: #0f766e;
}

.date-box--red {
  background: #dc2626;
  color: #ffffff;
}

.date-box__month {
  font-size: 0.625rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  line-height: 1;
}

.date-box__day {
  font-size: 1.25rem;
  font-weight: 800;
  line-height: 1.2;
}

/* Details */
.appointment-details {
  flex: 1;
  min-width: 0;
}

.appointment-details__header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 0.35rem;
}

.patient-name {
  font-size: 0.9375rem;
  font-weight: 800;
  color: var(--pt-navy-900);
}

.serial-tag {
  font-size: 0.8125rem;
  color: #64748b;
  font-family: monospace;
}

.badge-pill {
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  white-space: nowrap;
}

.badge-pill--teal {
  background: #ccfbf1;
  color: #0f766e;
}

.badge-pill--red {
  background: #fee2e2;
  color: #dc2626;
}

.badge-pill--amber {
  background: #fef3c7;
  color: #d97706;
}

.appointment-details__reason {
  margin: 0;
  font-size: 0.8125rem;
  color: #475569;
  line-height: 1.45;
}

/* Action Area */
.appointment-action {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex-shrink: 0;
}

.time-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #64748b;
  white-space: nowrap;
}

.time-label--priority {
  color: #dc2626;
}

.btn-attend {
  border: none;
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 0.55rem 1.15rem;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.15s ease, background-color 0.15s ease;
  white-space: nowrap;
}

.btn-attend:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-attend--teal {
  background: #0f766e;
  color: #ffffff;
}

.btn-attend--red {
  background: #dc2626;
  color: #ffffff;
}

.btn-attend:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.attend-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 0.5rem 0;
}

.info-banner {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.85rem 1rem;
  font-size: 0.8125rem;
  color: #334155;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.info-banner p {
  margin: 0;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--pt-navy-900);
}

@media (max-width: 860px) {
  .appointment-item {
    flex-direction: column;
    align-items: flex-start;
  }
  .appointment-action {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
