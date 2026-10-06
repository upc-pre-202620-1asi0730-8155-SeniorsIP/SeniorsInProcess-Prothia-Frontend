<script setup>
import { ref, computed } from "vue";
import { useMonitoringStore } from "../../../monitoring/application/monitoring.store.js";

const monitoringStore = useMonitoringStore();

const activePeriod = ref('month');
const selectedSession = ref(null);
const showDetailDialog = ref(false);

const periods = [
  { label: 'Últimos 7 días', value: 'week' },
  { label: 'Último mes', value: 'month' },
  { label: 'Últimos 3 meses', value: 'quarter' }
];

const weeklyTrend = [
  { week: 'Semana 31', symmetry: 82, cadence: 84 },
  { week: 'Semana 32', symmetry: 87, cadence: 88 },
  { week: 'Semana 33', symmetry: 89, cadence: 92 },
  { week: 'Semana 34 (Actual)', symmetry: 92, cadence: 96, isCurrent: true }
];

const sessions = computed(() => monitoringStore.gaitSessions);

function openSessionDetail(session) {
  selectedSession.value = session;
  showDetailDialog.value = true;
}
</script>

<template>
  <div class="gait-history-page">
    <!-- Header with Period Filter -->
    <header class="history-header">
      <div>
        <h1 class="history-title">Historial Biomecánico</h1>
        <p class="history-subtitle">
          Evolución longitudinal de tu marcha, simetría y sesiones domiciliarias.
        </p>
      </div>

      <div class="period-toggle">
        <button
            v-for="p in periods"
            :key="p.value"
            type="button"
            class="btn-period"
            :class="{ 'btn-period--active': activePeriod === p.value }"
            @click="activePeriod = p.value"
        >
          {{ p.label }}
        </button>
      </div>
    </header>

    <!-- 3 KPI Cards -->
    <section class="kpi-grid">
      <article class="kpi-card">
        <span class="kpi-label">PASOS ACUMULADOS</span>
        <span class="kpi-number">118,450</span>
        <span class="kpi-change">+14% vs. mes anterior</span>
      </article>

      <article class="kpi-card">
        <span class="kpi-label">SIMETRÍA MEDIA DE MARCHA</span>
        <span class="kpi-number kpi-number--teal">92.4%</span>
        <span class="kpi-meta">Rango clínico: Óptimo</span>
      </article>

      <article class="kpi-card">
        <span class="kpi-label">HORAS DE ACTIVIDAD CON PRÓTESIS</span>
        <span class="kpi-number">28.5 hrs</span>
        <span class="kpi-meta">Promedio diario: 1.4 hrs/día</span>
      </article>
    </section>

    <!-- Trend Card (Bar Chart) -->
    <section class="trend-card">
      <div class="trend-card__header">
        <div>
          <h2 class="trend-title">Tendencia de Simetría y Cadencia</h2>
          <p class="trend-subtitle">Progresión semanal en las últimas 4 semanas</p>
        </div>

        <div class="trend-legend">
          <span class="legend-item"><span class="legend-dot legend-dot--teal" /> Simetría (%)</span>
          <span class="legend-item"><span class="legend-dot legend-dot--navy" /> Cadencia (pasos/min)</span>
        </div>
      </div>

      <!-- Bar Chart matching screenshot -->
      <div class="trend-chart">
        <div
            v-for="col in weeklyTrend"
            :key="col.week"
            class="trend-col"
        >
          <span class="col-value">{{ col.symmetry }}%</span>
          <div class="col-track">
            <div
                class="col-bar"
                :class="{ 'col-bar--current': col.isCurrent }"
                :style="{ height: `${col.symmetry}%` }"
            />
          </div>
          <span class="col-label" :class="{ 'col-label--current': col.isCurrent }">
            {{ col.week }}
          </span>
        </div>
      </div>

      <p class="trend-footer-note">
        La asimetría inicial de carga disminuyó de 18% a solo 8% gracias a los ejercicios de equilibrio.
      </p>
    </section>

    <!-- Sessions Table Card -->
    <section class="sessions-card">
      <div class="sessions-card__header">
        <h2 class="sessions-title">Detalle de Sesiones de Marcha Recientes</h2>
        <span class="sessions-count">Mostrando 5 de 24 sesiones</span>
      </div>

      <div class="table-container">
        <table class="sessions-table">
          <thead>
          <tr>
            <th>FECHA Y HORA</th>
            <th>DURACIÓN</th>
            <th>PASOS</th>
            <th>CADENCIA MEDIA</th>
            <th>SIMETRÍA</th>
            <th>ALERTAS POSTURALES</th>
            <th class="right">ACCIÓN</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="s in sessions" :key="s.id">
            <td class="date-cell">{{ s.datetime }}</td>
            <td>{{ s.duration }}</td>
            <td class="steps-cell">{{ s.steps }}</td>
            <td>{{ s.cadence }}</td>
            <td class="symmetry-cell">{{ s.symmetry }}</td>
            <td>
                <span
                    class="alert-pill"
                    :class="`alert-pill--${s.alertType}`"
                >
                  {{ s.alerts }}
                </span>
            </td>
            <td class="right">
              <button
                  type="button"
                  class="btn-telemetry-link"
                  @click="openSessionDetail(s)"
              >
                Ver telemetría
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Telemetry Session Detail Dialog -->
    <pv-dialog
        v-model:visible="showDetailDialog"
        modal
        header="Desglose Telemétrico de Sesión"
        :style="{ width: '500px' }"
    >
      <div v-if="selectedSession" class="session-modal-content">
        <div class="modal-summary">
          <p><strong>Sesión:</strong> {{ selectedSession.datetime }}</p>
          <p><strong>Duración:</strong> {{ selectedSession.duration }} • <strong>Pasos:</strong> {{ selectedSession.steps }}</p>
          <p><strong>Simetría Registrada:</strong> {{ selectedSession.symmetry }}</p>
          <p><strong>Fuerza de Contacto Pico:</strong> {{ selectedSession.impact }}</p>
          <p><strong>Alertas Posturales:</strong> {{ selectedSession.alerts }}</p>
        </div>
      </div>
      <template #footer>
        <pv-button label="Cerrar" text @click="showDetailDialog = false" />
      </template>
    </pv-dialog>
  </div>
</template>

<style scoped>
.gait-history-page {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.history-title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--pt-navy-900);
}

.history-subtitle {
  margin: 0.35rem 0 0;
  font-size: 0.84375rem;
  color: #64748b;
}

.period-toggle {
  display: flex;
  background: #e2e8f0;
  padding: 0.25rem;
  border-radius: 9px;
  gap: 0.2rem;
}

.btn-period {
  background: transparent;
  border: none;
  font-size: 0.78125rem;
  font-weight: 700;
  color: #475569;
  padding: 0.45rem 0.9rem;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-period:hover {
  color: var(--pt-navy-900);
}

.btn-period--active {
  background: #0f766e;
  color: #ffffff !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 3 KPI Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.kpi-card {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid var(--pt-border);
  box-shadow: 0 1px 3px rgba(10, 31, 51, 0.04);
  padding: 1.35rem 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.kpi-label {
  font-size: 0.65625rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #64748b;
}

.kpi-number {
  font-size: 2rem;
  font-weight: 800;
  color: var(--pt-navy-900);
  line-height: 1.1;
}

.kpi-number--teal {
  color: #0f766e;
}

.kpi-change {
  font-size: 0.75rem;
  font-weight: 700;
  color: #16a34a;
}

.kpi-meta {
  font-size: 0.75rem;
  color: #64748b;
}

/* Trend Card */
.trend-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid var(--pt-border);
  box-shadow: 0 1px 3px rgba(10, 31, 51, 0.04);
  padding: 1.75rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.trend-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.trend-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--pt-navy-900);
}

.trend-subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.8125rem;
  color: #64748b;
}

.trend-legend {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  font-size: 0.75rem;
  color: #475569;
  font-weight: 600;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-dot--teal { background: #14b8a6; }
.legend-dot--navy { background: #0f766e; }

.trend-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 200px;
  padding: 1.5rem 2rem 0.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.trend-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
  gap: 0.5rem;
  width: 90px;
}

.col-value {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--pt-navy-900);
}

.col-track {
  width: 44px;
  height: 140px;
  background: #f1f5f9;
  border-radius: 8px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.col-bar {
  width: 100%;
  background: #2dd4bf;
  border-radius: 8px;
  transition: height 0.4s ease;
}

.col-bar--current {
  background: #0f766e;
}

.col-label {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
  text-align: center;
}

.col-label--current {
  color: var(--pt-navy-900);
  font-weight: 800;
}

.trend-footer-note {
  margin: 0;
  font-size: 0.78125rem;
  color: #64748b;
}

/* Sessions Card */
.sessions-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid var(--pt-border);
  box-shadow: 0 1px 3px rgba(10, 31, 51, 0.04);
  padding: 1.75rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.sessions-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sessions-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--pt-navy-900);
}

.sessions-count {
  font-size: 0.78125rem;
  color: #64748b;
}

.table-container {
  overflow-x: auto;
}

.sessions-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
  text-align: left;
}

.sessions-table th {
  padding: 0.85rem 1rem;
  font-size: 0.65625rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #64748b;
  text-transform: uppercase;
  border-bottom: 1px solid #eef2f6;
  white-space: nowrap;
}

.sessions-table td {
  padding: 1.1rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.sessions-table tr:hover td {
  background: #f8fafc;
}

.date-cell {
  font-weight: 700;
  color: var(--pt-navy-900);
}

.steps-cell {
  font-weight: 700;
}

.symmetry-cell {
  font-weight: 700;
  color: #0f766e;
}

.alert-pill {
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  white-space: nowrap;
}

.alert-pill--green {
  background: #eaf7f0;
  color: #16a34a;
}

.alert-pill--yellow {
  background: #fef3c7;
  color: #d97706;
}

.alert-pill--orange {
  background: #ffedd5;
  color: #ea580c;
}

.right {
  text-align: right;
}

.btn-telemetry-link {
  background: transparent;
  border: none;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #0f766e;
  cursor: pointer;
  padding: 0;
  text-decoration: none;
}

.btn-telemetry-link:hover {
  text-decoration: underline;
}

.session-modal-content {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  font-size: 0.84375rem;
  color: #334155;
}

.modal-summary p {
  margin: 0.4rem 0;
}

@media (max-width: 960px) {
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>
