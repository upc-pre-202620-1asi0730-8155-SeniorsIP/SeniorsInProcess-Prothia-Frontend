<script setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";
import SectionCard from "../../../shared/presentation/components/section-card.vue";
import StatCard from "../../../shared/presentation/components/stat-card.vue";

const toast = useToast();

const exercises = ref([
  { id: 1, name: 'Transferencia de Peso Lateral y Apoyo Unipodal', sets: '3 series', reps: '12 repeticiones', done: true },
  { id: 2, name: 'Elevación de Talón Asistida en Barra', sets: '3 series', reps: '10 repeticiones', done: false },
  { id: 3, name: 'Puente de Glúteos con Prótesis Apoyada', sets: '2 series', reps: '15 repeticiones', done: false }
]);

function toggleExercise(ex) {
  ex.done = !ex.done;
  if (ex.done) {
    toast.add({
      severity: 'success',
      summary: 'Ejercicio Registrado',
      detail: `Completaste: "${ex.name}". Adherencia actualizada.`,
      life: 3000
    });
  }
}
</script>

<template>
  <div class="patient-dashboard">
    <!-- Stat KPIs -->
    <div class="patient-stats">
      <stat-card
          label="Pasos Registrados Hoy"
          value="4,820"
          value-tone="teal"
          suffix="pasos"
          caption="Meta diaria: 5,000 pasos"
          caption-tone="green"
      />
      <stat-card
          label="Tiempo de Uso Diario"
          value="6.4"
          value-tone="navy"
          suffix="horas"
          caption="Uso continuo sin sobrecarga"
          caption-tone="green"
      />
      <stat-card
          label="Simetría de Apoyo"
          value="92%"
          value-tone="teal"
          suffix="óptima"
          caption="Balance simétrico de marcha"
          caption-tone="green"
      />
      <stat-card
          label="Telemetría Prótesis"
          value="94%"
          value-tone="green"
          suffix="Batería"
          caption="Sensor IMU Conectado"
          caption-tone="green"
      />
    </div>

    <!-- Active Device Card -->
    <section-card
        title="Mi Prótesis Vinculada"
        subtitle="Información de telemetría y trazabilidad técnica con tu taller ortopédico"
    >
      <div class="prosthesis-overview">
        <div class="prosthesis-badge">
          <i class="pi pi-check-circle" /> Prótesis Activa en Telemetría
        </div>
        <div class="overview-grid">
          <div>
            <span class="ov-label">N° de Serie</span>
            <strong class="ov-val">PR-2026-TT-084</strong>
          </div>
          <div>
            <span class="ov-label">Tipo de Prótesis</span>
            <strong class="ov-val">Transtibial Carbono Dinámica</strong>
          </div>
          <div>
            <span class="ov-label">Taller Responsable</span>
            <strong class="ov-val">Ortopedia Técnica Avanzada S.A.C.</strong>
          </div>
          <div>
            <span class="ov-label">Clínica de Rehabilitación</span>
            <strong class="ov-val">Centro de Rehabilitación Física Lima Sur</strong>
          </div>
        </div>
      </div>
    </section-card>

    <!-- Today's Exercise Plan -->
    <section-card
        title="Plan de Rehabilitación Domiciliaria Vigente (Fase 2)"
        subtitle="Prescrito por Lic. Diego Salazar • Registra tus ejercicios diarios"
    >
      <div class="exercises-list">
        <article
            v-for="ex in exercises"
            :key="ex.id"
            class="exercise-card"
            :class="{ 'exercise-card--done': ex.done }"
            @click="toggleExercise(ex)"
        >
          <div class="check-box" :class="{ 'check-box--checked': ex.done }">
            <i v-if="ex.done" class="pi pi-check" />
          </div>
          <div class="exercise-info">
            <h4 class="exercise-name">{{ ex.name }}</h4>
            <span class="exercise-params">{{ ex.sets }} • {{ ex.reps }}</span>
          </div>
          <span class="status-indicator">
            {{ ex.done ? 'Completado' : 'Pendiente' }}
          </span>
        </article>
      </div>
    </section-card>
  </div>
</template>

<style scoped>
.patient-dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.patient-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.25rem;
}

.prosthesis-overview {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.prosthesis-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.9rem;
  background: #eaf7f0;
  color: var(--pt-green);
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.8125rem;
  width: fit-content;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.25rem;
  padding: 1.25rem;
  background: #f8fafc;
  border: 1px solid var(--pt-border);
  border-radius: 12px;
}

.ov-label {
  display: block;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--pt-muted);
  margin-bottom: 0.25rem;
}

.ov-val {
  font-size: 0.9375rem;
  color: var(--pt-navy-900);
}

.exercises-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.exercise-card {
  display: flex;
  align-items: center;
  gap: 1.15rem;
  padding: 1rem 1.25rem;
  background: #ffffff;
  border: 1px solid var(--pt-border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.exercise-card:hover {
  border-color: var(--pt-teal);
  background: #fcfdfe;
}

.exercise-card--done {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.check-box {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 2px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.check-box--checked {
  background: var(--pt-green);
  border-color: var(--pt-green);
}

.exercise-info {
  flex: 1;
}

.exercise-name {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--pt-navy-900);
}

.exercise-params {
  font-size: 0.75rem;
  color: var(--pt-muted);
}

.status-indicator {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
}

.exercise-card--done .status-indicator {
  color: var(--pt-green);
}

@media (max-width: 991px) {
  .patient-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .overview-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 580px) {
  .patient-stats {
    grid-template-columns: minmax(0, 1fr);
  }
  .overview-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
