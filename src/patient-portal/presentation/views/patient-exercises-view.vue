<script setup>
import { ref, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { usePrescriptionStore } from "../../../prescription/application/prescription.store.js";

const toast = useToast();
const prescriptionStore = usePrescriptionStore();

const showFeedbackDialog = ref(false);
const selectedExercise = ref(null);
const effortScore = ref(3);

const exercises = computed(() => prescriptionStore.patientExercises);

const completedCount = computed(() => {
  return exercises.value.filter(e => e.isDone).length;
});

const compliancePercentage = computed(() => {
  if (!exercises.value.length) return 0;
  return Math.round((completedCount.value / exercises.value.length) * 100);
});

function openRegisterModal(ex) {
  selectedExercise.value = ex;
  effortScore.value = 3;
  showFeedbackDialog.value = true;
}

function saveExerciseDone() {
  if (selectedExercise.value) {
    prescriptionStore.markExerciseDone(selectedExercise.value.id, effortScore.value);

    toast.add({
      severity: 'success',
      summary: 'Ejercicio Registrado',
      detail: `Completaste "${selectedExercise.value.title}". Tu adherencia del día subió al 100%.`,
      life: 3500
    });
  }
  showFeedbackDialog.value = false;
}
</script>

<template>
  <div class="patient-exercises-page">
    <!-- Header Plan Card -->
    <header class="plan-card">
      <div class="plan-card__left">
        <div class="plan-meta-row">
          <span class="plan-phase-tag">PLAN VIGENTE • FASE 2</span>
          <span class="plan-active-chip">Activo</span>
        </div>
        <h1 class="plan-title">Fortalecimiento y Adaptación Dinámica</h1>
        <p class="plan-subtitle">
          Prescrito por Lic. Diego Salazar Mendoza • 01/09/2026 al 30/09/2026
        </p>
      </div>

      <div class="plan-card__right">
        <div class="compliance-row">
          <span class="compliance-label">
            Cumplimiento de Hoy: <strong>{{ compliancePercentage }}% ({{ completedCount }} de {{ exercises.length }})</strong>
          </span>
        </div>
        <div class="compliance-bar-track">
          <div
              class="compliance-bar-fill"
              :style="{ width: `${compliancePercentage}%` }"
          />
        </div>
      </div>
    </header>

    <!-- Exercises List -->
    <div class="exercises-container">
      <article
          v-for="ex in exercises"
          :key="ex.id"
          class="exercise-card"
          :class="{ 'exercise-card--done': ex.isDone, 'exercise-card--pending': !ex.isDone }"
      >
        <!-- Left Badge (01 or Check Icon) -->
        <div class="exercise-badge-box">
          <span v-if="!ex.isDone" class="badge-num">{{ ex.num }}</span>
          <span v-else class="badge-check">
            <i class="pi pi-check" />
          </span>
        </div>

        <!-- Center Content -->
        <div class="exercise-content">
          <div class="exercise-tags-row">
            <span
                v-if="!ex.isDone"
                class="status-chip status-chip--pending"
            >
              PENDIENTE HOY
            </span>
            <span
                v-else
                class="status-chip status-chip--done"
            >
              COMPLETADO HOY {{ ex.doneTime }}
            </span>
            <span class="category-text">• {{ ex.category }}</span>
          </div>

          <h2 class="exercise-title">{{ ex.title }}</h2>
          <p class="exercise-instructions">{{ ex.instructions }}</p>

          <div class="exercise-params">
            <span v-if="ex.param1" class="param-pill">{{ ex.param1 }}</span>
            <span v-if="ex.param2" class="param-pill">{{ ex.param2 }}</span>
            <span v-if="ex.param3" class="param-pill">{{ ex.param3 }}</span>
          </div>
        </div>

        <!-- Right Action / Status -->
        <div class="exercise-action">
          <button
              v-if="!ex.isDone"
              type="button"
              class="btn-register-done"
              @click="openRegisterModal(ex)"
          >
            <i class="pi pi-check" />
            Registrar Cumplimiento
          </button>
          <span v-else class="success-label">
            Registrado con éxito
          </span>
        </div>
      </article>
    </div>

    <!-- Register Feedback Modal -->
    <pv-dialog
        v-model:visible="showFeedbackDialog"
        modal
        header="Registrar Ejercicio Prescrito"
        :style="{ width: '480px' }"
    >
      <div v-if="selectedExercise" class="feedback-modal-content">
        <p class="modal-exercise-name">
          <strong>{{ selectedExercise.title }}</strong>
        </p>

        <div class="field">
          <label>Nivel de Esfuerzo Percibido (Escala Borg 1 al 10): <strong>{{ effortScore }}/10</strong></label>
          <div class="slider-box">
            <input
                type="range"
                min="1"
                max="10"
                v-model="effortScore"
                class="effort-slider"
            />
            <div class="slider-marks">
              <span>1 (Muy Fácil)</span>
              <span>5 (Moderado)</span>
              <span>10 (Máximo)</span>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <pv-button label="Cancelar" text @click="showFeedbackDialog = false" />
        <pv-button label="Confirmar Realización" severity="success" @click="saveExerciseDone" />
      </template>
    </pv-dialog>
  </div>
</template>

<style scoped>
.patient-exercises-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1240px;
  margin: 0 auto;
}

/* Plan Card */
.plan-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid var(--pt-border);
  box-shadow: 0 1px 3px rgba(10, 31, 51, 0.04);
  padding: 1.75rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.plan-meta-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.35rem;
}

.plan-phase-tag {
  font-size: 0.6875rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #0f766e;
}

.plan-active-chip {
  background: #eaf7f0;
  color: #16a34a;
  font-size: 0.65625rem;
  font-weight: 700;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
}

.plan-title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--pt-navy-900);
}

.plan-subtitle {
  margin: 0.35rem 0 0;
  font-size: 0.8125rem;
  color: #64748b;
}

.plan-card__right {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 250px;
}

.compliance-label {
  font-size: 0.78125rem;
  color: #334155;
}

.compliance-label strong {
  color: var(--pt-navy-900);
}

.compliance-bar-track {
  height: 8px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.compliance-bar-fill {
  height: 100%;
  background: #0f766e;
  border-radius: 999px;
  transition: width 0.3s ease;
}

/* Exercises List */
.exercises-container {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.exercise-card {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid var(--pt-border);
  box-shadow: 0 1px 3px rgba(10, 31, 51, 0.04);
  padding: 1.5rem 1.75rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: box-shadow 0.15s ease;
}

.exercise-card:hover {
  box-shadow: 0 4px 14px rgba(10, 31, 51, 0.05);
}

.exercise-card--pending {
  border-color: #fde68a;
  background: #fffdfa;
}

/* Badge Box */
.exercise-badge-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.exercise-card--pending .exercise-badge-box {
  background: #fef3c7;
  border: 1px solid #fde68a;
}

.badge-num {
  font-size: 1rem;
  font-weight: 800;
  color: #d97706;
}

.exercise-card--done .exercise-badge-box {
  background: #eaf7f0;
  border: 1px solid #bbf7d0;
}

.badge-check {
  font-size: 1.15rem;
  color: #16a34a;
}

/* Center Content */
.exercise-content {
  flex: 1;
  min-width: 0;
}

.exercise-tags-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.status-chip {
  font-size: 0.65625rem;
  font-weight: 800;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  letter-spacing: 0.04em;
}

.status-chip--pending {
  background: #fef3c7;
  color: #d97706;
}

.status-chip--done {
  background: #eaf7f0;
  color: #16a34a;
}

.category-text {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.exercise-title {
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 800;
  color: var(--pt-navy-900);
}

.exercise-instructions {
  margin: 0.35rem 0 0.65rem;
  font-size: 0.8125rem;
  color: #475569;
  line-height: 1.45;
}

.exercise-params {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  font-size: 0.75rem;
  color: #64748b;
}

.param-pill {
  font-weight: 600;
}

/* Right Action */
.exercise-action {
  flex-shrink: 0;
}

.btn-register-done {
  background: #0f766e;
  color: #ffffff;
  border: none;
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  transition: opacity 0.15s ease;
}

.btn-register-done:hover {
  opacity: 0.9;
}

.success-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #0f766e;
}

.feedback-modal-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 0.5rem 0;
}

.modal-exercise-name {
  margin: 0;
  font-size: 0.95rem;
  color: var(--pt-navy-900);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.field label {
  font-size: 0.8125rem;
  color: #334155;
}

.slider-box {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.effort-slider {
  width: 100%;
  accent-color: #0f766e;
  cursor: pointer;
}

.slider-marks {
  display: flex;
  justify-content: space-between;
  font-size: 0.6875rem;
  color: #94a3b8;
}

@media (max-width: 860px) {
  .exercise-card {
    flex-direction: column;
    align-items: flex-start;
  }
  .exercise-action {
    width: 100%;
    margin-top: 0.5rem;
  }
}
</style>
