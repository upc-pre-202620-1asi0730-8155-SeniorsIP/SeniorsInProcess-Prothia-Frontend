<script setup>
import { ref, computed, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import useWorkshopStore from "../../application/workshop.store.js";
import ProsthesisDetailDialog from "../components/prosthesis-detail-dialog.vue";

const store = useWorkshopStore();
const toast = useToast();

const searchQuery = ref('');
const filterStatus = ref('all');
const showAssociateDialog = ref(false);
const selectedProsthesisForAssociate = ref(null);
const patientToAssociate = ref('');

const statusOptions = [
  { label: 'Todos los estados', value: 'all' },
  { label: 'Óptimo', value: 'optimal' },
  { label: 'Fatiga crítica', value: 'critical' },
  { label: 'En almacén', value: 'storage' },
  { label: 'Precaución', value: 'warning' }
];

onMounted(() => {
  store.fetchFleet();
});

const filteredProstheses = computed(() => {
  return store.prostheses.filter(item => {
    const q = searchQuery.value.toLowerCase().trim();
    const matchesSearch = !q ||
        item.serialNumber.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.patientName.toLowerCase().includes(q) ||
        (item.kneeType && item.kneeType.toLowerCase().includes(q)) ||
        (item.footType && item.footType.toLowerCase().includes(q));

    const matchesStatus = filterStatus.value === 'all' || item.status === filterStatus.value;
    return matchesSearch && matchesStatus;
  });
});

function openDetail(item) {
  store.openProsthesisDetail(item);
}

function handleAssociate(item) {
  selectedProsthesisForAssociate.value = item;
  patientToAssociate.value = '';
  showAssociateDialog.value = true;
}

function saveAssociation() {
  if (!patientToAssociate.value) {
    toast.add({
      severity: 'warn',
      summary: 'Campo requerido',
      detail: 'Por favor ingrese el nombre del paciente a vincular.',
      life: 3000
    });
    return;
  }
  if (selectedProsthesisForAssociate.value) {
    selectedProsthesisForAssociate.value.patientName = patientToAssociate.value;
    selectedProsthesisForAssociate.value.status = 'optimal';
    toast.add({
      severity: 'success',
      summary: 'Prótesis Vinculada',
      detail: `${selectedProsthesisForAssociate.value.serialNumber} fue asignada a ${patientToAssociate.value}.`,
      life: 3000
    });
  }
  showAssociateDialog.value = false;
}

function getStatusBadge(status) {
  switch (status) {
    case 'optimal':
      return { label: 'Óptimo', class: 'tag--optimal' };
    case 'critical':
      return { label: 'Fatiga crítica', class: 'tag--critical' };
    case 'storage':
      return { label: 'En almacén', class: 'tag--storage' };
    case 'warning':
    default:
      return { label: 'Precaución', class: 'tag--warning' };
  }
}

function formatComponent(item) {
  if (item.kneeType && item.kneeType !== 'N/A' && !item.kneeType.includes('Transtibial')) {
    return item.kneeType;
  }
  return item.footType || 'Pie dinámico estándar';
}
</script>

<template>
  <div class="fleet-inventory-page">
    <div class="inventory-card">
      <!-- Search & Filters Bar -->
      <div class="filters-bar">
        <pv-icon-field class="search-field">
          <pv-input-icon class="pi pi-search" />
          <pv-input-text
              v-model="searchQuery"
              placeholder="Buscar por serie, modelo o paciente..."
              fluid
          />
        </pv-icon-field>

        <pv-select
            v-model="filterStatus"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            class="status-select"
        />
      </div>

      <!-- Inventory Table matching screenshot -->
      <div class="table-container">
        <table class="inventory-table">
          <thead>
          <tr>
            <th>N° SERIE</th>
            <th>TIPO & ENCAJE</th>
            <th>COMPONENTE RODILLA / PIE</th>
            <th>PACIENTE VINCULADO</th>
            <th>CICLOS ACUMULADOS</th>
            <th>ESTADO</th>
            <th class="actions-col">ACCIONES</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in filteredProstheses" :key="item.id">
            <td class="serial-cell">{{ item.serialNumber }}</td>
            <td class="type-cell">{{ item.type }}</td>
            <td class="component-cell">{{ formatComponent(item) }}</td>
            <td class="patient-cell" :class="{ 'patient-cell--unassigned': item.status === 'storage' }">
              <span v-if="item.status === 'storage'">Disponible sin asignar</span>
              <span v-else class="patient-name">{{ item.patientName }}</span>
            </td>
            <td class="cycles-cell">
                <span
                    v-if="item.status !== 'storage'"
                    class="cycles-text"
                    :class="{ 'cycles-text--critical': item.wearPercentage >= 100 }"
                >
                  {{ item.formattedCycles }} / 800k ({{ item.wearPercentage }}%)
                </span>
              <span v-else class="cycles-zero">0 ciclos</span>
            </td>
            <td>
                <span class="status-tag" :class="getStatusBadge(item.status).class">
                  {{ getStatusBadge(item.status).label }}
                </span>
            </td>
            <td class="actions-col">
              <button
                  v-if="item.status === 'storage'"
                  type="button"
                  class="btn-action btn-action--associate"
                  @click="handleAssociate(item)"
              >
                Asociar
              </button>
              <button
                  v-else
                  type="button"
                  class="btn-action btn-action--detail"
                  @click="openDetail(item)"
              >
                Ficha Técnica
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Prosthesis Detail Dialog -->
    <prosthesis-detail-dialog
        v-model:visible="store.showDetailDialog"
        :prosthesis="store.activeProsthesisForDetail"
    />

    <!-- Associate Dialog -->
    <pv-dialog
        v-model:visible="showAssociateDialog"
        modal
        header="Vincular Prótesis a Paciente"
        :style="{ width: '440px' }"
    >
      <div v-if="selectedProsthesisForAssociate" class="associate-form">
        <p class="associate-desc">
          Asigne la prótesis <strong>{{ selectedProsthesisForAssociate.serialNumber }}</strong> ({{ selectedProsthesisForAssociate.type }}) a un paciente registrado:
        </p>
        <div class="field">
          <label for="assoc-name">Nombre Completo del Paciente</label>
          <pv-input-text
              id="assoc-name"
              v-model="patientToAssociate"
              placeholder="Ej. Roberto Sánchez P."
              fluid
          />
        </div>
      </div>
      <template #footer>
        <pv-button label="Cancelar" text @click="showAssociateDialog = false" />
        <pv-button label="Confirmar Vinculación" severity="success" @click="saveAssociation" />
      </template>
    </pv-dialog>
  </div>
</template>

<style scoped>
.fleet-inventory-page {
  max-width: 1240px;
  margin: 0 auto;
}

.inventory-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid var(--pt-border);
  box-shadow: 0 1px 3px rgba(10, 31, 51, 0.05);
  padding: 1.5rem 1.75rem 2rem;
}

.filters-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.75rem;
}

.search-field {
  flex: 1;
  max-width: 380px;
}

.search-field :deep(.p-inputtext) {
  background: #f8fafc;
  border-color: #e2e8f0;
  border-radius: 10px;
  font-size: 0.8125rem;
}

.status-select {
  min-width: 190px;
  border-radius: 10px;
  background: #f8fafc;
  border-color: #e2e8f0;
  font-size: 0.8125rem;
}

.table-container {
  overflow-x: auto;
}

.inventory-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
  text-align: left;
}

.inventory-table th {
  padding: 0.85rem 1rem;
  font-size: 0.65625rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #64748b;
  text-transform: uppercase;
  border-bottom: 1px solid #eef2f6;
  white-space: nowrap;
}

.inventory-table td {
  padding: 1.15rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.inventory-table tr:hover td {
  background: #f8fafc;
}

.serial-cell {
  font-weight: 700;
  color: var(--pt-navy-900);
  font-family: monospace;
  font-size: 0.84rem;
  white-space: nowrap;
}

.type-cell {
  color: #334155;
  font-weight: 500;
}

.component-cell {
  color: #475569;
}

.patient-cell {
  color: var(--pt-navy-900);
}

.patient-cell .patient-name {
  font-weight: 700;
}

.patient-cell--unassigned {
  font-style: italic;
  color: #94a3b8;
}

.cycles-cell {
  white-space: nowrap;
}

.cycles-text {
  font-weight: 700;
  color: var(--pt-navy-900);
}

.cycles-text--critical {
  color: #dc2626 !important;
}

.cycles-zero {
  color: #94a3b8;
}

.status-tag {
  display: inline-block;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
}

.tag--optimal {
  background: #eaf7f0;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.tag--critical {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.tag--storage {
  background: #e0f2fe;
  color: #0284c7;
  border: 1px solid #bae6fd;
}

.tag--warning {
  background: #fef3c7;
  color: #d97706;
  border: 1px solid #fde68a;
}

.actions-col {
  text-align: right;
  white-space: nowrap;
}

.btn-action {
  background: transparent;
  border: none;
  font-size: 0.8125rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0.35rem 0.5rem;
  transition: opacity 0.15s ease;
}

.btn-action:hover {
  text-decoration: underline;
}

.btn-action--detail {
  color: var(--pt-teal-strong);
}

.btn-action--associate {
  color: #0284c7;
}

.associate-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem 0;
}

.associate-desc {
  margin: 0;
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.5;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--pt-navy-900);
}
</style>
