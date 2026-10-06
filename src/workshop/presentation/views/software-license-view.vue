<script setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";

const toast = useToast();

const invoices = ref([
  {
    id: 1,
    invoiceNumber: 'F001-0004912',
    date: '12/09/2026',
    concept: 'Licencia Anual Software Prothia - Taller Ortopédico (100 Prótesis)',
    amount: '$1,788.00',
    status: 'Pagado'
  },
  {
    id: 2,
    invoiceNumber: 'F001-0003820',
    date: '12/09/2025',
    concept: 'Licencia Anual Software Prothia - Taller Ortopédico (50 Prótesis)',
    amount: '$990.00',
    status: 'Pagado'
  }
]);

function downloadInvoice(inv) {
  toast.add({
    severity: 'info',
    summary: 'Descargando Comprobante',
    detail: `Descarga de factura ${inv.invoiceNumber} iniciada en formato PDF.`,
    life: 3000
  });
}
</script>

<template>
  <div class="software-license-page">
    <div class="license-layout">
      <!-- Card 1: Active Software License & Capacity -->
      <section class="license-card">
        <div class="license-card__top">
          <div class="license-status-line">
            <span class="status-pill status-pill--active">Licencia Activa</span>
            <span class="plan-name">Plan Taller Ortopédico Anual</span>
          </div>

          <div class="pricing-box">
            <div class="price-line">
              <span class="currency">$1,788</span>
              <span class="period">/ año</span>
            </div>
            <span class="price-sub">$149 mensual facturado</span>
          </div>
        </div>

        <div class="license-card__title-section">
          <h2 class="license-title">Licencia de Software para Centros Ortopédicos</h2>
          <p class="license-validity">
            Vigencia: 12/09/2026 hasta 12/09/2027 • Trazabilidad IoT multimarca
          </p>
        </div>

        <div class="capacity-section">
          <div class="capacity-header">
            <span class="capacity-title">Capacidad de Prótesis en Telemetría Activa:</span>
            <span class="capacity-metrics">42 de 100 dispositivos registrados (42%)</span>
          </div>

          <pv-progress-bar :value="42" :showValue="false" class="capacity-bar" />

          <p class="capacity-footer">
            58 cupos disponibles para ensamblajes futuros sin costo adicional.
          </p>
        </div>
      </section>

      <!-- Card 2: Comprobantes Tributarios -->
      <section class="invoices-card">
        <div class="invoices-card__header">
          <h3 class="invoices-title">Comprobantes Tributarios</h3>
          <p class="invoices-subtitle">
            Emitidos a nombre de: Ortopedia Técnica Avanzada S.A.C. (RUC 20554189632)
          </p>
        </div>

        <div class="table-container">
          <table class="invoices-table">
            <thead>
            <tr>
              <th>N° FACTURA</th>
              <th>FECHA</th>
              <th>CONCEPTO</th>
              <th>IMPORTE</th>
              <th>ESTADO</th>
              <th class="right">DESCARGA</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="inv in invoices" :key="inv.id">
              <td class="invoice-num">{{ inv.invoiceNumber }}</td>
              <td class="date-cell">{{ inv.date }}</td>
              <td class="concept-cell">{{ inv.concept }}</td>
              <td class="amount-cell">{{ inv.amount }}</td>
              <td>
                <span class="paid-tag">{{ inv.status }}</span>
              </td>
              <td class="right">
                <button
                    type="button"
                    class="btn-download-pdf"
                    @click="downloadInvoice(inv)"
                >
                  PDF
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.software-license-page {
  max-width: 1240px;
  margin: 0 auto;
}

.license-layout {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

/* Card 1 */
.license-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid var(--pt-border);
  box-shadow: 0 1px 3px rgba(10, 31, 51, 0.05);
  padding: 2rem 2.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.license-card__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
}

.license-status-line {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.status-pill {
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
}

.status-pill--active {
  background: #eaf7f0;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.plan-name {
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 500;
}

.pricing-box {
  text-align: right;
}

.price-line {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 0.25rem;
}

.currency {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--pt-navy-900);
  line-height: 1;
}

.period {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 600;
}

.price-sub {
  display: block;
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 0.25rem;
}

.license-title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--pt-navy-900);
}

.license-validity {
  margin: 0.35rem 0 0;
  font-size: 0.8125rem;
  color: #64748b;
}

/* Capacity Section */
.capacity-section {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.capacity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8125rem;
}

.capacity-title {
  font-weight: 700;
  color: #334155;
}

.capacity-metrics {
  font-weight: 700;
  color: #334155;
}

.capacity-bar {
  height: 8px !important;
  border-radius: 999px;
  background: #e2e8f0;
}

.capacity-bar :deep(.p-progressbar-value) {
  background: #0f766e;
  border-radius: 999px;
}

.capacity-footer {
  margin: 0;
  font-size: 0.75rem;
  color: #64748b;
}

/* Card 2: Invoices */
.invoices-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid var(--pt-border);
  box-shadow: 0 1px 3px rgba(10, 31, 51, 0.05);
  padding: 1.75rem 2.25rem 2rem;
}

.invoices-card__header {
  margin-bottom: 1.5rem;
}

.invoices-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--pt-navy-900);
}

.invoices-subtitle {
  margin: 0.35rem 0 0;
  font-size: 0.8125rem;
  color: #64748b;
}

.table-container {
  overflow-x: auto;
}

.invoices-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}

.invoices-table th {
  padding: 0.85rem 1rem;
  font-size: 0.65625rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #64748b;
  text-transform: uppercase;
  border-bottom: 1px solid #eef2f6;
  text-align: left;
  white-space: nowrap;
}

.invoices-table td {
  padding: 1.15rem 1rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.invoices-table tr:hover td {
  background: #f8fafc;
}

.invoice-num {
  font-weight: 700;
  font-family: monospace;
  color: var(--pt-navy-900);
}

.date-cell {
  color: #475569;
}

.concept-cell {
  color: #334155;
  font-weight: 500;
}

.amount-cell {
  font-weight: 700;
  color: var(--pt-navy-900);
}

.paid-tag {
  display: inline-block;
  background: #eaf7f0;
  color: #16a34a;
  border: 1px solid #bbf7d0;
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
}

.right {
  text-align: right;
}

.btn-download-pdf {
  background: transparent;
  border: none;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--pt-navy-900);
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: color 0.15s ease;
}

.btn-download-pdf:hover {
  text-decoration: underline;
  color: #0f766e;
}
</style>
