<script setup>
import { onMounted } from "vue";
import useWorkshopStore from "../../application/workshop.store.js";

const store = useWorkshopStore();

onMounted(() => {
  store.fetchAlerts();
});

function handleSchedule(alertItem) {
  store.openScheduleForAlert(alertItem);
}

function handleScheduleAmortiguador() {
  const alert2 = store.mechanicalAlerts[1] || {
    id: 2,
    serialNumber: 'PR-2026-TF-012',
    patientName: 'Roberto Sánchez P.',
    component: 'Amortiguador de talón',
    description: 'Ajuste de amortiguación por impacto de talón > 1,150 N'
  };
  store.openScheduleForAlert(alert2);
}
</script>

<template>
  <div class="fatigue-alerts-page">
    <div class="alerts-container">
      <!-- Alert Card 1: Critical Wear (Red) -->
      <article class="fatigue-card fatigue-card--critical">
        <header class="fatigue-card__header">
          <div class="header-left">
            <span class="alert-icon alert-icon--red" aria-hidden="true">
              <i class="pi pi-exclamation-triangle" />
            </span>
            <h2 class="alert-title">
              <strong>PR-2025-TF-004</strong>
              <span class="patient-name">• Hugo Paredes (Transfemoral)</span>
            </h2>
          </div>
          <span class="alert-tag alert-tag--critical">
            Umbral de Ciclos Superado (101%)
          </span>
        </header>

        <div class="fatigue-card__body">
          <p class="cause-text">
            <strong>Causa de la alerta:</strong> La rodilla hidráulica monocéntrica ha registrado <strong>814,200 ciclos de flexo-extensión</strong>. El umbral máximo de seguridad clínica antes de riesgo de fuga hidráulica es de <strong>800,000 ciclos</strong>.
          </p>
          <p class="meta-text">
            Clínica tratante: Centro de Rehabilitación Lima Sur • Último mantenimiento hace 11 meses.
          </p>
        </div>

        <footer class="fatigue-card__footer">
          <button
              type="button"
              class="btn-alert-action btn-alert-action--red"
              @click="handleSchedule(store.mechanicalAlerts[0] || {})"
          >
            <i class="pi pi-calendar" />
            Programar Cita de Recambio Inmediata
          </button>
        </footer>
      </article>

      <!-- Alert Card 2: Elevated Force (Amber) -->
      <article class="fatigue-card fatigue-card--warning">
        <header class="fatigue-card__header">
          <div class="header-left">
            <span class="alert-icon alert-icon--amber" aria-hidden="true">
              <i class="pi pi-exclamation-circle" />
            </span>
            <h2 class="alert-title">
              <strong>PR-2026-TF-012</strong>
              <span class="patient-name">• Roberto Sánchez P. (Transfemoral)</span>
            </h2>
          </div>
          <span class="alert-tag alert-tag--warning">
            Pico de Fuerza Elevado (1,150 N)
          </span>
        </header>

        <div class="fatigue-card__body">
          <p class="cause-text">
            <strong>Causa de la alerta:</strong> Se detectaron 8 impactos consecutivos de talón con fuerza mayor a 1,150 Newtons durante la marcha. Se sospecha contacto violento por falta de amortiguación o ajuste incorrecto en la extensión terminal.
          </p>
        </div>

        <footer class="fatigue-card__footer">
          <button
              type="button"
              class="btn-alert-action btn-alert-action--teal"
              @click="handleScheduleAmortiguador"
          >
            Agendar Ajuste de Amortiguador
          </button>
        </footer>
      </article>
    </div>
  </div>
</template>

<style scoped>
.fatigue-alerts-page {
  max-width: 1240px;
  margin: 0 auto;
}

.alerts-container {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.fatigue-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 1.75rem 2rem;
  box-shadow: 0 1px 3px rgba(10, 31, 51, 0.04);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.fatigue-card--critical {
  border: 1.5px solid #fecaca;
}

.fatigue-card--warning {
  border: 1.5px solid #fde68a;
}

.fatigue-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.alert-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  color: #ffffff;
  flex-shrink: 0;
}

.alert-icon--red {
  background: #dc2626;
}

.alert-icon--amber {
  background: #f59e0b;
}

.alert-title {
  margin: 0;
  font-size: 0.9375rem;
  color: var(--pt-navy-900);
}

.alert-title strong {
  font-family: monospace;
  font-size: 1rem;
}

.alert-title .patient-name {
  font-weight: 500;
  color: #475569;
}

.alert-tag {
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.3rem 0.8rem;
  border-radius: 999px;
  white-space: nowrap;
}

.alert-tag--critical {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fca5a5;
}

.alert-tag--warning {
  background: #fef3c7;
  color: #b45309;
  border: 1px solid #fde047;
}

.fatigue-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.cause-text {
  margin: 0;
  font-size: 0.84375rem;
  color: #334155;
  line-height: 1.55;
}

.cause-text strong {
  color: var(--pt-navy-900);
}

.meta-text {
  margin: 0;
  font-size: 0.75rem;
  color: #64748b;
}

.fatigue-card__footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 0.75rem;
  border-top: 1px solid #f1f5f9;
}

.btn-alert-action {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 0.65rem 1.35rem;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.1s ease;
}

.btn-alert-action:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-alert-action--red {
  background: #dc2626;
  color: #ffffff;
}

.btn-alert-action--teal {
  background: #0f766e;
  color: #ffffff;
}
</style>
