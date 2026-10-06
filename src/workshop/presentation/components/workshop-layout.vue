<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import useWorkshopStore from "../../application/workshop.store.js";
import LanguageSwitcher from "../../../shared/presentation/components/language-switcher.vue";
import AvatarInitials from "../../../shared/presentation/components/avatar-initials.vue";
import RegisterProsthesisDialog from "./register-prosthesis-dialog.vue";
import ScheduleMaintenanceDialog from "./schedule-maintenance-dialog.vue";
import ProsthesisDetailDialog from "./prosthesis-detail-dialog.vue";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const workshopStore = useWorkshopStore();

const menuOpen = ref(false);

const technicianMenu = computed(() => [
  { id: 1, label: 'technician.menu.fleet-dashboard', to: '/technician/dashboard', icon: 'pi-th-large', exact: true, badge: 0 },
  { id: 2, label: 'technician.menu.fleet', to: '/technician/fleet', icon: 'pi-box', exact: false, badge: 0 },
  { id: 3, label: 'technician.menu.maintenance', to: '/technician/maintenance', icon: 'pi-calendar', exact: false, badge: workshopStore.stats.scheduledThisWeek, badgeTone: 'teal' },
  { id: 4, label: 'technician.menu.fatigue-alerts', to: '/technician/fatigue-alerts', icon: 'pi-exclamation-triangle', exact: false, badge: workshopStore.stats.fatigueAlertsCount, badgeTone: 'red' },
  { id: 5, label: 'technician.menu.clinics', to: '/technician/clinics', icon: 'pi-building', exact: false, badge: 0 },
  { id: 6, label: 'technician.menu.license', to: '/technician/license', icon: 'pi-shield', exact: false, badge: 0 }
]);

const headerTitle = computed(() => {
  if (route.meta.headerTitleKey) return t(route.meta.headerTitleKey);
  return route.meta.headerTitle || 'Ortopedia Técnica Avanzada S.A.C.';
});
const headerSubtitle = computed(() => {
  if (route.meta.headerSubtitleKey) return t(route.meta.headerSubtitleKey);
  return route.meta.headerSubtitle || 'Licencia de Taller Activa • 42 prótesis en telemetría de vida útil';
});
const headerAction = computed(() => {
  if (!route.meta.headerAction) return null;
  return {
    ...route.meta.headerAction,
    label: route.meta.headerAction.actionKey ? t(route.meta.headerAction.actionKey) : route.meta.headerAction.label
  };
});

function handleActionClick() {
  if (headerAction.value?.actionType === 'schedule-maintenance') {
    workshopStore.openScheduleForAlert(workshopStore.mechanicalAlerts[0] || null);
  } else {
    workshopStore.showRegisterProsthesisDialog = true;
  }
}

function handleSignOut() {
  router.push('/');
}
</script>

<template>
  <pv-toast />
  <pv-confirm-dialog />

  <div class="shell">
    <!-- Technician Dark Sidebar: ALWAYS intact with full menu & user profile -->
    <div class="shell__sidebar" :class="{ 'shell__sidebar--open': menuOpen }">
      <aside class="sidebar">
        <!-- Brand -->
        <div class="sidebar__brand">
          <img class="sidebar__logo" src="/prothia-logo.png" alt="" aria-hidden="true" />
          <div>
            <p class="sidebar__name">PROTHIA</p>
            <p class="sidebar__tagline">{{ t('technician.brand-tagline') }}</p>
          </div>
        </div>

        <!-- Navigation Menu with all 6 options, icons and badges -->
        <nav class="sidebar__nav" :aria-label="t('shell.main-navigation')">
          <div class="option-menu">
            <router-link
                v-for="opt in technicianMenu"
                :key="opt.id"
                :to="opt.to"
                custom
                v-slot="{ href, navigate, isActive, isExactActive }"
            >
              <a
                  :href="href"
                  class="option"
                  :class="{ 'option--active': opt.exact ? isExactActive : isActive }"
                  :aria-current="(opt.exact ? isExactActive : isActive) ? 'page' : undefined"
                  @click="e => { navigate(e); menuOpen = false; }"
              >
                <i :class="['pi', opt.icon]" aria-hidden="true" />
                <span class="option__label">{{ t(opt.label) }}</span>
                <span
                    v-if="opt.badge"
                    class="option__badge"
                    :class="`option__badge--${opt.badgeTone || 'red'}`"
                >
                  {{ opt.badge }}
                </span>
              </a>
            </router-link>
          </div>
        </nav>

        <!-- User Footer (Ing. Roberto Valdivia with avatar circle) -->
        <footer class="sidebar__user">
          <avatar-initials name="Ing. Roberto Valdivia" tone="navy" :size="38" />
          <div class="sidebar__user-text">
            <p class="sidebar__user-name">Ing. Roberto Valdivia</p>
            <p class="sidebar__user-role">{{ t('technician.user-role') }}</p>
          </div>
        </footer>
      </aside>
    </div>

    <div v-if="menuOpen" class="shell__overlay" @click="menuOpen = false" />

    <!-- Main Content Area -->
    <div class="shell__content">
      <!-- Technician Topbar -->
      <header class="topbar">
        <div class="topbar__left">
          <pv-button
              class="topbar__menu"
              icon="pi pi-bars"
              text
              rounded
              :aria-label="t('shell.open-menu')"
              @click="menuOpen = !menuOpen"
          />
          <div>
            <h1 class="topbar__title">{{ headerTitle }}</h1>
            <p class="topbar__subtitle">{{ headerSubtitle }}</p>
          </div>
        </div>

        <div class="topbar__actions">
          <language-switcher />
          <pv-button
              v-if="headerAction"
              class="cta"
              icon="pi pi-plus"
              :label="headerAction.label"
              @click="handleActionClick"
          />
          <pv-button
              class="signout"
              text
              :label="t('shell.sign-out')"
              @click="handleSignOut"
          />
        </div>
      </header>

      <main class="shell__main">
        <router-view />
      </main>
    </div>
  </div>

  <!-- Global Workshop Dialogs -->
  <register-prosthesis-dialog v-model:visible="workshopStore.showRegisterProsthesisDialog" />
  <schedule-maintenance-dialog
      v-model:visible="workshopStore.showScheduleDialog"
      :alert="workshopStore.activeAlertForSchedule"
  />
  <prosthesis-detail-dialog
      v-model:visible="workshopStore.showDetailDialog"
      :prosthesis="workshopStore.activeProsthesisForDetail"
  />
</template>

<style scoped>
.shell {
  display: grid;
  grid-template-columns: 267px minmax(0, 1fr);
  min-height: 100vh;
  background: var(--pt-page);
}

.shell__sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 30;
}

.shell__content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.shell__main {
  flex: 1;
  padding: 2.5rem 2.5rem 3rem;
}

.shell__overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 31, 51, 0.5);
  z-index: 20;
}

/* Sidebar Styles matching screenshot */
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--pt-navy-900);
  color: #ffffff;
}

.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem 1.5rem 1.4rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.sidebar__logo {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #ffffff;
  object-fit: contain;
}

.sidebar__name {
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  line-height: 1.2;
}

.sidebar__tagline {
  margin: 0.1rem 0 0;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #4fc3c0;
}

.sidebar__nav {
  padding: 1.1rem 1rem;
  flex: 1;
  overflow-y: auto;
}

.option-menu {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.option {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 0.95rem;
  border-radius: 12px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #c9d4df;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.option .pi {
  font-size: 0.95rem;
  width: 1.1rem;
  text-align: center;
}

.option:hover {
  background: rgba(255, 255, 255, 0.07);
  color: #ffffff;
}

.option--active {
  background: #14505c;
  color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}

.option--active .pi {
  color: #ffffff;
}

.option__label {
  flex: 1;
}

.option__badge {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  color: #ffffff;
  font-size: 0.6875rem;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
}

.option__badge--teal {
  background: #0d766e;
}

.option__badge--red {
  background: #d9344a;
}

.sidebar__user {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.1rem 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.sidebar__user-text {
  min-width: 0;
}

.sidebar__user-name {
  margin: 0;
  font-size: 0.8125rem;
  font-weight: 700;
}

.sidebar__user-role {
  margin: 0;
  font-size: 0.6875rem;
  color: #8ea1b4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Topbar Styles */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 70px;
  padding: 0.75rem 2.5rem;
  background: var(--pt-surface);
  border-bottom: 1px solid var(--pt-border);
}

.topbar__left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.topbar__title {
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--pt-navy-900);
}

.topbar__subtitle {
  margin: 0.15rem 0 0;
  font-size: 0.75rem;
  color: var(--pt-muted);
}

.topbar__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.topbar__menu {
  display: none;
}

.cta {
  --p-button-primary-background: #0f766e;
  --p-button-primary-border-color: #0f766e;
  --p-button-primary-hover-background: #115e59;
  --p-button-primary-hover-border-color: #115e59;
  --p-button-primary-active-background: #134e4a;
  --p-button-primary-active-border-color: #134e4a;
  --p-button-primary-color: #ffffff;
  --p-button-primary-hover-color: #ffffff;
  font-size: 0.8125rem;
  font-weight: 700;
  border-radius: 8px;
}

.signout {
  --p-button-text-primary-color: var(--pt-muted);
  --p-button-text-primary-hover-background: transparent;
  font-size: 0.8125rem;
}

@media (max-width: 991px) {
  .shell {
    grid-template-columns: minmax(0, 1fr);
  }
  .shell__sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    width: 267px;
    transform: translateX(-100%);
    transition: transform 0.2s ease;
  }
  .shell__sidebar--open {
    transform: translateX(0);
  }
  .shell__main {
    padding: 1.25rem 1rem 2rem;
  }
  .topbar {
    padding: 0.75rem 1rem;
  }
  .topbar__menu {
    display: inline-flex;
  }
}

@media (max-width: 640px) {
  .topbar__subtitle {
    display: none;
  }
  .cta :deep(.p-button-label), .signout {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .shell__sidebar {
    transition: none;
  }
}
</style>
