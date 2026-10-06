<script setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import useWorkshopStore from "../../application/workshop.store.js";
import ScheduleMaintenanceDialog from "../components/schedule-maintenance-dialog.vue";

const store = useWorkshopStore();
const toast = useToast();

const showCalibrationDialog = ref(false);
const calibrationDate = ref('20/09/2026');
const calibrationNotes = ref('Recalibración de flexión de tobillo y corrección de desbalance en ángulo estático del pilón.');

function openCalibrationModal() {
  showCalibrationDialog.value = true;
}

function confirmCalibration() {
  store.maintenances.unshift({
    id: Date.now(),
    serialNumber: 'PR-2026-TT-084',
    patientName: 'Carlos Mendoza Arias',
    scheduledDate: calibrationDate.value,
    interventionType: 'Calibración de ángulo estático y tobillo',
    technicianName: 'Ing. Roberto Valdivia',
    status: 'scheduled',
    notes: calibrationNotes.value
  });

  toast.add({
    severity: 'success',
    summary: 'Cita de Calibración Creada',
    detail: `Se agendó la calibración solicitada por Lic. Diego Salazar para Carlos Mendoza Arias el ${calibrationDate.value}.`,
    life: 4000
  });

  showCalibrationDialog.value = false;
}
</script>

<template>
  <div class="clinics-report-page">
    <div class="report-card">
      <!-- Top Reception Bar -->
      <div class="report-card__top">
        <div class="top-left">
          <span class="reception-tag">Recepción: 12/09/2026</span>
          <span class="emitter-text">Emisor: Centro de Rehabilitación Lima Sur</span>
        </div>
        <button
            type="button"
            class="btn-calibration"
            @click="openCalibrationModal"
        >
          Crear Cita de Calibración
        </button>
      </div>

      <!-- Main Report Header -->
      <div class="report-card__header">
        <h2 class="report-title">Informe Clínico: Carlos Mendoza Arias</h2>
        <p class="report-doctor">Fisioterapeuta emisor: Lic. Diego Salazar Mendoza (CTMP 14820)</p>
      </div>

      <!-- Callout Box with Therapist Observations -->
      <div class="observations-box">
        <h3 class="observations-title">OBSERVACIONES DEL FISIOTERAPEUTA PARA TALLER:</h3>
        <p class="observations-content">
          "Paciente Carlos Mendoza presenta leve compensación con inclinación lateral hacia el lado sano a partir del minuto 18 de marcha continua. En sesión presencial de hoy se descarta dolor agudo, pero sospechamos desbalance en el ángulo estático del pilón o eventual recalibración de la flexión del tobillo en el siguiente mantenimiento preventivo."
        </p>
      </div>

      <!-- 3 Metrics KPI Grid -->
      <div class="kpi-grid">
        <div class="kpi-box">
          <span class="kpi-label">SIMETRÍA ACTUAL</span>
          <span class="kpi-value kpi-value--teal">92.4%</span>
        </div>

        <div class="kpi-box">
          <span class="kpi-label">CADENCIA PROMEDIO</span>
          <span class="kpi-value kpi-value--navy">96 p/min</span>
        </div>

        <div class="kpi-box">
          <span class="kpi-label">DESVIACIÓN MÁXIMA</span>
          <span class="kpi-value kpi-value--amber">+14° Lateral</span>
        </div>
      </div>
    </div>

    <!-- Calibration Schedule Dialog Modal -->
    <pv-dialog
        v-model:visible="showCalibrationDialog"
        modal
        header="Crear Cita de Calibración Mecánica"
        :style="{ width: '480px' }"
    >
      <div class="calibration-dialog-content">
        <div class="info-alert">
          <p><strong>Paciente:</strong> Carlos Mendoza Arias (PR-2026-TT-084)</p>
          <p><strong>Clínica:</strong> Centro de Rehabilitación Lima Sur</p>
          <p><strong>Fisioterapeuta:</strong> Lic. Diego Salazar Mendoza</p>
        </div>

        <div class="field">
          <label for="calib-date">Fecha Propuesta para la Calibración en Taller</label>
          <pv-input-text
              id="calib-date"
              v-model="calibrationDate"
              placeholder="DD/MM/AAAA"
              fluid
          />
        </div>

        <div class="field">
          <label for="calib-notes">Instrucciones y Ajustes a Realizar</label>
          <pv-textarea
              id="calib-notes"
              v-model="calibrationNotes"
              rows="3"
              fluid
          />
        </div>
      </div>
      <template #footer>
        <pv-button label="Cancelar" text @click="showCalibrationDialog = false" />
        <pv-button label="Agendar Calibración" severity="success" @click="confirmCalibration" />
      </template>
    </pv-dialog>
  </div>
</template>

<style scoped>
.clinics-report-page {
  max-width: 1240px;
  margin: 0 auto;
}

.report-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid var(--pt-border);
  box-shadow: 0 1px 3px rgba(10, 31, 51, 0.05);
  padding: 1.75rem 2rem 2.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.report-card__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.top-left {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  flex-wrap: wrap;
}

.reception-tag {
  background: #e6f4f5;
  color: #0f766e;
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  letter-spacing: 0.02em;
}

.emitter-text {
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 500;
}

.btn-calibration {
  background: #0f766e;
  color: #ffffff;
  border: none;
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.15s ease, background-color 0.15s ease;
}

.btn-calibration:hover {
  background: #115e59;
}

.report-card__header {
  margin-top: -0.25rem;
}

.report-title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--pt-navy-900);
}

.report-doctor {
  margin: 0.35rem 0 0;
  font-size: 0.8125rem;
  color: #64748b;
}

/* Callout Box */
.observations-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
}

.observations-title {
  margin: 0 0 0.65rem;
  font-size: 0.6875rem;
  font-weight: 800;
  color: #475569;
  letter-spacing: 0.05em;
}

.observations-content {
  margin: 0;
  font-size: 0.84375rem;
  color: #334155;
  line-height: 1.6;
  font-style: italic;
}

/* 3 KPI Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.kpi-box {
  background: #f8fafc;
  border: 1px solid #eef2f6;
  border-radius: 12px;
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-align: center;
}

.kpi-label {
  font-size: 0.65625rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #64748b;
}

.kpi-value {
  font-size: 1.45rem;
  font-weight: 800;
  line-height: 1.1;
}

.kpi-value--teal {
  color: #0f766e;
}

.kpi-value--navy {
  color: var(--pt-navy-900);
}

.kpi-value--amber {
  color: #d97706;
}

.calibration-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 0.5rem 0;
}

.info-alert {
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

.info-alert p {
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

@media (max-width: 768px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>
