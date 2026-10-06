<script setup>
import { ref, onMounted, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { useBillingStore } from "../../application/billing.store.js";

const toast = useToast();
const billingStore = useBillingStore();

const showUpgradeDialog = ref(false);
const showCardDialog = ref(false);
const newCardNumber = ref('');
const newCardExpiry = ref('');

const sub = computed(() => billingStore.subscription);
const invoices = computed(() => billingStore.invoices);

onMounted(() => {
  if (!billingStore.subscriptionLoaded) {
    billingStore.fetchSubscription();
  }
  if (!billingStore.invoicesLoaded) {
    billingStore.fetchInvoices();
  }
});

function handleUpgradeQuota() {
  billingStore.upgradeQuota(100);
  showUpgradeDialog.value = false;
  toast.add({
    severity: 'success',
    summary: 'Cupo Ampliado',
    detail: 'El cupo institucional se ha actualizado a 100 pacientes en monitoreo.',
    life: 4000
  });
}

function handleSaveCard() {
  if (newCardNumber.value.trim().length >= 4) {
    const last4 = newCardNumber.value.trim().slice(-4);
    billingStore.updatePaymentMethod({
      brand: 'VISA',
      cardTitle: `Tarjeta Corporativa terminada en ${last4}`,
      expiry: newCardExpiry.value.trim() || '12/30',
      autoRenew: true
    });
    showCardDialog.value = false;
    toast.add({
      severity: 'success',
      summary: 'Método Actualizado',
      detail: 'Se guardó la nueva tarjeta corporativa exitosamente.',
      life: 3500
    });
  }
}

function handleDownloadInvoice(inv) {
  toast.add({
    severity: 'info',
    summary: 'Descargando Comprobante',
    detail: `Descargando factura electrónica ${inv.invoiceNumber} en formato PDF...`,
    life: 3000
  });
}
</script>

<template>
  <div class="clinic-subscription-page">
    <!-- Top Header -->
    <header class="page-header">
      <div>
        <h1 class="page-title">Gestión de Suscripción Anual</h1>
        <p class="page-subtitle">
          Vigencia, cupos contratados y facturación electrónica institucional
        </p>
      </div>
    </header>

    <!-- Main Subscription Plan Card -->
    <section class="card plan-card">
      <div class="plan-card__top">
        <div class="plan-info">
          <div class="badge-row">
            <span class="status-tag status-tag--active">{{ sub.status }}</span>
            <span class="plan-type-chip">{{ sub.planType }}</span>
          </div>
          <h2 class="plan-name">{{ sub.planName }}</h2>
          <p class="plan-dates">
            Contratado el {{ sub.startDate }} • Próxima renovación: {{ sub.renewalDate }}
          </p>
        </div>

        <div class="plan-pricing">
          <div class="price-main">
            <span class="price-value">${{ Number(sub.annualFee).toLocaleString() }}</span>
            <span class="price-period">/año</span>
          </div>
          <p class="price-monthly">${{ sub.monthlyEquivalent }} mensual facturado</p>
        </div>
      </div>

      <!-- Quota Capacity Section -->
      <div class="quota-section">
        <div class="quota-row-label">
          <span class="quota-title">Pacientes Amputados en Monitoreo:</span>
          <span class="quota-value">
            <strong>{{ sub.usedQuota }} de {{ sub.totalQuota }} cupos ocupados ({{ sub.quotaPercentage }}%)</strong>
          </span>
        </div>

        <div class="progress-track">
          <div
              class="progress-fill"
              :style="{ width: `${sub.quotaPercentage}%` }"
          />
        </div>

        <div class="quota-subrow">
          <span class="quota-available">
            {{ sub.availableQuota }} cupos disponibles para nuevos pacientes
          </span>
          <button
              type="button"
              class="upgrade-btn-link"
              @click="showUpgradeDialog = true"
          >
            + Ampliar Cupo a 100 Pacientes
          </button>
        </div>
      </div>

      <!-- Payment Method Box -->
      <div class="payment-box">
        <div class="visa-badge">
          <span>VISA</span>
        </div>
        <div class="payment-text">
          <p class="card-title">{{ sub.paymentMethod?.cardTitle || 'Tarjeta Corporativa terminada en 4281' }}</p>
          <p class="card-meta">
            Expira en {{ sub.paymentMethod?.expiry || '08/29' }} • Renovación automática activada
          </p>
        </div>
        <button
            type="button"
            class="change-card-btn"
            @click="showCardDialog = true"
        >
          Cambiar Tarjeta
        </button>
      </div>
    </section>

    <!-- Invoices History Card -->
    <section class="card invoices-card">
      <div class="invoices-header">
        <h2 class="invoices-title">Historial de Comprobantes de Pago</h2>
        <p class="invoices-subtitle">
          Facturas electrónicas emitidas a nombre de Centro de Rehabilitación Física Lima Sur
        </p>
      </div>

      <div class="table-container">
        <table class="invoices-table">
          <thead>
          <tr>
            <th>N° COMPROBANTE</th>
            <th>FECHA DE EMISIÓN</th>
            <th>CONCEPTO</th>
            <th>IMPORTE</th>
            <th>ESTADO</th>
            <th class="text-right">DESCARGA</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="inv in invoices" :key="inv.id">
            <td class="font-bold text-navy">{{ inv.invoiceNumber }}</td>
            <td>{{ inv.issueDate }}</td>
            <td>{{ inv.concept }}</td>
            <td class="font-bold text-navy">{{ inv.formattedAmount }}</td>
            <td>
              <span class="status-pill status-pill--paid">{{ inv.statusLabel }}</span>
            </td>
            <td class="text-right">
              <button
                  type="button"
                  class="pdf-btn"
                  @click="handleDownloadInvoice(inv)"
              >
                PDF
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Dialog: Upgrade Quota -->
    <pv-dialog
        v-model:visible="showUpgradeDialog"
        modal
        header="Ampliar Cupo Institucional"
        :style="{ width: '480px' }"
    >
      <div class="dialog-body">
        <p class="text-secondary">
          Ampliar el cupo de pacientes permitirá al Centro de Rehabilitación Física Lima Sur monitorear hasta <strong>100 pacientes simultáneos</strong> con sensores IMU y prescripción activa.
        </p>
        <div class="pricing-summary-box">
          <div class="pricing-summary-row">
            <span>Nuevo Cupo:</span>
            <strong>100 Pacientes</strong>
          </div>
          <div class="pricing-summary-row">
            <span>Ajuste Prorrateado:</span>
            <strong>+$1,190.00 /año</strong>
          </div>
        </div>
      </div>
      <template #footer>
        <pv-button label="Cancelar" outlined @click="showUpgradeDialog = false" />
        <pv-button label="Confirmar Ampliación" icon="pi pi-check" @click="handleUpgradeQuota" />
      </template>
    </pv-dialog>

    <!-- Dialog: Change Card -->
    <pv-dialog
        v-model:visible="showCardDialog"
        modal
        header="Cambiar Tarjeta Corporativa"
        :style="{ width: '460px' }"
    >
      <div class="dialog-body flex flex-column gap-3">
        <div>
          <label class="font-bold block mb-1">Número de Tarjeta</label>
          <pv-inputtext
              v-model="newCardNumber"
              placeholder="•••• •••• •••• 4281"
              class="w-full"
          />
        </div>
        <div class="flex gap-2">
          <div class="flex-1">
            <label class="font-bold block mb-1">Vencimiento (MM/AA)</label>
            <pv-inputtext
                v-model="newCardExpiry"
                placeholder="08/29"
                class="w-full"
            />
          </div>
          <div class="flex-1">
            <label class="font-bold block mb-1">CVV</label>
            <pv-inputtext
                placeholder="•••"
                class="w-full"
                type="password"
                maxlength="4"
            />
          </div>
        </div>
      </div>
      <template #footer>
        <pv-button label="Cancelar" outlined @click="showCardDialog = false" />
        <pv-button label="Guardar Tarjeta" icon="pi pi-save" @click="handleSaveCard" />
      </template>
    </pv-dialog>
  </div>
</template>

<style scoped>
.clinic-subscription-page {
  padding: 1.5rem 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 1200px;
}

.page-header {
  margin-bottom: 0.25rem;
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

/* Card General */
.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.75rem 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

/* Top Plan Card */
.plan-card__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.75rem;
}

.badge-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.status-tag {
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}
.status-tag--active {
  background: #ecfdf5;
  color: #059669;
}

.plan-type-chip {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.plan-name {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.01em;
}

.plan-dates {
  margin: 0.35rem 0 0;
  font-size: 0.8125rem;
  color: #64748b;
}

.plan-pricing {
  text-align: right;
}
.price-main {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 0.2rem;
}
.price-value {
  font-size: 2.1rem;
  font-weight: 800;
  color: #0f172a;
}
.price-period {
  font-size: 0.95rem;
  font-weight: 600;
  color: #64748b;
}
.price-monthly {
  margin: 0.2rem 0 0;
  font-size: 0.78125rem;
  color: #64748b;
}

/* Quota Section */
.quota-section {
  margin-bottom: 1.75rem;
}
.quota-row-label {
  display: flex;
  justify-content: space-between;
  font-size: 0.8125rem;
  margin-bottom: 0.5rem;
}
.quota-title {
  color: #334155;
  font-weight: 600;
}
.quota-value {
  color: #0f172a;
}

.progress-track {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}
.progress-fill {
  height: 100%;
  background: #0f766e;
  border-radius: 999px;
  transition: width 0.3s ease;
}

.quota-subrow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.78125rem;
}
.quota-available {
  color: #64748b;
}
.upgrade-btn-link {
  background: none;
  border: none;
  color: #0f766e;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.78125rem;
  padding: 0;
}
.upgrade-btn-link:hover {
  text-decoration: underline;
}

/* Payment Box */
.payment-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.visa-badge {
  background: #0f172a;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 900;
  padding: 0.35rem 0.65rem;
  border-radius: 4px;
  letter-spacing: 0.05em;
}

.payment-text {
  flex: 1;
}
.card-title {
  margin: 0;
  font-size: 0.84375rem;
  font-weight: 700;
  color: #0f172a;
}
.card-meta {
  margin: 0.15rem 0 0;
  font-size: 0.75rem;
  color: #64748b;
}

.change-card-btn {
  background: none;
  border: none;
  color: #334155;
  font-size: 0.78125rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
}
.change-card-btn:hover {
  background: #e2e8f0;
}

/* Invoices Card */
.invoices-header {
  margin-bottom: 1.25rem;
}
.invoices-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
}
.invoices-subtitle {
  margin: 0.2rem 0 0;
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
  text-align: left;
  padding: 0.75rem 1rem;
  color: #64748b;
  font-weight: 700;
  font-size: 0.6875rem;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e2e8f0;
}
.invoices-table td {
  padding: 1rem 1rem;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;
}
.font-bold {
  font-weight: 700;
}
.text-navy {
  color: #0f172a;
}
.text-right {
  text-align: right;
}

.status-pill {
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
}
.status-pill--paid {
  background: #ecfdf5;
  color: #059669;
}

.pdf-btn {
  background: none;
  border: none;
  color: #0284c7;
  font-weight: 700;
  font-size: 0.8125rem;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
}
.pdf-btn:hover {
  text-decoration: underline;
}

.pricing-summary-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.84375rem;
}
.pricing-summary-row {
  display: flex;
  justify-content: space-between;
}
</style>
