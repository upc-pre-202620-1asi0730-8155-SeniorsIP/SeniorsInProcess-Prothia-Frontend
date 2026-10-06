<script setup>
import { onMounted } from "vue";
import usePatientStore from "../../application/patient.store.js";

/**
 * Patient selector reused by other bounded contexts (prescription, monitoring).
 * v-model is the selected patient id.
 */
defineProps({
  modelValue: { type: Number, default: null },
  label:      { type: String, default: '' },
  inputId:    { type: String, default: 'patient-select' }
});
const emit = defineEmits(['update:modelValue']);
const store = usePatientStore();

onMounted(() => {
  if (!store.patientsLoaded) store.fetchPatients();
});
</script>

<template>
  <div class="patient-select">
    <label v-if="label" :for="inputId" class="patient-select__label">{{ label }}</label>
    <pv-select :input-id="inputId" class="patient-select__field"
               :model-value="modelValue" :options="store.patients"
               option-label="selectLabel" option-value="id"
               @update:model-value="value => emit('update:modelValue', value)"/>
  </div>
</template>

<style scoped>
.patient-select { display: flex; align-items: center; gap: 1.25rem; min-width: 0; }
.patient-select__label { font-size: 0.8125rem; font-weight: 700; color: var(--pt-navy-600); white-space: nowrap; }
.patient-select__field { min-width: 280px; font-size: 0.8125rem; font-weight: 600; }
@media (max-width: 640px) {
  .patient-select { flex-direction: column; align-items: stretch; gap: 0.4rem; }
  .patient-select__field { min-width: 0; width: 100%; }
}
</style>
