<script setup>
import { useI18n } from "vue-i18n";

const props = defineProps({
  alert: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['schedule']);
const { t } = useI18n();
</script>

<template>
  <div class="alert-banner">
    <div class="alert-banner__left">
      <div class="alert-banner__icon" aria-hidden="true">!</div>
      <div class="alert-banner__info">
        <div class="alert-banner__head">
          <span class="alert-banner__code">{{ alert.serialNumber }}</span>
          <span class="alert-banner__badge">{{ alert.formattedCycles }}</span>
          <span class="alert-banner__patient">{{ alert.patientLabel }}</span>
        </div>
        <p class="alert-banner__desc">{{ alert.description }}</p>
      </div>
    </div>
    <div class="alert-banner__action">
      <pv-button
          class="alert-banner__btn"
          :label="t('technician.alerts.schedule-button')"
          @click="emit('schedule', alert)"
      />
    </div>
  </div>
</template>

<style scoped>
.alert-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 1.15rem 1.4rem;
  background: #fff1f2;
  border: 1px solid #fecdd3;
  border-radius: 12px;
}

.alert-banner__left {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  min-width: 0;
  flex: 1;
}

.alert-banner__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  background: #dc2626;
  color: #ffffff;
  border-radius: 8px;
  font-weight: 800;
  font-size: 1.125rem;
}

.alert-banner__info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.alert-banner__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem;
}

.alert-banner__code {
  font-size: 0.9375rem;
  font-weight: 800;
  color: var(--pt-navy-900);
  letter-spacing: 0.02em;
}

.alert-banner__badge {
  display: inline-block;
  padding: 0.2rem 0.75rem;
  background: #ffe4e6;
  color: #be123c;
  font-size: 0.71875rem;
  font-weight: 700;
  border-radius: 999px;
  white-space: nowrap;
}

.alert-banner__patient {
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 500;
}

.alert-banner__desc {
  margin: 0;
  font-size: 0.8125rem;
  color: #334155;
  line-height: 1.4;
}

.alert-banner__action {
  flex-shrink: 0;
}

.alert-banner__btn {
  --p-button-primary-background: #dc2626;
  --p-button-primary-border-color: #dc2626;
  --p-button-primary-hover-background: #b91c1c;
  --p-button-primary-hover-border-color: #b91c1c;
  --p-button-primary-active-background: #991b1b;
  --p-button-primary-active-border-color: #991b1b;
  --p-button-primary-color: #ffffff;
  font-size: 0.8125rem;
  font-weight: 700;
  border-radius: 8px;
  padding: 0.65rem 1.25rem;
}

@media (max-width: 860px) {
  .alert-banner {
    flex-direction: column;
    align-items: flex-start;
  }
  .alert-banner__action {
    width: 100%;
  }
  .alert-banner__btn {
    width: 100%;
  }
}
</style>
