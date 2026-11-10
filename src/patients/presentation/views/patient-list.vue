<script setup>
import {computed, onMounted, ref} from "vue";
import {useI18n} from "vue-i18n";
import usePatientStore from "../../application/patient.store.js";
import SurfaceCard from "../../../shared/presentation/components/surface-card.vue";
import StatusBadge from "../../../shared/presentation/components/status-badge.vue";
import AvatarInitials from "../../../shared/presentation/components/avatar-initials.vue";

const { t } = useI18n();
const store = usePatientStore();

const query = ref('');
const statusFilter = ref('all');
const kLevelFilter = ref('all');

onMounted(() => {
  if (!store.patientsLoaded) store.fetchPatients();
});

const statusOptions = computed(() => [
  { label: t('patients.filters.all-status'), value: 'all' },
  { label: t('patients.status.stable'),      value: 'stable' },
  { label: t('patients.status.alert'),       value: 'alert' },
  { label: t('patients.status.critical'),    value: 'critical' }
]);

const kLevelOptions = computed(() => [
  { label: t('patients.filters.all-k-levels'), value: 'all' },
  { label: 'K1', value: 'K1' },
  { label: 'K2', value: 'K2' },
  { label: 'K3', value: 'K3' },
  { label: 'K4', value: 'K4' }
]);

const filteredPatients = computed(() => {
  const text = query.value.trim().toLowerCase();
  return store.patients.filter(patient => {
    const matchesText = !text || [patient.fullName, patient.dni, patient.prosthesisCode]
        .some(field => (field || '').toLowerCase().includes(text));
    const matchesStatus = statusFilter.value === 'all' || patient.status === statusFilter.value;
    const matchesKLevel = kLevelFilter.value === 'all' || patient.kLevel === kLevelFilter.value;
    return matchesText && matchesStatus && matchesKLevel;
  });
});

const statusTone = { stable: 'success', alert: 'warning', critical: 'danger' };
const avatarTone = { stable: 'teal',    alert: 'amber',   critical: 'red' };
</script>

<template>
  <div class="patients">
    <surface-card padding="1.25rem 1.5rem">
      <div class="filters">
        <pv-input-text v-model="query" class="filters__search"
                       :placeholder="t('patients.filters.search-placeholder')"
                       :aria-label="t('patients.filters.search-placeholder')"/>
        <pv-select v-model="statusFilter" :options="statusOptions" option-label="label" option-value="value"
                   :aria-label="t('patients.filters.all-status')"/>
        <pv-select v-model="kLevelFilter" :options="kLevelOptions" option-label="label" option-value="value"
                   :aria-label="t('patients.filters.all-k-levels')"/>
      </div>
    </surface-card>

    <surface-card padding="0">
      <div class="table-wrap">
        <table class="table">
          <thead>
          <tr>
            <th>{{ t('patients.columns.patient') }}</th>
            <th>{{ t('patients.columns.amputation') }}</th>
            <th class="center">{{ t('patients.columns.k-level') }}</th>
            <th>{{ t('patients.columns.prosthesis') }}</th>
            <th class="center">{{ t('patients.columns.adherence') }}</th>
            <th class="center">{{ t('patients.columns.symmetry') }}</th>
            <th class="center">{{ t('patients.columns.status') }}</th>
            <th class="right">{{ t('patients.columns.action') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="patient in filteredPatients" :key="patient.id">
            <td>
              <div class="patient-cell">
                <avatar-initials :name="patient.fullName" :tone="avatarTone[patient.status]"/>
                <div>
                  <strong class="patient-cell__name">{{ patient.fullName }}</strong>
                  <span class="patient-cell__meta">DNI: {{ patient.dni }} • {{ patient.age }} {{ t('patients.years') }}</span>
                </div>
              </div>
            </td>
            <td>{{ patient.amputation }}</td>
            <td class="center"><span class="k-pill">{{ patient.kLevel }}</span></td>
            <td><code class="serial">{{ patient.prosthesisCode }}</code></td>
            <td class="center"><strong>{{ patient.adherence }}%</strong></td>
            <td class="center"><strong class="symmetry">{{ patient.symmetry }}%</strong></td>
            <td class="center">
              <status-badge :tone="statusTone[patient.status]">{{ t(`patients.status.${patient.status}`) }}</status-badge>
            </td>
            <td class="right">
              <router-link :to="{ path: '/reports', query: { patientId: patient.id } }" class="record-link">{{ t('patients.view-record') }} →</router-link>
            </td>
          </tr>
          <tr v-if="store.patientsLoaded && !filteredPatients.length">
            <td colspan="8" class="empty">{{ t('patients.empty') }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </surface-card>
  </div>
</template>

<style scoped>
.patients { display: flex; flex-direction: column; gap: 1.25rem; max-width: 1180px; margin: 0 auto; }
.filters { display: grid; grid-template-columns: minmax(0, 1fr) 210px 180px; gap: 0.9rem; align-items: center; }

.table-wrap { overflow-x: auto; }
.table { width: 100%; min-width: 820px; border-collapse: collapse; font-size: 0.8125rem; }
.table th { padding: 0.9rem 1rem; background: #f4f6f8; text-align: left; font-size: 0.75rem; font-weight: 700; color: #4a5a6a; }
.table td { padding: 0.95rem 1rem; border-bottom: 1px solid var(--pt-border); vertical-align: middle; }
.table tbody tr:last-child td { border-bottom: none; }
.table th:first-child, .table td:first-child { padding-left: 1.5rem; }
.table th:last-child, .table td:last-child { padding-right: 1.5rem; }
.center { text-align: center !important; }
.right { text-align: right !important; }

.patient-cell { display: flex; align-items: center; gap: 0.75rem; }
.patient-cell__name { display: block; font-size: 0.875rem; color: var(--pt-ink); }
.patient-cell__meta { display: block; font-size: 0.75rem; color: var(--pt-muted); }

.k-pill { display: inline-block; padding: 2px 9px; border-radius: 6px; background: #eef2f6; font-weight: 700; font-size: 0.75rem; color: var(--pt-navy-600); }
.serial { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.8125rem; color: var(--pt-muted); }
.symmetry { color: var(--pt-teal-strong); }
.record-link { font-weight: 700; color: var(--pt-teal-strong); white-space: nowrap; }
.record-link:hover { text-decoration: underline; }
.empty { padding: 2rem !important; text-align: center; color: var(--pt-muted); }

@media (max-width: 720px) { .filters { grid-template-columns: minmax(0, 1fr); } }
</style>
