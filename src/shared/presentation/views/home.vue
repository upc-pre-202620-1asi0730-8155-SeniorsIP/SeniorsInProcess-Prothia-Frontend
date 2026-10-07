<script setup>
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import StatCard from "../components/stat-card.vue";
import SectionCard from "../components/section-card.vue";
import StatusBadge from "../components/status-badge.vue";
import AvatarInitials from "../components/avatar-initials.vue";
import usePatientStore from "../../../patients/application/patient.store.js";
import useMonitoringStore from "../../../monitoring/application/monitoring.store.js";
import useAnalyticsStore from "../../../analytics/application/analytics.store.js";

const { t } = useI18n();
const router = useRouter();
const patientStore = usePatientStore();
const monitoringStore = useMonitoringStore();
const analyticsStore = useAnalyticsStore();

onMounted(() => {
  if (!patientStore.patientsLoaded) patientStore.fetchPatients();
  if (!monitoringStore.alertsLoaded) monitoringStore.fetchAlerts();
});

const patients = computed(() => {
  const avatarTones = ['mint', 'blue', 'slate'];
  return patientStore.patients.map((p, idx) => ({
    id: p.id,
    name: p.fullName,
    amputation: p.amputation,
    kLevel: p.kLevel,
    adherence: p.adherence,
    symmetry: p.symmetry,
    status: p.status,
    avatar: avatarTones[idx % avatarTones.length]
  }));
});

const alerts = computed(() => {
  return monitoringStore.alerts.slice(0, 3).map(a => ({
    id: a.id,
    patientId: a.patientId,
    patient: a.patientName,
    tag: `${a.deviationType} (${a.recordedValue})`,
    when: new Date(a.occurredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    message: `Desviación detectada respecto al umbral basal de calibración (${a.threshold}).`,
    severity: a.severity === 'critical' ? 'danger' : 'warning'
  }));
});

const monitoredCount = computed(() => patientStore.patients.length || 24);
const pendingAlertsCount = computed(() => monitoringStore.pendingCount);
const averageAdherence = computed(() => {
  if (!patientStore.patients.length) return '87.4%';
  const total = patientStore.patients.reduce((sum, p) => sum + (p.adherence || 0), 0);
  return `${(total / patientStore.patients.length).toFixed(1)}%`;
});
const symmetricCount = computed(() => {
  return patientStore.patients.filter(p => (p.symmetry || 0) >= 90).length || 16;
});

const statusTone = { alert: 'warning', critical: 'danger', stable: 'success' };

function viewPatientReport(patientId) {
  analyticsStore.selectPatientReport(patientId);
  router.push({ path: '/reports', query: { patientId } });
}
</script>

<template>
  <div class="dashboard">
    <div class="dashboard__stats">
      <stat-card :label="t('dashboard.stats.monitored')" :value="monitoredCount" suffix="/ 50 cupos"
                 :caption="t('dashboard.stats.monitored-caption')" caption-tone="green"/>
      <stat-card :label="t('dashboard.stats.adherence')" :value="averageAdherence" value-tone="teal" suffix="+5.2%" suffix-tone="green"
                 :caption="t('dashboard.stats.adherence-caption')"/>
      <stat-card :label="t('dashboard.stats.alerts')" :value="pendingAlertsCount" value-tone="red" :suffix="t('dashboard.stats.alerts-suffix')" suffix-tone="red"
                 :caption="t('dashboard.stats.alerts-caption')"/>
      <stat-card :label="t('dashboard.stats.symmetry')" :value="symmetricCount" :suffix="t('dashboard.stats.symmetry-suffix')"
                 :caption="t('dashboard.stats.symmetry-caption')" caption-tone="green"/>
    </div>

    <section-card :title="t('dashboard.alerts.title')" :subtitle="t('dashboard.alerts.subtitle')">
      <template #action>
        <router-link to="/alerts">{{ t('dashboard.alerts.view-all', { count: pendingAlertsCount }) }} <i class="pi pi-arrow-right"/></router-link>
      </template>
      <ul class="alert-list">
        <li v-for="alert in alerts" :key="alert.id" class="alert-row" :class="`alert-row--${alert.severity}`">
          <span class="alert-row__icon" aria-hidden="true">!</span>
          <div class="alert-row__text">
            <p class="alert-row__head">
              <strong>{{ alert.patient }}</strong>
              <status-badge :tone="alert.severity">{{ alert.tag }}</status-badge>
              <span class="alert-row__when">{{ alert.when }}</span>
            </p>
            <p class="alert-row__message">{{ alert.message }}</p>
          </div>
          <div class="alert-row__actions">
            <pv-button class="btn-light" size="small" :label="t('dashboard.alerts.view-record')" @click="viewPatientReport(alert.patientId || alert.id)"/>
            <pv-button class="btn-teal" size="small" :label="t('dashboard.alerts.inspect')" @click="router.push('/alerts')"/>
          </div>
        </li>
      </ul>
    </section-card>

    <section-card :title="t('dashboard.patients.title')" :subtitle="t('dashboard.patients.subtitle')" flush>
      <template #action>
        <router-link to="/patients">{{ t('dashboard.patients.view-all', { count: monitoredCount }) }} <i class="pi pi-arrow-right"/></router-link>
      </template>
      <div class="table-wrap">
        <table class="patients">
          <thead>
          <tr>
            <th>{{ t('dashboard.patients.col-patient') }}</th>
            <th>{{ t('dashboard.patients.col-amputation') }}</th>
            <th>{{ t('dashboard.patients.col-k-level') }}</th>
            <th>{{ t('dashboard.patients.col-adherence') }}</th>
            <th>{{ t('dashboard.patients.col-symmetry') }}</th>
            <th>{{ t('dashboard.patients.col-status') }}</th>
            <th class="right">{{ t('dashboard.patients.col-action') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="p in patients" :key="p.id">
            <td>
              <span class="patient-cell"><avatar-initials :name="p.name" :tone="p.avatar"/><strong>{{ p.name }}</strong></span>
            </td>
            <td>{{ p.amputation }}</td>
            <td><strong>{{ p.kLevel }}</strong></td>
            <td>
                <span class="adherence">
                  <span class="adherence__track"><span class="adherence__bar" :class="{ 'adherence__bar--low': p.adherence < 80 }" :style="{ width: `${p.adherence}%` }"/></span>
                  <strong>{{ p.adherence }}%</strong>
                </span>
            </td>
            <td :class="p.symmetry >= 90 ? 'good' : ''"><strong>{{ p.symmetry }}%</strong></td>
            <td><status-badge :tone="statusTone[p.status]">{{ t(`dashboard.status.${p.status}`) }}</status-badge></td>
            <td class="right">
              <button type="button" class="action-btn" @click="viewPatientReport(p.id)">
                {{ t('dashboard.patients.view-record') }}
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </section-card>
  </div>
</template>

<style scoped>
.dashboard { display: flex; flex-direction: column; gap: 2rem; max-width: 1180px; margin: 0 auto; }
.dashboard__stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; }

.alert-list { display: flex; flex-direction: column; gap: 0.75rem; margin: 0; padding: 0; list-style: none; }
.alert-row { display: flex; align-items: center; gap: 1rem; padding: 0.9rem 1.1rem; border: 1px solid; border-radius: 10px; }
.alert-row--warning { background: #fffbe6; border-color: #f6e2a3; }
.alert-row--danger  { background: #fdf0f2; border-color: #f4c9d0; }
.alert-row__icon { display: grid; place-items: center; width: 32px; height: 32px; flex-shrink: 0; border-radius: 8px; color: #fff; font-weight: 800; }
.alert-row--warning .alert-row__icon { background: var(--pt-amber); }
.alert-row--danger  .alert-row__icon { background: var(--pt-red); }
.alert-row__text { flex: 1; min-width: 0; }
.alert-row__head { display: flex; flex-wrap: wrap; align-items: center; gap: 0.6rem; margin: 0; font-size: 0.8125rem; }
.alert-row__when { color: var(--pt-muted); }
.alert-row__message { margin: 0.2rem 0 0; font-size: 0.8125rem; }
.alert-row__actions { display: flex; gap: 0.5rem; flex-shrink: 0; }

.btn-light {
  --p-button-primary-background: #fff; --p-button-primary-border-color: var(--pt-border); --p-button-primary-color: var(--pt-ink);
  --p-button-primary-hover-background: #f4f7fa; --p-button-primary-hover-border-color: var(--pt-border); --p-button-primary-hover-color: var(--pt-ink);
  font-size: 0.75rem; font-weight: 600;
}
.btn-teal {
  --p-button-primary-background: var(--pt-teal); --p-button-primary-border-color: var(--pt-teal); --p-button-primary-color: #fff;
  --p-button-primary-hover-background: var(--pt-teal-strong); --p-button-primary-hover-border-color: var(--pt-teal-strong); --p-button-primary-hover-color: #fff;
  font-size: 0.75rem; font-weight: 600;
}

.table-wrap { overflow-x: auto; border-top: 1px solid var(--pt-border); }
.patients { width: 100%; min-width: 860px; border-collapse: collapse; font-size: 0.8125rem; }
.patients th {
  padding: 1.1rem 1rem; text-align: left; font-size: 0.6875rem; font-weight: 700;
  letter-spacing: 0.04em; text-transform: uppercase; color: var(--pt-muted); border-bottom: 1px solid var(--pt-border);
}
.patients td { padding: 1rem; border-bottom: 1px solid var(--pt-border); }
.patients tr:last-child td { border-bottom: none; }
.patients th:first-child, .patients td:first-child { padding-left: 1rem; }
.patients th:last-child, .patients td:last-child { padding-right: 1rem; }
.right { text-align: right !important; }
.patient-cell { display: inline-flex; align-items: center; gap: 0.75rem; }
.good { color: var(--pt-green); }
.link { font-weight: 700; color: var(--pt-teal-strong); }
.link:hover { text-decoration: underline; }

.adherence { display: inline-flex; align-items: center; gap: 0.6rem; }
.adherence__track { width: 62px; height: 8px; border-radius: 999px; background: #eef1f5; overflow: hidden; }
.adherence__bar { display: block; height: 100%; border-radius: 999px; background: #3fb98d; }
.adherence__bar--low { background: var(--pt-teal-strong); }

@media (max-width: 1100px) { .dashboard__stats { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 760px) {
  .alert-row { flex-wrap: wrap; }
  .alert-row__actions { width: 100%; }
}
@media (max-width: 520px) { .dashboard__stats { grid-template-columns: minmax(0, 1fr); } }
</style>
