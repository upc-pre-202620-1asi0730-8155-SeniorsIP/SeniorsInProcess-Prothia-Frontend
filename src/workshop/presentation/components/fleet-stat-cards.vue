<script setup>
import { useI18n } from "vue-i18n";
import StatCard from "../../../shared/presentation/components/stat-card.vue";

const props = defineProps({
  stats: {
    type: Object,
    required: true
  }
});

const { t } = useI18n();
</script>

<template>
  <div class="stats-grid">
    <stat-card
        :label="t('technician.stats.monitored-title')"
        :value="stats.monitoredCount"
        value-tone="navy"
        :suffix="t('technician.stats.monitored-suffix', { capacity: stats.capacity })"
        suffix-tone="muted"
        :caption="t('technician.stats.monitored-caption', { count: stats.linkedPatients })"
        caption-tone="green"
    />

    <stat-card
        :label="t('technician.stats.maintenance-title')"
        :value="stats.scheduledThisWeek"
        value-tone="teal"
        :suffix="t('technician.stats.maintenance-suffix')"
        suffix-tone="muted"
        :caption="t('technician.stats.maintenance-caption')"
        caption-tone="muted"
    />

    <stat-card
        :label="t('technician.stats.fatigue-title')"
        :value="stats.fatigueAlertsCount"
        value-tone="red"
        :suffix="t('technician.stats.fatigue-suffix')"
        suffix-tone="red"
        :caption="t('technician.stats.fatigue-caption')"
        caption-tone="muted"
    />

    <stat-card
        :label="t('technician.stats.hours-title')"
        :value="stats.totalAccumulatedHours"
        value-tone="navy"
        :suffix="t('technician.stats.hours-suffix')"
        suffix-tone="muted"
        :caption="t('technician.stats.hours-caption')"
        caption-tone="green"
    />
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.25rem;
}

@media (max-width: 1100px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .stats-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
