<script setup>
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import usePatientStore from "../../application/patient.store.js";
import SurfaceCard from "../../../shared/presentation/components/surface-card.vue";
import StatusBadge from "../../../shared/presentation/components/status-badge.vue";
import AvatarInitials from "../../../shared/presentation/components/avatar-initials.vue";

const { t } = useI18n();
const store = usePatientStore();

const search = ref('');
const amputation = ref(null);
const status = ref(null);

onMounted(() => store.fetchPatients());

const statusTone = { alert: 'warning', critical: 'danger', stable: 'success' };
const avatarTones = ['mint', 'blue', 'slate'];
const avatarTone = patient => avatarTones[patient.id % avatarTones.length];

const amputationOptions = computed(() => [
  { label: t('patients.filters.all-levels'), value: null },
  ...[...new Set(store.patients.map(p => p.amputation))].map(level => ({ label: level, value: level }))
]);
const statusOptions = computed(() => [
  { label: t('patients.filters.all-statuses'), value: null },
  ...['alert', 'critical', 'stable'].map(key => ({ label: t(`patients.status.${key}`), value: key }))
]);

const filteredPatients = computed(() => {
  const query = search.value.trim().toLowerCase();
  return store.patients.filter(patient =>
      (!amputation.value || patient.amputation === amputation.value) &&
      (!status.value || patient.status === status.value) &&
      (!query || [patient.fullName, patient.dni, patient.prosthesisCode].some(field => field.toLowerCase().includes(query)))
  );
});
</script>

<template>
  <div class="patients">
    <surface-card>
      <div class="filters">
        <pv-icon-field class="filters__search">
          <pv-input-icon class="pi pi-search"/>
          <pv-input-text v-model="search" class="w-full" :placeholder="t('patients.search-placeholder')"
                         :aria-label="t('patients.search-placeholder')"/>
        </pv-icon-field>
        <pv-select v-model="amputation" :options="amputationOptions" option-label="label" option-value="value"
                   class="filters__select" :aria-label="t('patients.filters.all-levels')"/>
        <pv-select v-model="status" :options="statusOptions" option-label="label" option-value="value"
                   class="filters__select filters__select--short" :aria-label="t('patients.filters.all-statuses')"/>
      </div>
    </surface-card>

    <surface-card padding="0">
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th>{{ t('patients.columns.patient') }}</th>
              <th>{{ t('patients.columns.amputation') }}</th>
              <th>{{ t('patients.columns.k-level') }}</th>
              <th>{{ t('patients.columns.prosthesis') }}</th>
              <th>{{ t('patients.columns.adherence') }}</th>
              <th>{{ t('patients.columns.symmetry') }}</th>
              <th>{{ t('patients.columns.status') }}</th>
              <th class="right">{{ t('patients.columns.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="patient in filteredPatients" :key="patient.id">
              <td>
                <span class="person">
                  <avatar-initials :name="patient.fullName" :tone="avatarTone(patient)" :size="40"/>
                  <span>
                    <strong class="person__name">{{ patient.fullName }}</strong>
                    <span class="person__meta">DNI {{ patient.dni }} • {{ t('patients.years', { age: patient.age }) }}</span>
                  </span>
                </span>
              </td>
              <td class="amputation">{{ patient.amputation }}</td>
              <td><span class="klevel">{{ patient.kLevel }}</span></td>
              <td class="mono">{{ patient.prosthesisCode }}</td>
              <td><strong>{{ patient.adherence }}%</strong></td>
              <td :class="patient.symmetry >= 90 ? 'good' : 'neutral'"><strong>{{ patient.symmetry }}%</strong></td>
              <td><status-badge :tone="statusTone[patient.status]">{{ t(`patients.status.${patient.status}`) }}</status-badge></td>
              <td class="right">
                <span class="actions">
                  <router-link :to="`/patients/${patient.id}`" class="actions__primary">{{ t('patients.record') }}</router-link>
                  <router-link to="/alerts" class="actions__secondary">{{ t('patients.telemetry') }}</router-link>
                </span>
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
.patients { display: flex; flex-direction: column; gap: 1.5rem; max-width: 1180px; margin: 0 auto; }
.filters { display: flex; align-items: center; gap: 1rem; }
.filters__search { flex: 1; min-width: 0; }
.filters__select { width: 290px; font-size: 0.8125rem; font-weight: 600; }
.filters__select--short { width: 200px; }

.table-wrap { overflow-x: auto; }
.table { width: 100%; min-width: 980px; border-collapse: collapse; font-size: 0.8125rem; }
.table th {
  padding: 1.25rem 1rem; text-align: left; font-size: 0.6875rem; font-weight: 700;
  letter-spacing: 0.04em; text-transform: uppercase; color: var(--pt-muted); border-bottom: 1px solid var(--pt-border);
}
.table td { padding: 0.9rem 1rem; border-bottom: 1px solid var(--pt-border); }
.table tbody tr:last-child td { border-bottom: none; }
.table th:first-child, .table td:first-child { padding-left: 1.5rem; }
.table th:last-child, .table td:last-child { padding-right: 1.5rem; }
.right { text-align: right !important; }

.person { display: inline-flex; align-items: center; gap: 0.85rem; }
.person__name { display: block; font-size: 0.875rem; color: var(--pt-ink); }
.person__meta { display: block; font-size: 0.75rem; color: var(--pt-muted); }
.amputation { font-weight: 500; color: var(--pt-navy-600); }
.klevel { display: inline-block; padding: 2px 10px; border-radius: 6px; background: #e9eef3; font-weight: 700; color: var(--pt-navy-600); }
.mono { font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace; font-size: 0.75rem; color: #4a5a6a; }
.good { color: var(--pt-green); }
.neutral { color: var(--pt-navy-600); }
.actions { display: inline-flex; gap: 1rem; font-weight: 600; }
.actions__primary { color: var(--pt-teal-strong); font-weight: 700; }
.actions__secondary { color: var(--pt-muted); }
.actions a:hover { text-decoration: underline; }
.empty { padding: 2rem !important; text-align: center; color: var(--pt-muted); }

@media (max-width: 860px) {
  .filters { flex-direction: column; align-items: stretch; }
  .filters__select, .filters__select--short { width: 100%; }
}
</style>
