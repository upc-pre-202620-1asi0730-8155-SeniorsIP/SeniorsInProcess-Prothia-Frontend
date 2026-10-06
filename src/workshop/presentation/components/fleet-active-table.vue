<script setup>
import { useI18n } from "vue-i18n";

const props = defineProps({
  prostheses: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['open-detail']);
const { t } = useI18n();
</script>

<template>
  <div class="table-wrap">
    <table class="fleet-table">
      <thead>
      <tr>
        <th>{{ t('technician.fleet.col-serial') }}</th>
        <th>{{ t('technician.fleet.col-type') }}</th>
        <th>{{ t('technician.fleet.col-patient') }}</th>
        <th>{{ t('technician.fleet.col-clinic') }}</th>
        <th>{{ t('technician.fleet.col-cycles') }}</th>
        <th>{{ t('technician.fleet.col-last-service') }}</th>
        <th class="right">{{ t('technician.fleet.col-action') }}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in prostheses" :key="item.id">
        <td class="serial-cell">{{ item.serialNumber }}</td>
        <td>{{ item.type }}</td>
        <td class="patient-cell">{{ item.patientName }}</td>
        <td class="clinic-cell">{{ item.clinicName }}</td>
        <td class="cycles-cell">{{ item.formattedCycles }}</td>
        <td class="service-cell">{{ item.lastService }}</td>
        <td class="right">
          <button
              type="button"
              class="action-link"
              @click="emit('open-detail', item)"
          >
            {{ t('technician.fleet.action-sheet') }}
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrap {
  overflow-x: auto;
  border-top: 1px solid var(--pt-border);
}

.fleet-table {
  width: 100%;
  min-width: 860px;
  border-collapse: collapse;
  font-size: 0.8125rem;
}

.fleet-table th {
  padding: 1.1rem 1rem;
  text-align: left;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--pt-muted);
  border-bottom: 1px solid var(--pt-border);
}

.fleet-table td {
  padding: 1.15rem 1rem;
  border-bottom: 1px solid var(--pt-border);
  color: #334155;
}

.fleet-table tr:last-child td {
  border-bottom: none;
}

.fleet-table th:first-child,
.fleet-table td:first-child {
  padding-left: 1.5rem;
}

.fleet-table th:last-child,
.fleet-table td:last-child {
  padding-right: 1.5rem;
}

.serial-cell {
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 0.03em;
}

.patient-cell {
  font-weight: 700;
  color: #0f3b5e;
}

.clinic-cell {
  color: #64748b;
}

.cycles-cell {
  font-weight: 700;
  color: #0f172a;
}

.service-cell {
  color: #475569;
}

.right {
  text-align: right !important;
}

.action-link {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.8125rem;
  color: var(--pt-teal-strong);
  transition: color 0.15s ease;
}

.action-link:hover {
  text-decoration: underline;
  color: #115e59;
}
</style>
