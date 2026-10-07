<script setup>
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";
import useMonitoringStore from "../../application/monitoring.store.js";
import SurfaceCard from "../../../shared/presentation/components/surface-card.vue";
import StatusBadge from "../../../shared/presentation/components/status-badge.vue";

const { t } = useI18n();
const toast = useToast();
const store = useMonitoringStore();

onMounted(() => store.fetchAlerts());

/** Formats an ISO date-time as dd/mm hh:mm AM|PM. */
function formatDate(iso) {
  const date = new Date(iso);
  const pad = n => String(n).padStart(2, '0');
  const hours = date.getHours();
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)} ${pad(hours % 12 || 12)}:${pad(date.getMinutes())} ${hours >= 12 ? 'PM' : 'AM'}`;
}

const severityTone = { warning: 'warning', critical: 'danger' };

const resolve = alert => {
  store.resolveAlert(alert).then(() => {
    toast.add({ severity: 'success', summary: t('alerts.history.resolved-toast'), detail: alert.patientName, life: 3000 });
  }).catch(() => {
    toast.add({ severity: 'error', summary: t('errors.occurred'), life: 4000 });
  });
};
</script>

<template>
  <surface-card padding="0">
    <header class="head">
      <div>
        <h2 class="head__title">{{ t('alerts.history.title') }}</h2>
        <p class="head__subtitle">{{ t('alerts.history.subtitle') }}</p>
      </div>
      <span class="head__pending">{{ t('alerts.history.pending-count', { count: store.pendingCount }) }}</span>
    </header>

    <div class="table-wrap">
      <table class="table">
        <thead>
        <tr>
          <th>{{ t('alerts.history.columns.date') }}</th>
          <th>{{ t('alerts.history.columns.patient') }}</th>
          <th>{{ t('alerts.history.columns.deviation') }}</th>
          <th>{{ t('alerts.history.columns.value') }}</th>
          <th class="center">{{ t('alerts.history.columns.severity') }}</th>
          <th class="center">{{ t('alerts.history.columns.status') }}</th>
          <th class="center">{{ t('alerts.history.columns.action') }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="alert in store.alerts" :key="alert.id">
          <td class="date">{{ formatDate(alert.occurredAt) }}</td>
          <td class="patient">{{ alert.patientName }}</td>
          <td>{{ alert.deviationType }}</td>
          <td :class="['value', alert.isPending ? `value--${alert.severity}` : '']">
            {{ alert.recordedValue }} ({{ t('alerts.history.threshold', { threshold: alert.threshold }) }})
          </td>
          <td class="center"><status-badge :tone="severityTone[alert.severity]">{{ t(`alerts.history.severity.${alert.severity}`) }}</status-badge></td>
          <td :class="['center', 'status', `status--${alert.isPending ? alert.severity : 'resolved'}`]">
            {{ t(`alerts.history.status.${alert.status}`) }}
          </td>
          <td class="center">
            <button v-if="alert.isPending" type="button" class="resolve" @click="resolve(alert)">{{ t('alerts.history.resolve') }}</button>
            <span v-else class="attended">{{ t('alerts.history.attended') }}</span>
          </td>
        </tr>
        <tr v-if="store.alertsLoaded && !store.alerts.length">
          <td colspan="7" class="empty">{{ t('alerts.history.empty') }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </surface-card>
</template>

<style scoped>
.head { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; padding: 1.75rem 2rem 1.25rem; }
.head__title { margin: 0; font-size: 1rem; font-weight: 700; color: var(--pt-navy-600); }
.head__subtitle { margin: 0.2rem 0 0; font-size: 0.8125rem; color: var(--pt-muted); }
.head__pending { font-size: 0.8125rem; color: var(--pt-muted); white-space: nowrap; padding-top: 0.2rem; }

.table-wrap { overflow-x: auto; }
.table { width: 100%; min-width: 900px; border-collapse: collapse; font-size: 0.8125rem; }
.table th { padding: 0.9rem 1rem; background: #f4f6f8; text-align: left; font-size: 0.75rem; font-weight: 700; color: #4a5a6a; }
.table td { padding: 1rem; border-bottom: 1px solid var(--pt-border); }
.table tbody tr:last-child td { border-bottom: none; }
.table th:first-child, .table td:first-child { padding-left: 2rem; }
.table th:last-child, .table td:last-child { padding-right: 2rem; }
.center { text-align: center !important; }

.date { font-weight: 600; white-space: nowrap; }
.patient { font-weight: 700; color: var(--pt-navy-600); }
.value { font-weight: 600; }
.value--warning { color: #b25f0b; }
.value--critical { color: var(--pt-red); }
.status { font-weight: 600; }
.status--warning { color: #d9791b; }
.status--critical { color: var(--pt-red); }
.status--resolved { color: var(--pt-green); }
.resolve { border: none; background: none; padding: 0; cursor: pointer; font-weight: 700; color: var(--pt-teal-strong); }
.resolve:hover { text-decoration: underline; }
.attended { color: var(--pt-muted); }
.empty { padding: 2rem !important; text-align: center; color: var(--pt-muted); }

@media (max-width: 640px) { .head { flex-direction: column; padding: 1.25rem 1rem; } }
</style>
