<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useAnalyticsStore } from "../../application/analytics.store.js";
import { usePatientStore } from "../../../patients/application/patient.store.js";

const route = useRoute();
const toast = useToast();
const analyticsStore = useAnalyticsStore();
const patientStore = usePatientStore();

const selectedPatientId = ref(1);
const selectedPeriod = ref('last-month');

const defaultPatientOptions = [
  { label: 'Carlos Mendoza Arias (Transtibial Der.)', value: 1 },
  { label: 'Roberto Sánchez P. (Transfemoral Izq.)', value: 2 },
  { label: 'María Vega Castro (Transtibial Bilateral)', value: 3 },
  { label: 'Jorge Alarcón Ruiz (Transtibial Izq.)', value: 4 }
];

const patientOptions = computed(() => {
  if (patientStore.patients && patientStore.patients.length > 0) {
    return patientStore.patients.map(p => ({
      label: `${p.fullName} (${p.amputation})`,
      value: p.id
    }));
  }
  return defaultPatientOptions;
});

const periodOptions = ref([
  { label: 'Último Mes (12/08/2026 - 12/09/2026)', value: 'last-month' },
  { label: 'Último Trimestre (12/06/2026 - 12/09/2026)', value: 'last-quarter' },
  { label: 'Histórico Completo', value: 'all-time' }
]);

const report = computed(() => analyticsStore.activeReport);

watch(selectedPatientId, (newId) => {
  if (newId) {
    analyticsStore.selectPatientReport(newId);
  }
});

watch(selectedPeriod, (newPeriod) => {
  if (report.value) {
    const periodObj = periodOptions.value.find(p => p.value === newPeriod);
    if (periodObj) {
      report.value.evaluationPeriod = periodObj.label;
    }
  }
});

function onPatientChange(event) {
  const newId = event?.value ?? selectedPatientId.value;
  analyticsStore.selectPatientReport(newId);
  toast.add({
    severity: 'info',
    summary: 'Expediente Clínico Cargado',
    detail: `Visualizando reporte y métricas de ${report.value.patientName}`,
    life: 2500
  });
}

function onPeriodChange(event) {
  const newPeriod = event?.value ?? selectedPeriod.value;
  const periodObj = periodOptions.value.find(p => p.value === newPeriod);
  if (periodObj && report.value) {
    report.value.evaluationPeriod = periodObj.label;
  }
}

onMounted(async () => {
  if (!patientStore.patientsLoaded) {
    await patientStore.fetchPatients();
  }
  if (!analyticsStore.reportsLoaded) {
    await analyticsStore.fetchReports();
  }
  if (route.query.patientId) {
    selectedPatientId.value = Number(route.query.patientId);
  }
  analyticsStore.selectPatientReport(selectedPatientId.value);
});

watch(() => route.query.patientId, (newId) => {
  if (newId) {
    selectedPatientId.value = Number(newId);
    analyticsStore.selectPatientReport(selectedPatientId.value);
  }
});

function handleExportCsv() {
  analyticsStore.exportCsv();
  toast.add({
    severity: 'success',
    summary: 'Archivo CSV Generado',
    detail: `Se exportaron los indicadores cinemáticos de ${report.value.patientName} exitosamente.`,
    life: 3000
  });
}

function handlePrintPdf() {
  toast.add({
    severity: 'info',
    summary: 'Preparando Impresión',
    detail: `Generando vista de impresión clínica para ${report.value.patientName}...`,
    life: 2500
  });
  setTimeout(() => {
    analyticsStore.triggerPrint();
  }, 300);
}
</script>

<template>
  <div class="clinical-reports-page">
    <!-- Top Action Bar -->
    <header class="page-header no-print">
      <div>
        <h1 class="page-title">Generador de Reportes Clínicos</h1>
        <p class="page-subtitle">
          Emisión de informes técnicos y exportación de series temporales de marcha
        </p>
      </div>

      <div class="header-actions">
        <pv-button
            label="Exportar CSV"
            icon="pi pi-download"
            outlined
            class="btn-export-csv"
            @click="handleExportCsv"
        />
        <pv-button
            label="Imprimir / PDF Clínico"
            icon="pi pi-print"
            class="btn-print-pdf"
            @click="handlePrintPdf"
        />
      </div>
    </header>

    <!-- Filter Bar -->
    <section class="filters-card no-print">
      <div class="filter-group">
        <label class="filter-label">Paciente:</label>
        <pv-select
            v-model="selectedPatientId"
            :options="patientOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Seleccionar paciente"
            class="filter-select w-full md:w-20rem"
            @change="onPatientChange"
        />
      </div>

      <div class="filter-group">
        <label class="filter-label">Periodo de Evaluación:</label>
        <pv-select
            v-model="selectedPeriod"
            :options="periodOptions"
            optionLabel="label"
            optionValue="value"
            class="filter-select w-full md:w-20rem"
            @change="onPeriodChange"
        />
      </div>
    </section>

    <!-- Official Clinical Report Sheet -->
    <article class="clinical-sheet">
      <!-- Sheet Header -->
      <header class="sheet-header">
        <div class="clinic-brand">
          <div class="brand-logo-box">
            <span>P</span>
          </div>
          <div class="clinic-text">
            <h2 class="clinic-name">{{ report.clinicName }}</h2>
            <p class="clinic-unit">{{ report.clinicUnit }}</p>
          </div>
        </div>

        <div class="sheet-meta">
          <span class="report-code-badge">{{ report.reportCode }}</span>
          <p class="issue-date">Fecha de emisión: {{ report.issueDate }}</p>
        </div>
      </header>

      <hr class="sheet-divider" />

      <!-- Patient Information Grid -->
      <section class="patient-info-grid">
        <div class="info-cell">
          <span class="cell-label">PACIENTE</span>
          <strong class="cell-value">{{ report.patientName }}</strong>
        </div>
        <div class="info-cell">
          <span class="cell-label">DNI / EDAD</span>
          <strong class="cell-value">{{ report.dni }} ({{ report.age }} años)</strong>
        </div>
        <div class="info-cell">
          <span class="cell-label">DIAGNÓSTICO / NIVEL</span>
          <strong class="cell-value">{{ report.diagnosis }}</strong>
        </div>
        <div class="info-cell">
          <span class="cell-label">PRÓTESIS ASOCIADA</span>
          <strong class="cell-value">{{ report.prosthesisCode }}</strong>
        </div>
      </section>

      <!-- Section 1: Summary -->
      <section class="sheet-section">
        <h3 class="section-title">1. RESUMEN DE ADHERENCIA Y DESEMPEÑO BIOMECÁNICO</h3>
        <p class="section-paragraph">
          {{ report.summary }}
        </p>
      </section>

      <!-- Section 2: Quantitative Indicators Table -->
      <section class="sheet-section">
        <h3 class="section-title">2. INDICADORES CUANTITATIVOS DE MARCHA</h3>

        <div class="table-container">
          <table class="indicators-table">
            <thead>
            <tr>
              <th>Indicador Biomecánico</th>
              <th>Valor Obtenido</th>
              <th>Rango de Normalidad</th>
              <th>Evaluación Clínica</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(ind, index) in report.indicators" :key="index">
              <td class="font-medium text-navy">{{ ind.name }}</td>
              <td class="font-bold" :class="{ 'text-warning': ind.status === 'warning' }">
                {{ ind.value }}
              </td>
              <td class="text-secondary">{{ ind.normalRange }}</td>
              <td>
                  <span :class="ind.status === 'warning' ? 'tag-warning' : 'tag-normal'">
                    {{ ind.evaluation }}
                  </span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Section 3: Recommendation & Signature Block -->
      <footer class="sheet-footer">
        <div class="recommendation-col">
          <strong class="rec-label">Recomendación Médica:</strong>
          <p class="rec-text">{{ report.medicalRecommendation }}</p>
        </div>

        <div class="signature-col">
          <div class="signature-line" />
          <strong class="sig-name">{{ report.therapistName }}</strong>
          <span class="sig-role">{{ report.therapistRole }}</span>
          <span class="sig-reg">{{ report.therapistRegistry }}</span>
        </div>
      </footer>
    </article>
  </div>
</template>

<style scoped>
.clinical-reports-page {
  padding: 1.5rem 2rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1100px;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: #1a2838;
}
.page-subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.8125rem;
  color: #64748b;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.btn-export-csv {
  border-color: #cbd5e1 !important;
  color: #334155 !important;
  font-weight: 600 !important;
}
.btn-print-pdf {
  background: #0f766e !important;
  border-color: #0f766e !important;
  color: #ffffff !important;
  font-weight: 600 !important;
}

/* Filters Card */
.filters-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.filter-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #334155;
  white-space: nowrap;
}

/* Clinical Report Document Sheet */
.clinical-sheet {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 2.5rem 3rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  font-family: inherit;
}

.sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
}

.clinic-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.brand-logo-box {
  width: 44px;
  height: 44px;
  background: #0f172a;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 900;
  font-size: 1.4rem;
}
.clinic-name {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: 0.02em;
}
.clinic-unit {
  margin: 0.2rem 0 0;
  font-size: 0.75rem;
  color: #64748b;
}

.sheet-meta {
  text-align: right;
}
.report-code-badge {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #475569;
  padding: 0.25rem 0.6rem;
  display: inline-block;
}
.issue-date {
  margin: 0.35rem 0 0;
  font-size: 0.75rem;
  color: #64748b;
}

.sheet-divider {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 1.25rem 0 1.5rem;
}

/* Patient Info Grid */
.patient-info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 1rem 1.25rem;
  margin-bottom: 2rem;
}
.info-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.cell-label {
  font-size: 0.6875rem;
  font-weight: 700;
  color: #64748b;
  letter-spacing: 0.04em;
}
.cell-value {
  font-size: 0.8125rem;
  color: #0f172a;
}

/* Sections */
.sheet-section {
  margin-bottom: 2rem;
}
.section-title {
  margin: 0 0 0.85rem;
  font-size: 0.84375rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: 0.02em;
}
.section-paragraph {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: #334155;
  text-align: justify;
}

/* Indicators Table */
.indicators-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}
.indicators-table th {
  text-align: left;
  padding: 0.65rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #475569;
  background: #f8fafc;
  border-bottom: 1px solid #cbd5e1;
}
.indicators-table td {
  padding: 0.75rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
}
.text-navy {
  color: #0f172a;
}
.text-secondary {
  color: #64748b;
}
.text-warning {
  color: #d97706;
}
.tag-normal {
  color: #059669;
  font-weight: 600;
}
.tag-warning {
  color: #d97706;
  font-weight: 600;
}

/* Footer / Signature */
.sheet-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 3rem;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f5f9;
}
.recommendation-col {
  flex: 1;
}
.rec-label {
  display: block;
  font-size: 0.8125rem;
  color: #0f172a;
  margin-bottom: 0.35rem;
}
.rec-text {
  margin: 0;
  font-size: 0.78125rem;
  line-height: 1.5;
  color: #475569;
}

.signature-col {
  text-align: center;
  min-width: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.signature-line {
  width: 180px;
  border-top: 1px solid #475569;
  margin-bottom: 0.5rem;
}
.sig-name {
  font-size: 0.8125rem;
  color: #0f172a;
}
.sig-role {
  font-size: 0.71875rem;
  color: #64748b;
  margin-top: 0.15rem;
}
.sig-reg {
  font-size: 0.6875rem;
  color: #64748b;
}

/* Print Optimization */
@media print {
  .no-print {
    display: none !important;
  }
  .clinical-reports-page {
    padding: 0;
    max-width: 100%;
  }
  .clinical-sheet {
    border: none;
    box-shadow: none;
    padding: 0;
  }
}
</style>
