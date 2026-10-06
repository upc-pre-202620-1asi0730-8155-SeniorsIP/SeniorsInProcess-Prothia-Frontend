<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import useMonitoringStore from "../../application/monitoring.store.js";
import usePatientStore from "../../../patients/application/patient.store.js";
import PatientSelect from "../../../patients/presentation/components/patient-select.vue";
import SurfaceCard from "../../../shared/presentation/components/surface-card.vue";
import { ThresholdProfile } from "../../domain/model/threshold-profile.entity.js";
import { thresholdDefinitions } from "../../domain/model/threshold-definitions.js";

const { t } = useI18n();
const toast = useToast();
const store = useMonitoringStore();
const patientStore = usePatientStore();

const patientId = ref(null);
const form = reactive({});
const saving = ref(false);

onMounted(() => {
  if (!patientStore.patientsLoaded) patientStore.fetchPatients();
  store.fetchThresholdProfiles();
});

// Pick the first patient once they are loaded.
watch(() => patientStore.patients, patients => {
  if (patientId.value === null && patients.length) patientId.value = patients[0].id;
}, { immediate: true });

// Load the stored thresholds (or defaults) of the selected patient into the form.
watch([patientId, () => store.thresholdsLoaded], () => {
  if (patientId.value === null || !store.thresholdsLoaded) return;
  Object.assign(form, store.getThresholdProfileByPatientId(patientId.value).values);
}, { immediate: true });

const patient = computed(() => patientStore.patients.find(p => p.id === patientId.value));

const cards = computed(() => thresholdDefinitions.map(definition => {
  const unit = t(`alerts.thresholds.${definition.key}.unit`);
  const value = form[definition.key] ?? definition.defaultValue;
  const fill = ((value - definition.min) / (definition.max - definition.min)) * 100;
  return {
    ...definition,
    value,
    display: `${value}${unit}`,
    fill: `${Math.min(100, Math.max(0, fill))}%`,
    label: t(`alerts.thresholds.${definition.key}.label`),
    description: t(`alerts.thresholds.${definition.key}.description`, {
      value: `${value}${unit}`,
      kLevel: patient.value?.kLevel ?? ''
    })
  };
}));

const save = () => {
  if (patientId.value === null) return;
  const current = store.getThresholdProfileByPatientId(patientId.value);
  const profile = new ThresholdProfile({ id: current.id, patientId: patientId.value, ...form });
  saving.value = true;
  store.saveThresholdProfile(profile).then(() => {
    toast.add({ severity: 'success', summary: t('alerts.calibration.saved'), detail: patient.value?.fullName ?? '', life: 3000 });
  }).catch(() => {
    toast.add({ severity: 'error', summary: t('errors.occurred'), life: 4000 });
  }).finally(() => { saving.value = false; });
};
</script>

<template>
  <surface-card padding="2rem">
    <header class="head">
      <div>
        <h2 class="head__title">{{ t('alerts.calibration.title') }}</h2>
        <p class="head__subtitle">{{ t('alerts.calibration.subtitle') }}</p>
      </div>
      <patient-select v-model="patientId" :label="t('alerts.calibration.patient')" input-id="threshold-patient"/>
    </header>

    <div class="grid">
      <article v-for="card in cards" :key="card.key" class="threshold">
        <div class="threshold__head">
          <label :for="`threshold-${card.key}`" class="threshold__label">{{ card.label }}</label>
          <span class="threshold__value">{{ card.display }}</span>
        </div>
        <input :id="`threshold-${card.key}`" v-model.number="form[card.key]" type="range" class="range"
               :min="card.min" :max="card.max" :step="card.step" :style="{ '--fill': card.fill }"/>
        <p class="threshold__description">{{ card.description }}</p>
      </article>
    </div>

    <footer class="footer">
      <pv-button class="btn-navy" icon="pi pi-check" :label="t('alerts.calibration.save')" :loading="saving" @click="save"/>
    </footer>
  </surface-card>
</template>

<style scoped>
.head { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 2rem; }
.head__title { margin: 0; font-size: 1rem; font-weight: 700; color: var(--pt-navy-600); }
.head__subtitle { margin: 0.2rem 0 0; font-size: 0.8125rem; color: var(--pt-muted); }

.grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.5rem; }
.threshold { padding: 1.25rem 1.25rem 1.1rem; background: var(--pt-page); border: 1px solid var(--pt-border); border-radius: 14px; }
.threshold__head { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
.threshold__label { font-size: 0.875rem; font-weight: 700; color: var(--pt-navy-600); }
.threshold__value { padding: 2px 10px; border-radius: 6px; background: #e4ebf2; font-size: 0.8125rem; font-weight: 700; color: var(--pt-navy-600); white-space: nowrap; }
.threshold__description { margin: 1rem 0 0; font-size: 0.8125rem; line-height: 1.55; color: var(--pt-muted); }

.range {
  -webkit-appearance: none; appearance: none;
  width: 100%; height: 14px; border-radius: 999px; outline-offset: 4px; cursor: pointer;
  background: linear-gradient(to right, #4fb286 var(--fill), #e9eef3 var(--fill));
}
.range::-webkit-slider-thumb {
  -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%;
  background: #fff; border: 4px solid #4fb286; box-shadow: 0 1px 3px rgba(10, 31, 51, 0.25);
}
.range::-moz-range-thumb {
  width: 12px; height: 12px; border-radius: 50%;
  background: #fff; border: 4px solid #4fb286; box-shadow: 0 1px 3px rgba(10, 31, 51, 0.25);
}

.footer { display: flex; justify-content: flex-end; margin-top: 1.75rem; padding-top: 1.5rem; border-top: 1px solid var(--pt-border); }
.btn-navy {
  --p-button-primary-background: var(--pt-navy-600); --p-button-primary-border-color: var(--pt-navy-600); --p-button-primary-color: #fff;
  --p-button-primary-hover-background: var(--pt-navy-700); --p-button-primary-hover-border-color: var(--pt-navy-700); --p-button-primary-hover-color: #fff;
  font-size: 0.875rem; font-weight: 700;
}

@media (max-width: 860px) { .grid { grid-template-columns: minmax(0, 1fr); } }
</style>
