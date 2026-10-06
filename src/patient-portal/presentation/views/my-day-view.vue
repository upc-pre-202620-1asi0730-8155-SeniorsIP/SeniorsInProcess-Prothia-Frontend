<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import { usePrescriptionStore } from "../../../prescription/application/prescription.store.js";

const router = useRouter();
const toast = useToast();
const { t } = useI18n();
const prescriptionStore = usePrescriptionStore();

const isActivityDone = computed(() => {
  const target = prescriptionStore.patientExercises.find(e => e.id === 1);
  return target ? target.isDone : false;
});

const showGuideDialog = ref(false);
const showTechDetailDialog = ref(false);

const weeklyAdherence = [
  { day: 'Lun', value: 100, active: true },
  { day: 'Mar', value: 80, active: true },
  { day: 'Mié', value: 100, active: true },
  { day: 'Jue', value: 75, active: true },
  { day: 'Vie', value: 100, active: true },
  { day: 'Sáb', value: 75, active: true, isToday: true },
  { day: 'Dom', value: 0, active: false }
];

function markActivityDone() {
  prescriptionStore.markExerciseDone(1, 4);
  toast.add({
    severity: 'success',
    summary: '¡Actividad Completada!',
    detail: 'Has completado: Transferencia de Peso Lateral y Apoyo Unipodal. Tu progreso se actualizó.',
    life: 3500
  });
}

function startWalkSession() {
  router.push('/patient/live-telemetry');
}
</script>

<template>
  <div class="my-day-page">
    <!-- Greeting & Top Actions -->
    <header class="greeting-header">
      <div class="greeting-text">
        <h1 class="greeting-title">{{ t('patient-portal.my-day.greeting', { name: 'Carlos' }) }}</h1>
        <p class="greeting-subtitle">
          {{ t('patient-portal.my-day.subtitle') }}
        </p>
      </div>

      <div class="greeting-actions">
        <pv-button
            class="btn-start-walk"
            icon="pi pi-play-circle"
            :label="t('patient-portal.my-day.action-walk')"
            @click="startWalkSession"
        />
        <pv-button
            class="btn-plan-today"
            :label="t('patient-portal.my-day.action-plan')"
            outlined
            @click="router.push('/patient/exercises')"
        />
      </div>
    </header>

    <!-- 4 Metric KPI Cards -->
    <section class="kpi-grid">
      <!-- Card 1: Pasos -->
      <article class="kpi-card">
        <div class="kpi-card__top">
          <span class="kpi-label">{{ t('patient-portal.my-day.steps-title') }}</span>
          <span class="kpi-meta">{{ t('patient-portal.my-day.steps-target') }}</span>
        </div>
        <div class="kpi-card__main">
          <span class="kpi-number">4,250</span>
          <span class="kpi-percent">85%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: 85%;" />
        </div>
      </article>

      <!-- Card 2: Simetría -->
      <article class="kpi-card">
        <div class="kpi-card__top">
          <span class="kpi-label">{{ t('patient-portal.my-day.symmetry-title') }}</span>
          <span class="badge-tag badge-tag--green">Óptimo</span>
        </div>
        <div class="kpi-card__main">
          <span class="kpi-number">91%</span>
          <span class="kpi-unit">Bilateral</span>
        </div>
        <p class="kpi-subtext">Distribución: 52% sana / 48% prótesis</p>
      </article>

      <!-- Card 3: Cadencia -->
      <article class="kpi-card">
        <div class="kpi-card__top">
          <span class="kpi-label">{{ t('patient-portal.my-day.cadence-title') }}</span>
          <span class="kpi-meta">Ritmo</span>
        </div>
        <div class="kpi-card__main">
          <span class="kpi-number">96</span>
          <span class="kpi-unit">pasos/min</span>
        </div>
        <p class="kpi-subtext kpi-subtext--accent">+4 pasos/min vs. semana previa</p>
      </article>

      <!-- Card 4: Rutina -->
      <article class="kpi-card">
        <div class="kpi-card__top">
          <span class="kpi-label">{{ t('patient-portal.my-day.routine-title') }}</span>
          <span class="kpi-meta">3/4</span>
        </div>
        <div class="kpi-card__main">
          <span class="kpi-number">75%</span>
          <span class="kpi-unit">Completado</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: 75%;" />
        </div>
      </article>
    </section>

    <!-- Middle Row: Next Prescribed Activity & Weekly Adherence -->
    <section class="middle-grid">
      <!-- Activity Card -->
      <article class="prescribed-card">
        <div class="prescribed-card__top">
          <span class="prescribed-tag">TU SIGUIENTE ACTIVIDAD PRESCRITA</span>
          <span
              class="badge-pill"
              :class="isActivityDone ? 'badge-pill--done' : 'badge-pill--pending'"
          >
            {{ isActivityDone ? 'Completado hoy' : 'Pendiente de hoy' }}
          </span>
        </div>

        <h2 class="activity-title">Transferencia de Peso Lateral y Apoyo Unipodal</h2>
        <p class="activity-desc">
          Indicado por el Lic. Diego Salazar para fortalecer la musculatura del muñón y mejorar la estabilidad pélvica al momento de descargar el peso sobre la prótesis.
        </p>

        <!-- 3 Parameters Box -->
        <div class="params-box">
          <div class="param-col">
            <span class="param-label">SERIES</span>
            <span class="param-val">3 Series</span>
          </div>
          <div class="param-col">
            <span class="param-label">REPETICIONES</span>
            <span class="param-val">12 Reps</span>
          </div>
          <div class="param-col">
            <span class="param-label">DESCANSO</span>
            <span class="param-val">45 seg</span>
          </div>
        </div>

        <!-- Activity Action Buttons -->
        <div class="activity-actions">
          <button
              type="button"
              class="btn-guide"
              @click="showGuideDialog = true"
          >
            Iniciar Guía Interactiva →
          </button>
          <button
              type="button"
              class="btn-mark-done"
              :disabled="isActivityDone"
              @click="markActivityDone"
          >
            {{ isActivityDone ? t('patient-portal.my-day.marked-done') : t('patient-portal.my-day.mark-done') }}
          </button>
        </div>
      </article>

      <!-- Adherence Card -->
      <article class="adherence-card">
        <div class="adherence-card__top">
          <h2 class="adherence-title">{{ t('patient-portal.my-day.adherence-title') }}</h2>
          <span class="week-text">{{ t('patient-portal.my-day.adherence-week') }}</span>
        </div>

        <!-- Bar chart matching screenshot -->
        <div class="bar-chart-container">
          <div
              v-for="item in weeklyAdherence"
              :key="item.day"
              class="bar-column"
          >
            <span v-if="item.value > 0" class="bar-percent">{{ item.value }}%</span>
            <span v-else class="bar-percent bar-percent--empty">-</span>
            <div class="bar-track">
              <div
                  v-if="item.value > 0"
                  class="bar-fill"
                  :class="{ 'bar-fill--today': item.isToday }"
                  :style="{ height: `${item.value}%` }"
              />
            </div>
            <span class="bar-day">{{ item.day }}</span>
          </div>
        </div>

        <div class="adherence-card__footer">
          <span class="avg-text"><strong>{{ t('patient-portal.my-day.adherence-title') }}:</strong> 88%</span>
          <router-link to="/patient/gait-history" class="history-link">
            {{ t('patient-portal.my-day.view-history') }}
          </router-link>
        </div>
      </article>
    </section>

    <!-- Bottom Row: Fisioterapeuta & Dispositivo Activo -->
    <section class="bottom-grid">
      <!-- Therapist Card -->
      <article class="info-card">
        <div class="avatar-box avatar-box--teal">DS</div>
        <div class="info-card__content">
          <span class="info-category">{{ t('patient-portal.my-day.therapist-title') }}</span>
          <h3 class="info-title">Lic. Diego Salazar Mendoza</h3>
          <p class="info-meta">Centro de Rehabilitación Jesús María • Reg. CTMP 14820</p>
          <div class="info-actions">
            <router-link to="/patient/messages" class="action-btn-link">
              <i class="pi pi-envelope" /> Enviar Consulta
            </router-link>
            <span class="next-date">Próxima sesión: 18 Sept 2026</span>
          </div>
        </div>
      </article>

      <!-- Active Device Card -->
      <article class="info-card">
        <div class="avatar-box avatar-box--navy">
          <i class="pi pi-box" />
        </div>
        <div class="info-card__content">
          <span class="info-category">{{ t('patient-portal.my-day.device-title') }}</span>
          <h3 class="info-title">Prótesis Transtibial Endoesquelética</h3>
          <p class="info-meta">Fabricada por: Ortopedia Avanzada (Serie: PR-2026-TT-084)</p>
          <div class="info-actions">
            <span class="cycles-count">Ciclos: <strong>342,100</strong></span>
            <span class="status-chip-green">Estado: Excelente</span>
            <button
                type="button"
                class="action-btn-link ml-auto"
                @click="showTechDetailDialog = true"
            >
              Detalle Técnico →
            </button>
          </div>
        </div>
      </article>
    </section>

    <!-- Interactive Guide Dialog -->
    <pv-dialog
        v-model:visible="showGuideDialog"
        modal
        header="Guía Interactiva: Transferencia de Peso Lateral"
        :style="{ width: '500px' }"
    >
      <div class="guide-dialog-content">
        <ol class="steps-list">
          <li><strong>Paso 1:</strong> Apóyate suavemente en una barra o mesa firme con ambas manos a la altura de las caderas.</li>
          <li><strong>Paso 2:</strong> Desplaza lentamente tu centro de gravedad hacia la prótesis derecha durante 5 segundos.</li>
          <li><strong>Paso 3:</strong> Mantén la mirada al frente sin flexionar la columna lumbar.</li>
          <li><strong>Paso 4:</strong> Retorna a la posición bipodal equilibrada y descansa 45 segundos.</li>
        </ol>
      </div>
      <template #footer>
        <pv-button label="Cerrar" text @click="showGuideDialog = false" />
        <pv-button label="Completar Serie" severity="success" @click="() => { showGuideDialog = false; markActivityDone(); }" />
      </template>
    </pv-dialog>

    <!-- Technical Details Dialog -->
    <pv-dialog
        v-model:visible="showTechDetailDialog"
        modal
        header="Ficha Técnica: PR-2026-TT-084"
        :style="{ width: '480px' }"
    >
      <div class="tech-dialog-content">
        <p><strong>Paciente:</strong> Carlos Mendoza Arias (K3)</p>
        <p><strong>Tipo:</strong> Transtibial Carbono (Vacío Activo Harmony)</p>
        <p><strong>Pie Protésico:</strong> Pie Dinámico de Carbono Trias</p>
        <p><strong>Ciclos Telemétricos:</strong> 342,100 / 800,000 (42% vida útil)</p>
        <p><strong>Última Calibración en Taller:</strong> 15/05/2026</p>
      </div>
      <template #footer>
        <pv-button label="Entendido" severity="info" @click="showTechDetailDialog = false" />
      </template>
    </pv-dialog>
  </div>
</template>

<style scoped>
.my-day-page {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* Greeting Header */
.greeting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.greeting-title {
  margin: 0;
  font-size: 1.85rem;
  font-weight: 800;
  color: var(--pt-navy-900);
  line-height: 1.2;
}

.greeting-subtitle {
  margin: 0.35rem 0 0;
  font-size: 0.84375rem;
  color: #64748b;
}

.greeting-actions {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.btn-start-walk {
  background: #0f766e !important;
  border-color: #0f766e !important;
  color: #ffffff !important;
  font-weight: 700;
  font-size: 0.8125rem;
  border-radius: 9px;
  padding: 0.65rem 1.2rem;
}

.btn-plan-today {
  border-color: #cbd5e1 !important;
  color: var(--pt-navy-900) !important;
  font-weight: 700;
  font-size: 0.8125rem;
  border-radius: 9px;
  padding: 0.65rem 1.2rem;
  background: #ffffff !important;
}

/* 4 KPI Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.kpi-card {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid var(--pt-border);
  box-shadow: 0 1px 3px rgba(10, 31, 51, 0.04);
  padding: 1.25rem 1.4rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 125px;
}

.kpi-card__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kpi-label {
  font-size: 0.65625rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #64748b;
  text-transform: uppercase;
}

.kpi-meta {
  font-size: 0.71875rem;
  font-weight: 700;
  color: #0f766e;
}

.badge-tag--green {
  background: #eaf7f0;
  color: #16a34a;
  font-size: 0.65625rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
}

.kpi-card__main {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.kpi-number {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--pt-navy-900);
  line-height: 1;
}

.kpi-percent, .kpi-unit {
  font-size: 0.78125rem;
  font-weight: 700;
  color: #0f766e;
}

.kpi-subtext {
  margin: 0;
  font-size: 0.71875rem;
  color: #64748b;
}

.kpi-subtext--accent {
  color: #0f766e;
  font-weight: 600;
}

.progress-track {
  height: 6px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
  margin-top: 0.25rem;
}

.progress-fill {
  height: 100%;
  background: #0f766e;
  border-radius: 999px;
}

/* Middle Grid */
.middle-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 1.5rem;
}

.prescribed-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid var(--pt-border);
  box-shadow: 0 1px 3px rgba(10, 31, 51, 0.04);
  padding: 1.75rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.prescribed-card__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.prescribed-tag {
  font-size: 0.65625rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #0f766e;
  text-transform: uppercase;
}

.badge-pill {
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
}

.badge-pill--pending {
  background: #fef3c7;
  color: #d97706;
}

.badge-pill--done {
  background: #eaf7f0;
  color: #16a34a;
}

.activity-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--pt-navy-900);
}

.activity-desc {
  margin: 0;
  font-size: 0.84375rem;
  color: #475569;
  line-height: 1.55;
}

.params-box {
  display: flex;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.85rem 1rem;
  margin: 0.25rem 0;
}

.param-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.param-col:not(:last-child) {
  border-right: 1px solid #e2e8f0;
}

.param-label {
  font-size: 0.625rem;
  font-weight: 800;
  color: #64748b;
  letter-spacing: 0.05em;
}

.param-val {
  font-size: 1rem;
  font-weight: 800;
  color: var(--pt-navy-900);
}

.activity-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: auto;
  padding-top: 0.5rem;
}

.btn-guide {
  background: #0f766e;
  color: #ffffff;
  border: none;
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.btn-guide:hover {
  opacity: 0.9;
}

.btn-mark-done {
  background: #ffffff;
  color: #334155;
  border: 1px solid #cbd5e1;
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-mark-done:hover:not(:disabled) {
  border-color: #94a3b8;
  background: #f8fafc;
}

.btn-mark-done:disabled {
  background: #eaf7f0;
  color: #16a34a;
  border-color: #bbf7d0;
  cursor: default;
}

/* Adherence Card */
.adherence-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid var(--pt-border);
  box-shadow: 0 1px 3px rgba(10, 31, 51, 0.04);
  padding: 1.75rem 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.adherence-card__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.adherence-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--pt-navy-900);
}

.week-text {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
}

.bar-chart-container {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 160px;
  padding: 1.5rem 0 0.5rem;
  gap: 0.75rem;
}

.bar-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
  gap: 0.4rem;
}

.bar-percent {
  font-size: 0.625rem;
  font-weight: 700;
  color: #475569;
}

.bar-percent--empty {
  color: #cbd5e1;
}

.bar-track {
  width: 28px;
  height: 100px;
  background: #f1f5f9;
  border-radius: 6px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.bar-fill {
  width: 100%;
  background: #0d9488;
  border-radius: 6px;
  transition: height 0.3s ease;
}

.bar-fill--today {
  background: #10b981;
}

.bar-day {
  font-size: 0.6875rem;
  font-weight: 700;
  color: #64748b;
}

.adherence-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
  font-size: 0.8125rem;
}

.history-link {
  color: #0f766e;
  font-weight: 700;
  text-decoration: none;
}

.history-link:hover {
  text-decoration: underline;
}

/* Bottom Grid */
.bottom-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.info-card {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid var(--pt-border);
  box-shadow: 0 1px 3px rgba(10, 31, 51, 0.04);
  padding: 1.35rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.avatar-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.15rem;
  flex-shrink: 0;
}

.avatar-box--teal {
  background: #e6f4f5;
  color: #0f766e;
}

.avatar-box--navy {
  background: #e2e8f0;
  color: var(--pt-navy-900);
}

.info-card__content {
  flex: 1;
  min-width: 0;
}

.info-category {
  font-size: 0.625rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #64748b;
}

.info-title {
  margin: 0.15rem 0 0;
  font-size: 1rem;
  font-weight: 800;
  color: var(--pt-navy-900);
}

.info-meta {
  margin: 0.2rem 0 0.6rem;
  font-size: 0.75rem;
  color: #64748b;
}

.info-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.75rem;
}

.action-btn-link {
  color: #0f766e;
  font-weight: 700;
  text-decoration: none;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
}

.action-btn-link:hover {
  text-decoration: underline;
}

.next-date {
  color: #64748b;
}

.status-chip-green {
  background: #eaf7f0;
  color: #16a34a;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.6875rem;
}

.ml-auto {
  margin-left: auto;
}

.guide-dialog-content ol {
  padding-left: 1.25rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.84375rem;
  color: #334155;
  line-height: 1.5;
}

.tech-dialog-content p {
  margin: 0.5rem 0;
  font-size: 0.84375rem;
  color: #334155;
}

@media (max-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .middle-grid {
    grid-template-columns: 1fr;
  }
  .bottom-grid {
    grid-template-columns: 1fr;
  }
}
</style>
