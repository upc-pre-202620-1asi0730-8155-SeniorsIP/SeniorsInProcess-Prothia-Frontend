<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import usePatientStore from "../../application/patient.store.js";
import { Patient } from "../../domain/model/patient.entity.js";
import { amputationLevels, kLevels } from "../../domain/model/patient-catalogs.js";
import SurfaceCard from "../../../shared/presentation/components/surface-card.vue";

const { t } = useI18n();
const router = useRouter();
const toast = useToast();
const store = usePatientStore();

const form = ref({ fullName: '', dni: '', age: null, amputation: null, kLevel: null, prosthesisCode: '' });

const navigateBack = () => router.push({ name: 'patients-list' });

/** Registers the patient with neutral clinical metrics; telemetry fills them in later. */
const savePatient = () => {
  const patient = new Patient({ ...form.value, adherence: 0, symmetry: 0, status: 'stable' });
  store.addPatient(patient).then(() => {
    toast.add({ severity: 'success', summary: t('patient-form.saved'), detail: patient.fullName, life: 3000 });
    navigateBack();
  });
};
</script>

<template>
  <div class="form-page">
    <surface-card padding="2rem">
      <h2 class="form-page__title">{{ t('patient-form.title') }}</h2>
      <form class="form" @submit.prevent="savePatient">
        <div class="field span-2">
          <label for="fullName">{{ t('patient-form.full-name') }}</label>
          <pv-input-text id="fullName" v-model="form.fullName" class="w-full" required/>
        </div>
        <div class="field">
          <label for="dni">{{ t('patient-form.dni') }}</label>
          <pv-input-text id="dni" v-model="form.dni" class="w-full" maxlength="8" required/>
        </div>
        <div class="field">
          <label for="age">{{ t('patient-form.age') }}</label>
          <pv-input-number input-id="age" v-model="form.age" class="w-full" :min="1" :max="120" fluid/>
        </div>
        <div class="field">
          <label for="amputation">{{ t('patient-form.amputation') }}</label>
          <pv-select input-id="amputation" v-model="form.amputation" :options="amputationLevels" class="w-full"/>
        </div>
        <div class="field">
          <label for="kLevel">{{ t('patient-form.k-level') }}</label>
          <pv-select input-id="kLevel" v-model="form.kLevel" :options="kLevels" class="w-full"/>
        </div>
        <div class="field span-2">
          <label for="prosthesis">{{ t('patient-form.prosthesis-code') }}</label>
          <pv-input-text id="prosthesis" v-model="form.prosthesisCode" class="w-full" placeholder="PR-2026-TT-000"/>
        </div>
        <div class="form__actions span-2">
          <pv-button type="button" severity="secondary" text :label="t('patient-form.cancel')" @click="navigateBack"/>
          <pv-button type="submit" class="cta" icon="pi pi-check" :label="t('patient-form.save')"
                     :disabled="!form.amputation || !form.kLevel || !form.age"/>
        </div>
      </form>
      <p v-if="store.errors.length" class="form__error">
        {{ t('errors.occurred') }}: {{ store.errors.map(e => e.message).join(', ') }}
      </p>
    </surface-card>
  </div>
</template>

<style scoped>
.form-page { max-width: 760px; margin: 0 auto; }
.form-page__title { margin: 0 0 1.5rem; font-size: 1.1875rem; font-weight: 700; color: var(--pt-navy-600); }
.form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1.1rem 1.25rem; }
.field { display: flex; flex-direction: column; gap: 0.4rem; }
.field label { font-size: 0.75rem; font-weight: 700; color: var(--pt-muted); }
.span-2 { grid-column: span 2; }
.form__actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem; }
.form__error { margin: 1rem 0 0; color: var(--pt-red); font-size: 0.8125rem; }
.cta {
  --p-button-primary-background: var(--pt-teal); --p-button-primary-border-color: var(--pt-teal); --p-button-primary-color: #fff;
  --p-button-primary-hover-background: var(--pt-teal-strong); --p-button-primary-hover-border-color: var(--pt-teal-strong); --p-button-primary-hover-color: #fff;
  font-weight: 700;
}
@media (max-width: 640px) { .form { grid-template-columns: minmax(0, 1fr); } .span-2 { grid-column: auto; } }
</style>
