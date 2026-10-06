<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import useWorkshopStore from "../../application/workshop.store.js";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:visible']);
const { t } = useI18n();
const toast = useToast();
const store = useWorkshopStore();

const formData = ref({
  serialNumber: 'PR-2026-TT-105',
  type: 'Transtibial Carbono Dinámica',
  patientName: '',
  clinicName: 'Rehab Lima Sur',
  accumulatedCycles: 0,
  cycleLimit: 800000,
  kLevel: 'K3',
  socketType: 'Fibra de Carbono Termoformada',
  footType: 'Pie dinámico de fibra de carbono'
});

const prosthesisTypes = [
  'Transtibial Carbono Dinámica',
  'Transfemoral Hidráulica K2',
  'Transfemoral Mecatrónica K3',
  'Transtibial K4 Alta Actividad',
  'Desarticulado de Rodilla Multicéntrica'
];

const clinics = [
  'Rehab Lima Sur',
  'Clínica San Juan de Dios',
  'Instituto Nacional de Rehabilitación (INR)',
  'Centro Ortopédico Especializado'
];

const kLevels = ['K1', 'K2', 'K3', 'K4'];

function handleSave() {
  if (!formData.value.patientName) {
    toast.add({
      severity: 'warn',
      summary: 'Campos requeridos',
      detail: 'Por favor ingrese el nombre del paciente a asociar.',
      life: 3000
    });
    return;
  }

  store.addProsthesis(formData.value).then((newEntity) => {
    toast.add({
      severity: 'success',
      summary: 'Prótesis Registrada y Vinculada',
      detail: `El dispositivo ${newEntity.serialNumber} se vinculó con éxito a telemetría IoT.`,
      life: 4000
    });
    emit('update:visible', false);
    // Reset form
    formData.value.patientName = '';
  });
}
</script>

<template>
  <pv-dialog
      :visible="visible"
      modal
      :header="t('technician.modals.register-title')"
      :style="{ width: '560px', maxWidth: '95vw' }"
      @update:visible="emit('update:visible', $event)"
  >
    <div class="form-grid">
      <div class="field">
        <label for="serialNumber">{{ t('technician.fleet.col-serial') }}</label>
        <pv-input-text id="serialNumber" v-model="formData.serialNumber" fluid />
      </div>

      <div class="field">
        <label for="type">{{ t('technician.fleet.col-type') }}</label>
        <pv-select
            id="type"
            v-model="formData.type"
            :options="prosthesisTypes"
            fluid
        />
      </div>

      <div class="field">
        <label for="patientName">{{ t('technician.fleet.col-patient') }} *</label>
        <pv-input-text
            id="patientName"
            v-model="formData.patientName"
            placeholder="Ej. Juan Carlos Ramírez"
            fluid
        />
      </div>

      <div class="field">
        <label for="clinicName">{{ t('technician.fleet.col-clinic') }}</label>
        <pv-select
            id="clinicName"
            v-model="formData.clinicName"
            :options="clinics"
            fluid
        />
      </div>

      <div class="field-row">
        <div class="field">
          <label for="kLevel">Nivel K</label>
          <pv-select
              id="kLevel"
              v-model="formData.kLevel"
              :options="kLevels"
              fluid
          />
        </div>
        <div class="field">
          <label for="cycleLimit">Umbral Preventivo Ciclos</label>
          <pv-input-number
              id="cycleLimit"
              v-model="formData.cycleLimit"
              fluid
          />
        </div>
      </div>

      <div class="field">
        <label for="socketType">Tipo de Encaje (Socket)</label>
        <pv-input-text id="socketType" v-model="formData.socketType" fluid />
      </div>

      <div class="field">
        <label for="footType">Pie Protésico</label>
        <pv-input-text id="footType" v-model="formData.footType" fluid />
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
            class="btn-confirm"
            icon="pi pi-check"
            label="Vincular a Telemetría"
            @click="handleSave"
        />
      </div>
    </template>
  </pv-dialog>
</template>

<style scoped>
.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  padding-top: 0.5rem;
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

.btn-confirm {
  --p-button-primary-background: var(--pt-teal);
  --p-button-primary-border-color: var(--pt-teal);
  --p-button-primary-hover-background: var(--pt-teal-strong);
  --p-button-primary-hover-border-color: var(--pt-teal-strong);
  --p-button-primary-color: #ffffff;
  font-weight: 700;
}
</style>
