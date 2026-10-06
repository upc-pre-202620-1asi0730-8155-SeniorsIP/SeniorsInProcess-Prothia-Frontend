<script setup>
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import useWorkshopStore from "../../application/workshop.store.js";
import SectionCard from "../../../shared/presentation/components/section-card.vue";
import FleetStatCards from "../components/fleet-stat-cards.vue";
import MechanicalAlertBanner from "../components/mechanical-alert-banner.vue";
import FleetActiveTable from "../components/fleet-active-table.vue";
import ProsthesisDetailDialog from "../components/prosthesis-detail-dialog.vue";

const { t } = useI18n();
const workshopStore = useWorkshopStore();

onMounted(() => {
  workshopStore.fetchFleet();
  workshopStore.fetchAlerts();
  workshopStore.fetchMaintenances();
});

// The top critical alert matching the screenshot
const primaryAlert = computed(() => {
  return workshopStore.mechanicalAlerts.find(a => a.severity === 'critical') || workshopStore.mechanicalAlerts[0];
});

// The active devices shown on the dashboard (first 2 matching screenshot)
const activeDevices = computed(() => {
  return workshopStore.prostheses.slice(0, 2);
});

function handleSchedule(alert) {
  workshopStore.openScheduleForAlert(alert);
}

function handleOpenDetail(prosthesis) {
  workshopStore.openProsthesisDetail(prosthesis);
}
</script>

<template>
  <div class="fleet-dashboard">
    <!-- Stat KPIs (4 cards) -->
    <fleet-stat-cards :stats="workshopStore.stats" />

    <!-- Mechanical Wear Alerts -->
    <section-card
        :title="t('technician.alerts.section-title')"
        :subtitle="t('technician.alerts.section-subtitle')"
    >
      <template #action>
        <router-link to="/technician/fatigue-alerts" class="section-link">
          {{ t('technician.alerts.view-all', { count: workshopStore.stats.fatigueAlertsCount }) }}
          <i class="pi pi-arrow-right" />
        </router-link>
      </template>

      <mechanical-alert-banner
          v-if="primaryAlert"
          :alert="primaryAlert"
          @schedule="handleSchedule"
      />
    </section-card>

    <!-- Active Fleet Table -->
    <section-card
        :title="t('technician.fleet.section-title')"
        :subtitle="t('technician.fleet.section-subtitle')"
        flush
    >
      <template #action>
        <router-link to="/technician/fleet" class="section-link">
          {{ t('technician.fleet.view-all', { count: workshopStore.stats.monitoredCount }) }}
          <i class="pi pi-arrow-right" />
        </router-link>
      </template>

      <fleet-active-table
          :prostheses="activeDevices"
          @open-detail="handleOpenDetail"
      />
    </section-card>

    <!-- Modals -->
    <prosthesis-detail-dialog
        v-model:visible="workshopStore.showDetailDialog"
        :prosthesis="workshopStore.activeProsthesisForDetail"
    />

  </div>
</template>

<style scoped>
.fleet-dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--pt-teal-strong);
  transition: color 0.15s ease;
}

.section-link:hover {
  text-decoration: underline;
  color: #115e59;
}

.section-link .pi {
  font-size: 0.75rem;
}
</style>
