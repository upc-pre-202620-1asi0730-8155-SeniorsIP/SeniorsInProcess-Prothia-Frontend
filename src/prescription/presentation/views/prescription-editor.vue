<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import usePrescriptionStore from "../../application/prescription.store.js";
import usePatientStore from "../../../patients/application/patient.store.js";
import PatientSelect from "../../../patients/presentation/components/patient-select.vue";
import SurfaceCard from "../../../shared/presentation/components/surface-card.vue";
import StatusBadge from "../../../shared/presentation/components/status-badge.vue";

const { t } = useI18n();
const toast = useToast();
const store = usePrescriptionStore();
const patientStore = usePatientStore();

const patientId = ref(null);
const query = ref('');
const saving = ref(false);

onMounted(() => {
  if (!patientStore.patientsLoaded) patientStore.fetchPatients();
  store.fetchExercises();
  store.fetchPrescriptions();
});

// Pick the first patient once they are loaded.
watch(() => patientStore.patients, patients => {
  if (patientId.value === null && patients.length) patientId.value = patients[0].id;
}, { immediate: true });

// Edit a copy of the selected patient's plan.
watch([patientId, () => store.prescriptionsLoaded], () => {
  if (patientId.value !== null && store.prescriptionsLoaded) store.selectPatient(patientId.value);
}, { immediate: true });

const patient = computed(() => patientStore.patients.find(p => p.id === patientId.value));
const stored = computed(() => patientId.value === null ? undefined : store.getPrescriptionByPatientId(patientId.value));

const currentPlanLabel = computed(() => stored.value && patient.value
    ? t('prescription.current-plan-value', { phase: stored.value.phaseNumber, adherence: patient.value.adherence })
    : t('prescription.no-plan'));

const visibleExercises = computed(() => {
  const text = query.value.trim().toLowerCase();
  return store.exercises.filter(exercise =>
      !text || [exercise.name, ...exercise.focus].some(field => field.toLowerCase().includes(text)));
});

const savePlan = () => {
  if (!store.draft.isComplete) {
    toast.add({ severity: 'warn', summary: t('prescription.incomplete'), life: 4000 });
    return;
  }
  saving.value = true;
  store.saveDraft().then(() => {
    toast.add({ severity: 'success', summary: t('prescription.saved'),
      detail: t('prescription.saved-detail', { patient: patient.value?.fullName ?? '' }), life: 4000 });
  }).catch(() => {
    toast.add({ severity: 'error', summary: t('errors.occurred'), life: 4000 });
  }).finally(() => { saving.value = false; });
};
</script>

<template>
  <div class="editor">
    <surface-card padding="1.25rem 1.5rem">
      <div class="patient-bar">
        <patient-select v-model="patientId" :label="t('prescription.patient-to-prescribe')" input-id="prescription-patient"/>
        <p class="patient-bar__plan">{{ t('prescription.current-plan') }} <strong>{{ currentPlanLabel }}</strong></p>
      </div>
    </surface-card>

    <div class="columns">
      <surface-card padding="1.75rem 1.5rem">
        <header class="library__head">
          <h2 class="title">{{ t('prescription.library') }}</h2>
          <span class="muted">{{ t('prescription.available', { count: store.exercises.length }) }}</span>
        </header>
        <pv-input-text v-model="query" class="w-full" :placeholder="t('prescription.search-exercise')"
                       :aria-label="t('prescription.search-exercise')"/>
        <ul class="library__list">
          <li v-for="exercise in visibleExercises" :key="exercise.id" class="exercise">
            <div class="exercise__text">
              <strong class="exercise__name">{{ exercise.name }}</strong>
              <span class="muted">{{ exercise.focus.join(' • ') }}</span>
            </div>
            <pv-button class="btn-navy" size="small" :label="t('prescription.add')"
                       :disabled="!store.draft" @click="store.draft.addExercise(exercise)"/>
          </li>
        </ul>
      </surface-card>

      <surface-card v-if="store.draft" padding="1.75rem 1.5rem">
        <header class="plan__head">
          <div>
            <h2 class="plan__title">{{ t('prescription.plan-title', { phase: store.draft.phaseNumber, name: store.draft.phaseName }) }}</h2>
            <p class="muted">{{ t('prescription.plan-meta', { weeks: store.draft.durationWeeks, days: store.draft.frequencyPerWeek }) }}</p>
          </div>
          <status-badge tone="success" class="plan__count">{{ t('prescription.exercise-count', { count: store.draft.exercises.length }) }}</status-badge>
        </header>

        <ol class="plan__list">
          <li v-for="(item, index) in store.draft.exercises" :key="`${item.exerciseId}-${index}`" class="plan-item">
            <div class="plan-item__head">
              <strong>{{ index + 1 }}. {{ item.name }}</strong>
              <button type="button" class="remove" @click="store.draft.removeExerciseAt(index)">{{ t('prescription.remove') }}</button>
            </div>
            <div class="plan-item__fields">
              <div class="field">
                <label :for="`sets-${index}`">{{ t('prescription.sets') }}</label>
                <pv-input-number :input-id="`sets-${index}`" v-model="item.sets" :min="1" :max="20" fluid/>
              </div>
              <div class="field">
                <label :for="`reps-${index}`">{{ t('prescription.reps') }}</label>
                <pv-input-number :input-id="`reps-${index}`" v-model="item.reps" :min="1" :max="100" fluid/>
              </div>
              <div class="field">
                <label :for="`rest-${index}`">{{ t('prescription.rest') }}</label>
                <pv-input-number :input-id="`rest-${index}`" v-model="item.restSeconds" :min="0" :max="600" fluid/>
              </div>
            </div>
          </li>
          <li v-if="!store.draft.exercises.length" class="empty">{{ t('prescription.empty-plan') }}</li>
        </ol>

        <footer class="plan__footer">
          <p class="muted">{{ t('prescription.notify') }}</p>
          <pv-button class="btn-teal" icon="pi pi-check" :label="t('prescription.save')" :loading="saving" @click="savePlan"/>
        </footer>
      </surface-card>
    </div>
  </div>
</template>

<style scoped>
.editor { display: flex; flex-direction: column; gap: 1.5rem; max-width: 1180px; margin: 0 auto; }
.muted { font-size: 0.8125rem; color: var(--pt-muted); margin: 0; }
.title { margin: 0; font-size: 1.1875rem; font-weight: 700; color: var(--pt-navy-600); }

.patient-bar { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.patient-bar__plan { margin: 0; font-size: 0.8125rem; color: var(--pt-muted); }
.patient-bar__plan strong { margin-left: 0.25rem; color: var(--pt-ink); }

.columns { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.55fr); gap: 1.5rem; align-items: start; }

.library__head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 1.1rem; }
.library__list { display: flex; flex-direction: column; gap: 0.75rem; margin: 1rem 0 0; padding: 0; list-style: none; }
.exercise {
  display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;
  padding: 0.85rem 1rem; background: var(--pt-page); border: 1px solid var(--pt-border); border-radius: 12px;
}
.exercise__text { display: flex; flex-direction: column; min-width: 0; }
.exercise__name { font-size: 0.875rem; }

.plan__head { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; padding-bottom: 1.1rem; border-bottom: 1px solid var(--pt-border); }
.plan__title { margin: 0 0 0.2rem; font-size: 0.9375rem; font-weight: 700; color: var(--pt-navy-600); }
.plan__count { font-size: 0.8125rem; padding: 4px 12px; border-radius: 8px; }
.plan__list { display: flex; flex-direction: column; gap: 1rem; margin: 1.1rem 0 0; padding: 0; list-style: none; }
.plan-item { padding: 1rem 1.1rem 1.1rem; background: #fafbfc; border: 1px solid var(--pt-border); border-radius: 12px; }
.plan-item__head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; font-size: 0.875rem; margin-bottom: 0.8rem; }
.plan-item__fields { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
.field { display: flex; flex-direction: column; gap: 0.35rem; }
.field label { font-size: 0.75rem; font-weight: 700; color: var(--pt-muted); }
.remove { border: none; background: none; padding: 0; cursor: pointer; font-size: 0.8125rem; font-weight: 600; color: var(--pt-red); }
.remove:hover { text-decoration: underline; }
.empty { padding: 1.5rem; text-align: center; font-size: 0.8125rem; color: var(--pt-muted); border: 1px dashed var(--pt-border); border-radius: 12px; }
.plan__footer { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--pt-border); }

.btn-navy {
  --p-button-primary-background: var(--pt-navy-600); --p-button-primary-border-color: var(--pt-navy-600); --p-button-primary-color: #fff;
  --p-button-primary-hover-background: var(--pt-navy-700); --p-button-primary-hover-border-color: var(--pt-navy-700); --p-button-primary-hover-color: #fff;
  font-size: 0.75rem; font-weight: 700; flex-shrink: 0;
}
.btn-teal {
  --p-button-primary-background: var(--pt-teal); --p-button-primary-border-color: var(--pt-teal); --p-button-primary-color: #fff;
  --p-button-primary-hover-background: var(--pt-teal-strong); --p-button-primary-hover-border-color: var(--pt-teal-strong); --p-button-primary-hover-color: #fff;
  font-size: 0.875rem; font-weight: 700;
}

@media (max-width: 991px) { .columns { grid-template-columns: minmax(0, 1fr); } }
@media (max-width: 560px) { .plan-item__fields { grid-template-columns: minmax(0, 1fr); } }
</style>
