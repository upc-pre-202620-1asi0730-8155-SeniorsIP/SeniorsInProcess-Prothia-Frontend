<script setup>
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  prosthesis: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:visible']);
const { t } = useI18n();
const toast = useToast();

function exportReport() {
  toast.add({
    severity: 'info',
    summary: 'Exportación Generada',
    detail: `Ficha técnica de ${props.prosthesis?.serialNumber} exportada para trazabilidad clínica.`,
    life: 3000
  });
}
</script>

<template>
  <pv-dialog
      :visible="visible"
      modal
      :header="`${t('technician.modals.detail-title')} - ${prosthesis?.serialNumber || ''}`"
      :style="{ width: '640px', maxWidth: '95vw' }"
      @update:visible="emit('update:visible', $event)"
  >
    <div v-if="prosthesis" class="detail-container">
      <!-- Head telemetry banner -->
      <div class="telemetry-bar">
        <div class="telemetry-stat">
          <span class="telemetry-stat__label">Ciclos Acumulados</span>
          <span class="telemetry-stat__val">{{ prosthesis.formattedCycles }}</span>
        </div>
        <div class="telemetry-stat">
          <span class="telemetry-stat__label">Telemetría IoT</span>
          <span class="telemetry-stat__val status-online">
            <i class="pi pi-circle-fill"/> {{ prosthesis.sensorStatus === 'online' ? 'Conectado (100%)' : 'Desconectado' }}
          </span>
        </div>
        <div class="telemetry-stat">
          <span class="telemetry-stat__label">Batería Sensor</span>
          <span class="telemetry-stat__val">{{ prosthesis.batteryLevel }}%</span>
        </div>
      </div>

      <!-- Life cycle progress meter -->
      <div class="meter-box">
        <div class="meter-header">
          <span>Vida útil acumulada:</span>
          <strong>{{ prosthesis.wearPercentage }}% del umbral preventivo</strong>
        </div>
        <div class="meter-track">
          <div
              class="meter-fill"
              :class="{ 'meter-fill--critical': prosthesis.wearPercentage >= 100, 'meter-fill--warn': prosthesis.wearPercentage >= 65 }"
              :style="{ width: `${Math.min(100, prosthesis.wearPercentage)}%` }"
          />
        </div>
      </div>

      <!-- Specs breakdown -->
      <div class="specs-grid">
        <div class="spec-item">
          <span class="spec-label">Paciente Asociado:</span>
          <strong>{{ prosthesis.patientName }} ({{ prosthesis.kLevel }})</strong>
        </div>
        <div class="spec-item">
          <span class="spec-label">Clínica Vinculada:</span>
          <strong>{{ prosthesis.clinicName }}</strong>
        </div>
        <div class="spec-item">
          <span class="spec-label">Tipo de Prótesis:</span>
          <strong>{{ prosthesis.type }}</strong>
        </div>
        <div class="spec-item">
          <span class="spec-label">Último Servicio:</span>
          <strong>{{ prosthesis.lastService }}</strong>
        </div>
        <div class="spec-item">
          <span class="spec-label">Tipo de Encaje:</span>
          <strong>{{ prosthesis.socketType }}</strong>
        </div>
        <div class="spec-item">
          <span class="spec-label">Pie Protésico:</span>
          <strong>{{ prosthesis.footType }}</strong>
        </div>
        <div class="spec-item" v-if="prosthesis.kneeType && prosthesis.kneeType !== 'N/A'">
          <span class="spec-label">Módulo de Rodilla:</span>
          <strong>{{ prosthesis.kneeType }}</strong>
        </div>
      </div>

      <!-- History log -->
      <div class="history-section">
        <h4 class="history-title">Historial de Calibraciones y Servicios</h4>
        <div class="history-list">
          <div class="history-item">
            <span class="history-date">15/05/2026</span>
            <span class="history-desc">Reemplazo de encaje termoformado y ajuste por cambio volumétrico de muñón.</span>
          </div>
          <div class="history-item">
            <span class="history-date">20/03/2026</span>
            <span class="history-desc">Alineación dinámica con sensor inercial IMU y calibración de flexión de tobillo.</span>
          </div>
          <div class="history-item">
            <span class="history-date">10/01/2026</span>
            <span class="history-desc">Entrega inicial, fijación de adaptador modular y torque de tornillos a 15 Nm.</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-actions">
        <pv-button
            icon="pi pi-file-pdf"
            label="Exportar Ficha Técnica"
            text
            @click="exportReport"
        />
        <pv-button
            label="Cerrar"
            severity="secondary"
            @click="emit('update:visible', false)"
        />
      </div>
    </template>
  </pv-dialog>
</template>

<style scoped>
.detail-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 0.5rem;
}

.telemetry-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid var(--pt-border);
  border-radius: 12px;
}

.telemetry-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.telemetry-stat__label {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--pt-muted);
}

.telemetry-stat__val {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--pt-navy-900);
}

.status-online {
  color: var(--pt-green);
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.status-online .pi {
  font-size: 0.55rem;
}

.meter-box {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.85rem 1rem;
  background: #ffffff;
  border: 1px solid var(--pt-border);
  border-radius: 10px;
}

.meter-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #475569;
}

.meter-track {
  width: 100%;
  height: 8px;
  background: #eef2f6;
  border-radius: 999px;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  background: var(--pt-teal);
  border-radius: 999px;
  transition: width 0.3s ease;
}

.meter-fill--warn {
  background: var(--pt-amber);
}

.meter-fill--critical {
  background: var(--pt-red);
}

.specs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem 1.25rem;
  font-size: 0.8125rem;
}

.spec-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.spec-label {
  color: var(--pt-muted);
  font-size: 0.75rem;
}

.history-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-top: 1px solid var(--pt-border);
  padding-top: 1rem;
}

.history-title {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--pt-navy-600);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.history-item {
  display: flex;
  gap: 0.75rem;
  font-size: 0.78125rem;
  line-height: 1.4;
  color: #334155;
  padding: 0.4rem 0;
}

.history-date {
  font-weight: 700;
  color: var(--pt-teal-strong);
  flex-shrink: 0;
}

.dialog-actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>
