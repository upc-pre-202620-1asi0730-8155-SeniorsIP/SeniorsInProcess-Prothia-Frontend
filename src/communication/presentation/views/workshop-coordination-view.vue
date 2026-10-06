<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { useCommunicationStore } from "../../application/communication.store.js";
import { usePatientStore } from "../../../patients/application/patient.store.js";

const toast = useToast();
const communicationStore = useCommunicationStore();
const patientStore = usePatientStore();

const selectedPatientId = ref(1);
const linkedWorkshop = ref('Ortopedia Avanzada S.A.C. (Ing. Roberto Valdivia)');

const selectedModules = ref([
  'symmetry',
  'impact_alerts',
  'clinical_notes'
]);

const technicalNotes = ref(
    'Paciente Carlos Mendoza presenta leve compensación con inclinación lateral hacia el lado sano a partir del minuto 18 de marcha. Se recomienda revisar el ángulo estático del pilón o eventual recalibración de la flexión del tobillo en el siguiente mantenimiento preventivo.'
);

const patientOptions = computed(() => {
  if (patientStore.patients && patientStore.patients.length > 0) {
    return patientStore.patients.map(p => ({
      label: `${p.fullName} (DNI ${p.dni})`,
      value: p.id
    }));
  }
  return [
    { label: 'Carlos Mendoza Arias (DNI 45892104)', value: 1 },
    { label: 'Roberto Sánchez P. (DNI 40129845)', value: 2 },
    { label: 'María Vega Castro (DNI 10845921)', value: 3 },
    { label: 'Jorge Alarcón Ruiz (DNI 72458912)', value: 4 }
  ];
});

watch(selectedPatientId, (newId) => {
  const patient = patientStore.getPatientById(newId);
  if (patient && newId !== 1) {
    technicalNotes.value = `Paciente ${patient.fullName} (${patient.amputation}) presenta nivel de actividad ${patient.kLevel} con prótesis ${patient.prosthesisCode}. Se remiten curvas cinemáticas y simetría bilateral (${patient.symmetry}%) para calibración y revisión técnica.`;
  } else if (newId === 1) {
    technicalNotes.value = 'Paciente Carlos Mendoza presenta leve compensación con inclinación lateral hacia el lado sano a partir del minuto 18 de marcha. Se recomienda revisar el ángulo estático del pilón o eventual recalibración de la flexión del tobillo en el siguiente mantenimiento preventivo.';
  }
});

const isTransmitting = ref(false);
const transmissions = computed(() => communicationStore.transmissions);

onMounted(() => {
  if (!communicationStore.transmissionsLoaded) {
    communicationStore.fetchTransmissions();
  }
  if (!patientStore.patientsLoaded) {
    patientStore.fetchPatients();
  }
});

async function handleTransmit() {
  if (!technicalNotes.value.trim()) {
    toast.add({
      severity: 'warn',
      summary: 'Campos Incompletos',
      detail: 'Por favor ingresa las observaciones técnicas para el protesista.',
      life: 3000
    });
    return;
  }

  isTransmitting.value = true;
  try {
    const selectedPatient = patientOptions.value.find(p => p.value === selectedPatientId.value);
    await communicationStore.transmitReport({
      patientId: selectedPatientId.value,
      patientName: selectedPatient ? selectedPatient.label.split(' (')[0] : 'Carlos Mendoza Arias',
      patientDni: '45892104',
      workshopName: linkedWorkshop.value,
      sharedModules: selectedModules.value,
      technicalNotes: technicalNotes.value,
      summary: 'Informe de marcha y observaciones de alineación estática.'
    });

    toast.add({
      severity: 'success',
      summary: 'Ficha Transmitida',
      detail: `La información biomecánica fue enviada exitosamente a ${linkedWorkshop.value}.`,
      life: 4500
    });
  } finally {
    isTransmitting.value = false;
  }
}
</script>

<template>
  <div class="workshop-coordination-page">
    <!-- Page Header -->
    <header class="page-header">
      <div>
        <h1 class="page-title">Coordinación con Centros Ortopédicos</h1>
        <p class="page-subtitle">
          Comparte información biomecánica relevante con el taller para ajustes técnicos y calibración
        </p>
      </div>
    </header>

    <!-- Main Transmission Form Card -->
    <section class="card form-card">
      <div class="card-header">
        <h2 class="card-title">Transmitir Reporte Biomecánico al Taller Ortopédico</h2>
        <p class="card-subtitle">
          El centro ortopédico recibirá acceso exclusivo de solo lectura a los datos seleccionados
        </p>
      </div>

      <!-- Two Column Form Row -->
      <div class="form-grid">
        <div class="form-field">
          <label class="field-label">Paciente Seleccionado</label>
          <pv-select
              v-model="selectedPatientId"
              :options="patientOptions"
              optionLabel="label"
              optionValue="value"
              class="w-full custom-select"
          />
        </div>

        <div class="form-field">
          <label class="field-label">Centro Ortopédico Vinculado</label>
          <div class="readonly-input">
            {{ linkedWorkshop }}
          </div>
        </div>
      </div>

      <!-- Modules to Share -->
      <div class="modules-section">
        <label class="modules-title">Selecciona los módulos a compartir:</label>

        <div class="checkbox-list">
          <label class="checkbox-item">
            <input
                type="checkbox"
                value="symmetry"
                v-model="selectedModules"
                class="custom-cb"
            />
            <span>Informe de Simetría Bilateral de las últimas 4 semanas (Curvas cinemáticas).</span>
          </label>

          <label class="checkbox-item">
            <input
                type="checkbox"
                value="impact_alerts"
                v-model="selectedModules"
                class="custom-cb"
            />
            <span>Historial de alertas de sobrecarga de impacto en talón protésico.</span>
          </label>

          <label class="checkbox-item">
            <input
                type="checkbox"
                value="clinical_notes"
                v-model="selectedModules"
                class="custom-cb"
            />
            <span>Notas y comentarios clínicos de alineación redactados por el fisioterapeuta.</span>
          </label>

          <label class="checkbox-item checkbox-item--disabled">
            <input
                type="checkbox"
                disabled
                class="custom-cb"
            />
            <span class="text-disabled">Historial médico de patologías de base del paciente (Bloqueado por secreto médico).</span>
          </label>
        </div>
      </div>

      <!-- Technical Observations Textarea -->
      <div class="notes-section">
        <label class="notes-title">Observaciones Técnicas para el Protesista</label>
        <textarea
            v-model="technicalNotes"
            rows="4"
            class="notes-textarea"
            placeholder="Escribe recomendaciones técnicas o incidencias biomecánicas observadas durante la marcha..."
        />
      </div>

      <!-- Submit Action Button -->
      <div class="form-actions">
        <button
            type="button"
            class="btn-transmit"
            :disabled="isTransmitting"
            @click="handleTransmit"
        >
          <i class="pi pi-send" />
          <span>{{ isTransmitting ? 'Transmitiendo...' : 'Transmitir Ficha al Taller Ortopédico' }}</span>
        </button>
      </div>
    </section>

    <!-- Transmissions History Card -->
    <section class="card history-card">
      <div class="history-header">
        <h2 class="history-title">Historial de Transmisiones con Ortopedias</h2>
      </div>

      <div class="history-list">
        <article
            v-for="item in transmissions"
            :key="item.id"
            class="history-item"
        >
          <div class="history-item__left">
            <h3 class="history-item-title">
              {{ item.patientName }} — {{ item.workshopName }}
            </h3>
            <p class="history-item-sub">
              {{ item.summary || 'Informe de adaptación inicial y 300,000 ciclos acumulados.' }}
            </p>
          </div>

          <div class="history-item__right">
            <span class="status-badge-confirmed">
              {{ item.statusLabel }}
            </span>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.workshop-coordination-page {
  padding: 1.5rem 2rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1200px;
}

/* Page Header */
.page-header {
  margin-bottom: 0.25rem;
}
.page-title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: #1a2838;
}
.page-subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.8125rem;
  color: #64748b;
}

/* Card Container */
.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.75rem 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.card-header {
  margin-bottom: 1.5rem;
}
.card-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
}
.card-subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.8125rem;
  color: #64748b;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.75rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.field-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #334155;
}

.readonly-input {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.65rem 0.9rem;
  font-size: 0.84375rem;
  color: #334155;
  min-height: 42px;
  display: flex;
  align-items: center;
}

/* Modules Checkboxes */
.modules-section {
  margin-bottom: 1.75rem;
}
.modules-title {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.75rem;
}
.checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}
.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.8125rem;
  color: #334155;
  cursor: pointer;
}
.checkbox-item--disabled {
  cursor: not-allowed;
}
.custom-cb {
  width: 16px;
  height: 16px;
  accent-color: #0f766e;
  cursor: pointer;
}
.custom-cb:disabled {
  cursor: not-allowed;
}
.text-disabled {
  color: #94a3b8;
}

/* Notes Section */
.notes-section {
  margin-bottom: 1.75rem;
}
.notes-title {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.5rem;
}
.notes-textarea {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.85rem 1rem;
  font-family: inherit;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: #1e293b;
  resize: vertical;
  background: #f8fafc;
  outline: none;
  transition: border-color 0.15s ease;
}
.notes-textarea:focus {
  border-color: #0f766e;
  background: #ffffff;
}

/* Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
}
.btn-transmit {
  background: #0f766e;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.4rem;
  font-size: 0.84375rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.btn-transmit:hover:not(:disabled) {
  background: #0d655e;
}
.btn-transmit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* History Card */
.history-card {
  padding: 1.5rem 2rem;
}
.history-title {
  margin: 0 0 1rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
}
.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border: 1px solid #f1f5f9;
  background: #f8fafc;
  border-radius: 8px;
}
.history-item-title {
  margin: 0;
  font-size: 0.84375rem;
  font-weight: 700;
  color: #0f172a;
}
.history-item-sub {
  margin: 0.2rem 0 0;
  font-size: 0.78125rem;
  color: #64748b;
}

.status-badge-confirmed {
  font-size: 0.6875rem;
  font-weight: 700;
  color: #059669;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  padding: 0.3rem 0.75rem;
  border-radius: 6px;
  white-space: nowrap;
}

.text-secondary {
  color: #64748b;
}
.font-normal {
  font-weight: 400;
}
</style>
