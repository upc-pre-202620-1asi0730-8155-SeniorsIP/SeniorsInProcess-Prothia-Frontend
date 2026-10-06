<script setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import useWorkshopStore from "../../application/workshop.store.js";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  alert: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:visible', 'scheduled']);
const { t } = useI18n();
const toast = useToast();
const store = useWorkshopStore();

const scheduledDate = ref('07/10/2026');
const interventionType = ref('Recambio urgente de amortiguador hidráulico y revisión de sellos');
const technicianName = ref('Ing. Roberto Valdivia');
const notes = ref('Prioridad alta: superar umbral de 800,000 ciclos genera riesgo inminente de fuga hidráulica.');

const interventionOptions = [
  'Recambio urgente de amortiguador hidráulico y revisión de sellos',
  'Inspección y recambio de elastómero de talón',
  'Alineación estática y dinámica en banco',
  'Reajuste de torque y pernos de pirámide distal',
  'Calibración de sensores IMU y reemplazo de batería'
];

watch(() => props.alert, (newVal) => {
  if (newVal) {
    interventionType.value = `Recambio urgente: ${newVal.component}`;
    notes.value = newVal.description;
  }
});

function handleConfirm() {
  if (!props.alert) return;

  store.scheduleImmediateRevision(props.alert, scheduledDate.value, notes.value).then(() => {
    toast.add({
      severity: 'success',
      summary: 'Revisión Programada',
      detail: `Se programó la revisión de la prótesis ${props.alert.serialNumber} para el ${scheduledDate.value}.`,
      life: 4000
    });
    emit('scheduled');
    emit('update:visible', false);
  });
}
</script>

<template>
  <pv-dialog
      :visible="visible"
      modal
      :header="t('technician.modals.schedule-title')"
      :style="{ width: '560px', maxWidth: '95vw' }"
      @update:visible="emit('update:visible', $event)"
  >
    <div v-if="alert" class="modal-body">
      <div class="alert-summary">
        <div class="summary-chip">
          <span class="chip-label">Dispositivo:</span>
          <strong>{{ alert.serialNumber }}</strong>
        </div>
        <div class="summary-chip summary-chip--red">
          <span class="chip-label">Ciclos:</span>
          <strong>{{ alert.formattedCycles }}</strong>
        </div>
        <div class="summary-chip">
          <span class="chip-label">Paciente:</span>
          <strong>{{ alert.patientName }} ({{ alert.kLevel }})</strong>
        </div>
      </div>

      <div class="field">
        <label for="intervention">Tipo de Intervención Técnica</label>
        <pv-select
            id="intervention"
            v-model="interventionType"
            :options="interventionOptions"
            fluid
        />
      </div>

      <div class="field-row">
        <div class="field">
          <label for="schedDate">Fecha de Revisión en Taller</label>
          <pv-input-text id="schedDate" v-model="scheduledDate" fluid />
        </div>
        <div class="field">
          <label for="techName">Técnico Ortoprotésico</label>
          <pv-input-text id="techName" v-model="technicianName" fluid />
        </div>
      </div>

      <div class="field">
        <label for="notes">Observaciones Técnicas y Diagnóstico</label>
        <pv-textarea
            id="notes"
            v-model="notes"
            rows="3"
            fluid
        />
      </div>
    </div>

    <template #footer>
      <div class="dialog-actions">
        <pv-button
            label="Cancelar"
            text
            severity="secondary"
            @click="emit('update:visible', false)"
        />
        <pv-button
            class="btn-urgent"
            icon="pi pi-calendar-plus"
            label="Confirmar y Programar Revisión"
            @click="handleConfirm"
        />
      </div>
    </template>
  </pv-dialog>
</template>

<style scoped>
.modal-body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 0.5rem;
}

.alert-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  background: #fdf2f4;
  border: 1px solid #fecdd3;
  border-radius: 10px;
}

.summary-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8125rem;
  color: var(--pt-ink);
}

.summary-chip--red strong {
  color: var(--pt-red);
}

.chip-label {
  color: var(--pt-muted);
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--pt-navy-900);
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn-urgent {
  --p-button-primary-background: #dc2626;
  --p-button-primary-border-color: #dc2626;
  --p-button-primary-hover-background: #b91c1c;
  --p-button-primary-hover-border-color: #b91c1c;
  --p-button-primary-color: #ffffff;
  font-weight: 700;
}
</style>
