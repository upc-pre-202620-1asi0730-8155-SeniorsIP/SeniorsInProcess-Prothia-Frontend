<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { useMonitoringStore } from "../../../monitoring/application/monitoring.store.js";

const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const monitoringStore = useMonitoringStore();

const isPaused = ref(false);
const secondsElapsed = ref(14 * 60 + 28); // 14:28 as in screenshot
let timerInterval = null;

const isAnomalyMode = ref(false);

onMounted(() => {
  timerInterval = setInterval(() => {
    if (!isPaused.value) {
      secondsElapsed.value++;
    }
  }, 1000);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});

const formattedTime = computed(() => {
  const mins = Math.floor(secondsElapsed.value / 60);
  const secs = secondsElapsed.value % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
});

function togglePause() {
  isPaused.value = !isPaused.value;
  toast.add({
    severity: 'info',
    summary: isPaused.value ? 'Sesión Pausada' : 'Sesión Reanudada',
    detail: isPaused.value ? 'La telemetría en vivo está en pausa.' : 'Continuando captura a 100 Hz.',
    life: 2000
  });
}

function finishSession() {
  monitoringStore.recordGaitSession({
    id: Date.now(),
    datetime: 'Hoy ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: formattedTime.value,
    steps: '1,420',
    cadence: '98 pasos/min',
    symmetry: '94% (Excelente)',
    symmetryType: 'green',
    alerts: isAnomalyMode.value ? '1 compensación' : '0 incidentes',
    alertType: isAnomalyMode.value ? 'yellow' : 'green',
    impact: isAnomalyMode.value ? '1,150 N' : '680 N'
  });

  toast.add({
    severity: 'success',
    summary: 'Sesión Finalizada',
    detail: `Caminata de ${formattedTime.value} guardada con 94% de simetría promedio.`,
    life: 4000
  });
  router.push('/patient/gait-history');
}

function setMode(anomaly) {
  isAnomalyMode.value = anomaly;
  if (anomaly) {
    toast.add({
      severity: 'warn',
      summary: 'Alerta Biofeedback: Compensación Detectada',
      detail: 'Inclinación lateral a +14.2° excede el umbral de seguridad clínica.',
      life: 3500
    });
  } else {
    toast.add({
      severity: 'info',
      summary: 'Marcha Normalizada',
      detail: 'Retorno a alineación óptima (1.2°).',
      life: 2500
    });
  }
}
</script>

<template>
  <div class="live-telemetry-page">
    <!-- Sub-header Session Bar -->
    <header class="telemetry-session-bar">
      <div class="session-status">
        <span class="session-brand">PROTHIA</span>
        <span class="live-indicator">
          <span class="pulsing-dot" />
          SESIÓN EN VIVO
        </span>
      </div>

      <div class="timer-display">
        <span class="timer-label">Tiempo de marcha:</span>
        <span class="timer-digits">{{ formattedTime }}</span>
      </div>

      <div class="session-actions">
        <button
            type="button"
            class="btn-session-pause"
            @click="togglePause"
        >
          {{ isPaused ? t('patient-portal.live-telemetry.resume') : t('patient-portal.live-telemetry.pause') }}
        </button>
        <button
            type="button"
            class="btn-session-end"
            @click="finishSession"
        >
          {{ t('patient-portal.live-telemetry.finish') }}
        </button>
      </div>
    </header>

    <!-- Feedback Banner (Green in Normal, Amber in Anomaly) -->
    <section
        class="feedback-banner"
        :class="isAnomalyMode ? 'feedback-banner--warning' : 'feedback-banner--optimal'"
    >
      <div class="banner-icon-box">
        <i :class="isAnomalyMode ? 'pi pi-exclamation-triangle' : 'pi pi-check'" />
      </div>

      <div class="banner-text">
        <h2 class="banner-title">
          {{ isAnomalyMode ? 'INCLINACIÓN LATERAL ANÓMALA DETECTADA (+14.2°)' : 'MARCHA ESTABLE Y SIMÉTRICA' }}
        </h2>
        <p class="banner-desc">
          {{ isAnomalyMode
            ? 'Los sensores reportan compensación pélvica lateral hacia el lado sano. Reajusta tu postura y apoya gradualmente el talón protésico.'
            : 'Los sensores reportan una cadencia constante sin compensaciones lumbares ni inclinación lateral. Mantén la vista al frente y el braceo coordinado.'
          }}
        </p>
      </div>

      <span class="banner-updated">Actualizado hace 1 seg</span>
    </section>

    <!-- Main Telemetry Grid (Biomechanics on left, 4 Metrics on right) -->
    <div class="telemetry-main-grid">
      <!-- Left: Biomechanical Alignment (Clinical Goniometer & Posture Axis) -->
      <article
          class="biomechanical-card"
          :class="{ 'biomechanical-card--warning': isAnomalyMode }"
      >
        <div class="bio-card__header">
          <h3 class="bio-card__title">ALINEACIÓN BIOMECÁNICA</h3>
          <span
              class="deviation-tag"
              :class="isAnomalyMode ? 'deviation-tag--warning' : 'deviation-tag--optimal'"
          >
            {{ isAnomalyMode ? 'Desviación: +14.2° (Anómala)' : 'Desviación: 1.2° (Normal)' }}
          </span>
        </div>

        <!-- Clinical Posture Gauge / Goniometer Axis Display -->
        <div class="posture-stage">
          <svg class="posture-svg" viewBox="0 0 240 280">
            <!-- Center Plumb Line Axis (0° Line) -->
            <line x1="120" y1="20" x2="120" y2="260" stroke="rgba(255, 255, 255, 0.15)" stroke-dasharray="3,3" />

            <!-- Degree Radial Arc Background -->
            <path d="M 60,60 A 90,90 0 0 1 180,60" fill="none" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1.5" />
            <text x="60" y="52" fill="#64748b" font-size="9" text-anchor="middle">-15°</text>
            <text x="120" y="38" fill="#64748b" font-size="9" text-anchor="middle">0°</text>
            <text x="180" y="52" fill="#64748b" font-size="9" text-anchor="middle">+15°</text>

            <!-- Anatomical Biomechanical Limb Vector -->
            <g :transform="`rotate(${isAnomalyMode ? 14.2 : 1.2}, 120, 220)`" class="limb-group">
              <!-- Pelvis Bar -->
              <line x1="85" y1="80" x2="155" y2="80" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" />

              <!-- Sound Leg (Left) -->
              <line x1="90" y1="80" x2="90" y2="150" stroke="#94a3b8" stroke-width="2.5" />
              <circle cx="90" cy="150" r="4" fill="#64748b" />
              <line x1="90" y1="150" x2="90" y2="220" stroke="#94a3b8" stroke-width="2.5" />
              <line x1="90" y1="220" x2="105" y2="220" stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round" />

              <!-- Prosthetic Leg (Right - Highlighted in Teal / Warning in Anomaly) -->
              <line x1="150" y1="80" x2="150" y2="150" :stroke="isAnomalyMode ? '#f59e0b' : '#14b8a6'" stroke-width="3" />
              <circle cx="150" cy="150" r="4" :fill="isAnomalyMode ? '#f59e0b' : '#14b8a6'" />

              <!-- Transtibial Carbon Pylon -->
              <line x1="150" y1="150" x2="150" y2="220" :stroke="isAnomalyMode ? '#f59e0b' : '#2dd4bf'" stroke-width="3.5" stroke-dasharray="4,2" />

              <!-- Active IMU Node (Pulsing sensor dot) -->
              <circle cx="150" cy="175" r="5" :fill="isAnomalyMode ? '#f59e0b' : '#10b981'" />
              <circle cx="150" cy="175" r="9" :stroke="isAnomalyMode ? '#f59e0b' : '#10b981'" fill="none" opacity="0.6" />

              <!-- Carbon Trias Foot -->
              <line x1="150" y1="220" x2="168" y2="220" :stroke="isAnomalyMode ? '#f59e0b' : '#14b8a6'" stroke-width="3.5" stroke-linecap="round" />
            </g>

            <!-- Angle Plumb Indicator Pointer -->
            <line
                x1="120"
                y1="45"
                :x2="120 + (isAnomalyMode ? 32 : 3)"
                y2="60"
                :stroke="isAnomalyMode ? '#f59e0b' : '#10b981'"
                stroke-width="2"
            />
          </svg>

          <!-- Degree Readout Pill -->
          <div class="angle-readout">
            <span class="readout-label">Ángulo Coronal:</span>
            <span
                class="readout-value"
                :class="isAnomalyMode ? 'readout-value--warning' : 'readout-value--optimal'"
            >
              {{ isAnomalyMode ? '+14.2°' : '1.2°' }}
            </span>
          </div>
        </div>

        <div class="bio-card__footer">
          <span class="sensor-tag">
            <span class="dot-green" />
            IMU Transtibial #084
          </span>
          <span class="freq-tag">100 Hz Muestreo</span>
        </div>
      </article>

      <!-- Right: 4 Telemetry Metrics Grid -->
      <div class="metrics-grid">
        <!-- Metric 1: Cadencia Instantánea -->
        <article class="metric-card">
          <div class="metric-card__top">
            <span class="metric-label">{{ t('patient-portal.live-telemetry.cadence') }}</span>
            <span class="status-pill status-pill--teal">Rango Óptimo</span>
          </div>
          <div class="metric-val-row">
            <span class="metric-big">{{ isAnomalyMode ? '82' : '98' }}</span>
            <span class="metric-unit">pasos / min</span>
          </div>
          <p class="metric-sub">Meta clínica: 90 - 105 pasos/min</p>
          <div class="metric-bar-track">
            <div
                class="metric-bar-fill"
                :style="{ width: isAnomalyMode ? '68%' : '88%' }"
            />
          </div>
        </article>

        <!-- Metric 2: Distribución de Apoyo -->
        <article class="metric-card">
          <div class="metric-card__top">
            <span class="metric-label">{{ t('patient-portal.live-telemetry.distribution') }}</span>
            <span class="status-pill status-pill--teal">
              {{ isAnomalyMode ? '78% Simetría' : '94% Simetría' }}
            </span>
          </div>
          <div class="distribution-bars">
            <div class="dist-row">
              <span class="dist-name">Pierna Sana</span>
              <div class="dist-track">
                <div class="dist-fill dist-fill--sana" :style="{ width: isAnomalyMode ? '64%' : '52%' }" />
              </div>
              <span class="dist-pct">{{ isAnomalyMode ? '64%' : '52%' }}</span>
            </div>
            <div class="dist-row">
              <span class="dist-name">Prótesis (Derecha)</span>
              <div class="dist-track">
                <div class="dist-fill dist-fill--protesis" :style="{ width: isAnomalyMode ? '36%' : '48%' }" />
              </div>
              <span class="dist-pct">{{ isAnomalyMode ? '36%' : '48%' }}</span>
            </div>
          </div>
          <p class="metric-sub">
            {{ isAnomalyMode ? 'Alerta: Descarga asimétrica sobre miembro residual.' : 'Equilibrio biomecánico excelente (±4% umbral).' }}
          </p>
        </article>

        <!-- Metric 3: Ángulo de Flexión -->
        <article class="metric-card">
          <div class="metric-card__top">
            <span class="metric-label">{{ t('patient-portal.live-telemetry.knee-angle') }}</span>
            <span class="status-pill status-pill--teal">Zona Segura</span>
          </div>
          <div class="metric-val-row">
            <span class="metric-big">{{ isAnomalyMode ? '48°' : '58°' }}</span>
            <span class="metric-unit">en despegue</span>
          </div>
          <p class="metric-sub">Fase oscilatoria normal (55° - 65°)</p>
          <div class="metric-bar-track">
            <div
                class="metric-bar-fill"
                :style="{ width: isAnomalyMode ? '58%' : '76%' }"
            />
          </div>
        </article>

        <!-- Metric 4: Pico de Carga -->
        <article class="metric-card">
          <div class="metric-card__top">
            <span class="metric-label">{{ t('patient-portal.live-telemetry.impact-load') }}</span>
            <span class="status-pill status-pill--plain">{{ isAnomalyMode ? '1,150 N' : '680 N' }}</span>
          </div>
          <div class="metric-val-row">
            <span class="metric-big">{{ isAnomalyMode ? '1.45' : '1.02' }}</span>
            <span class="metric-unit">x Peso Corporal</span>
          </div>
          <p class="metric-sub">Amortiguación de carbono activa</p>
          <div class="metric-bar-track">
            <div
                class="metric-bar-fill"
                :class="{ 'metric-bar-fill--warning': isAnomalyMode }"
                :style="{ width: isAnomalyMode ? '90%' : '54%' }"
            />
          </div>
        </article>
      </div>
    </div>

    <!-- Bottom Simulation Control Bar (matching screenshot) -->
    <footer class="simulation-bar">
      <span class="simulation-title">
        Simulación interactiva de biofeedback para pruebas de usuario:
      </span>
      <div class="simulation-buttons">
        <button
            type="button"
            class="btn-sim"
            :class="{ 'btn-sim--active': !isAnomalyMode }"
            @click="setMode(false)"
        >
          Modo Normal
        </button>
        <button
            type="button"
            class="btn-sim btn-sim--anomaly"
            :class="{ 'btn-sim--active-anomaly': isAnomalyMode }"
            @click="setMode(true)"
        >
          Simular Inclinación Anómala
        </button>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.live-telemetry-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1360px;
  margin: 0 auto;
}

/* Session Header Bar */
.telemetry-session-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background: #082136;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
}

.session-status {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.session-brand {
  font-weight: 800;
  font-size: 0.95rem;
  letter-spacing: 0.04em;
  color: #ffffff;
}

.live-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #34d399;
  font-size: 0.6875rem;
  font-weight: 800;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  letter-spacing: 0.05em;
}

.pulsing-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 8px #34d399;
}

.timer-display {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: #041322;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 0.4rem 1.25rem;
  border-radius: 999px;
}

.timer-label {
  font-size: 0.8125rem;
  color: #94a3b8;
}

.timer-digits {
  font-size: 1.15rem;
  font-weight: 800;
  font-family: monospace;
  color: #38bdf8;
}

.session-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-session-pause {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #e2e8f0;
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 0.5rem 1.1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-session-pause:hover {
  background: rgba(255, 255, 255, 0.15);
}

.btn-session-end {
  background: #dc2626;
  border: none;
  color: #ffffff;
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.btn-session-end:hover {
  opacity: 0.9;
}

/* Feedback Banner */
.feedback-banner {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.15rem 1.5rem;
  border-radius: 12px;
  transition: all 0.25s ease;
}

.feedback-banner--optimal {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #ffffff;
}

.feedback-banner--warning {
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.5);
  color: #ffffff;
}

.banner-icon-box {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.feedback-banner--optimal .banner-icon-box {
  background: #0f766e;
  color: #ffffff;
}

.feedback-banner--warning .banner-icon-box {
  background: #d97706;
  color: #ffffff;
}

.banner-text {
  flex: 1;
}

.banner-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.feedback-banner--optimal .banner-title {
  color: #34d399;
}

.feedback-banner--warning .banner-title {
  color: #fbbf24;
}

.banner-desc {
  margin: 0.25rem 0 0;
  font-size: 0.8125rem;
  color: #cbd5e1;
  line-height: 1.45;
}

.banner-updated {
  font-size: 0.75rem;
  color: #94a3b8;
  white-space: nowrap;
}

/* Main Grid */
.telemetry-main-grid {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 1.5rem;
}

/* Biomechanical Card */
.biomechanical-card {
  background: #071c2f;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: border-color 0.25s ease;
}

.biomechanical-card--warning {
  border-color: rgba(245, 158, 11, 0.5);
}

.bio-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bio-card__title {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #38bdf8;
}

.deviation-tag {
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
}

.deviation-tag--optimal {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.4);
}

.deviation-tag--warning {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.5);
}

.posture-stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
  position: relative;
}

.posture-svg {
  width: 220px;
  height: 250px;
}

.limb-group {
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.angle-readout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #041322;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  margin-top: 0.5rem;
}

.readout-label {
  font-size: 0.6875rem;
  color: #94a3b8;
}

.readout-value {
  font-size: 0.875rem;
  font-weight: 800;
}

.readout-value--optimal {
  color: #34d399;
}

.readout-value--warning {
  color: #fbbf24;
}

.bio-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.75rem;
}

.sensor-tag {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: #cbd5e1;
  font-weight: 600;
}

.dot-green {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
}

.freq-tag {
  color: #38bdf8;
  font-weight: 700;
}

/* Right: 4 Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.metric-card {
  background: #071c2f;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.35rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.metric-card__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-label {
  font-size: 0.65625rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #94a3b8;
}

.status-pill {
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}

.status-pill--teal {
  background: rgba(20, 184, 166, 0.15);
  color: #2dd4bf;
}

.status-pill--plain {
  color: #94a3b8;
}

.metric-val-row {
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
  margin: 0.6rem 0 0.2rem;
}

.metric-big {
  font-size: 2.25rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
}

.metric-unit {
  font-size: 0.8125rem;
  color: #94a3b8;
  font-weight: 600;
}

.metric-sub {
  margin: 0;
  font-size: 0.75rem;
  color: #64748b;
}

.metric-bar-track {
  height: 6px;
  background: #041322;
  border-radius: 999px;
  overflow: hidden;
  margin-top: 1rem;
}

.metric-bar-fill {
  height: 100%;
  background: #0f766e;
  border-radius: 999px;
  transition: width 0.3s ease;
}

.metric-bar-fill--warning {
  background: #f59e0b;
}

/* Distribution Bars */
.distribution-bars {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin: 0.75rem 0;
}

.dist-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
}

.dist-name {
  width: 110px;
  color: #cbd5e1;
  font-weight: 600;
}

.dist-track {
  flex: 1;
  height: 6px;
  background: #041322;
  border-radius: 999px;
  overflow: hidden;
}

.dist-fill--sana {
  height: 100%;
  background: #94a3b8;
  border-radius: 999px;
}

.dist-fill--protesis {
  height: 100%;
  background: #0d9488;
  border-radius: 999px;
}

.dist-pct {
  width: 32px;
  text-align: right;
  font-weight: 700;
  color: #ffffff;
}

/* Simulation Bar */
.simulation-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #071c2f;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 0.9rem 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.simulation-title {
  font-size: 0.8125rem;
  color: #94a3b8;
  font-weight: 600;
}

.simulation-buttons {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-sim {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #94a3b8;
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 0.45rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-sim--active {
  background: #0f766e !important;
  border-color: #0f766e !important;
  color: #ffffff !important;
}

.btn-sim--anomaly:hover {
  border-color: #d97706;
  color: #fbbf24;
}

.btn-sim--active-anomaly {
  background: #d97706 !important;
  border-color: #d97706 !important;
  color: #ffffff !important;
}

@media (max-width: 960px) {
  .telemetry-main-grid {
    grid-template-columns: 1fr;
  }
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
