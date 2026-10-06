<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import LanguageSwitcher from "../../../shared/presentation/components/language-switcher.vue";

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const patientNavItems = [
  { id: 1, labelKey: 'patient-portal.nav.my-day', to: '/patient/my-day', icon: null },
  { id: 2, labelKey: 'patient-portal.nav.live-telemetry', to: '/patient/live-telemetry', icon: 'dot' },
  { id: 3, labelKey: 'patient-portal.nav.gait-history', to: '/patient/gait-history', icon: null },
  { id: 4, labelKey: 'patient-portal.nav.exercises', to: '/patient/exercises', icon: null },
  { id: 5, labelKey: 'patient-portal.nav.messages', to: '/patient/messages', icon: null, badge: 1 }
];

const isLiveTelemetryRoute = computed(() => {
  return route.path.includes('/patient/live-telemetry');
});

function handleSignOut() {
  router.push('/');
}
</script>

<template>
  <pv-toast />
  <pv-confirm-dialog />

  <div class="patient-shell" :class="{ 'patient-shell--dark': isLiveTelemetryRoute }">
    <!-- Horizontal Top Navigation Bar (matching screenshots) -->
    <header class="patient-navbar">
      <!-- Brand & Role Tag -->
      <div class="navbar-left">
        <router-link to="/patient/my-day" class="brand-link">
          <span class="brand-logo">
            <img src="/prothia-logo.png" alt="" aria-hidden="true"/>
          </span>
          <span class="brand-title">PROTHIA</span>
        </router-link>
        <span class="role-pill">{{ t('patient-portal.role-pill') }}</span>
      </div>

      <!-- Center Navigation Links -->
      <nav class="navbar-center" aria-label="Navegación del Paciente">
        <router-link
            v-for="item in patientNavItems"
            :key="item.id"
            :to="item.to"
            custom
            v-slot="{ href, navigate, isActive }"
        >
          <a
              :href="href"
              class="nav-tab"
              :class="{ 'nav-tab--active': isActive }"
              @click="navigate"
          >
            <span v-if="item.icon === 'dot'" class="live-dot" />
            <span class="nav-tab__label">{{ t(item.labelKey) }}</span>
            <span v-if="item.badge" class="nav-tab__badge">{{ item.badge }}</span>
          </a>
        </router-link>
      </nav>

      <!-- Right: Sensor Status & User Profile -->
      <div class="navbar-right">
        <!-- Sensor Pill -->
        <div class="sensor-pill">
          <i class="pi pi-wifi" />
          <span>{{ t('patient-portal.sensors-connected', { bat: 84 }) }}</span>
        </div>

        <!-- Language Switcher -->
        <language-switcher />

        <!-- User Profile Pill -->
        <div class="user-profile">
          <span class="avatar-circle">CM</span>
          <div class="user-text">
            <span class="user-name">Carlos Mendoza</span>
            <span class="user-desc">{{ t('patient-portal.user-role') }}</span>
          </div>
        </div>

        <!-- Sign Out Button -->
        <button
            type="button"
            class="btn-signout"
            :title="t('patient-portal.signout-tooltip')"
            @click="handleSignOut"
        >
          <i class="pi pi-sign-out" />
        </button>
      </div>
    </header>

    <!-- Main Content View Area -->
    <main class="patient-content" :class="{ 'patient-content--dark': isLiveTelemetryRoute }">
      <router-view />
    </main>

    <!-- Footer -->
    <footer v-if="!isLiveTelemetryRoute" class="patient-footer">
      <p>Prothia © 2026 • Plataforma de Telemetría Biomecánica y Rehabilitación • SeniorsInProcess UPC</p>
    </footer>
  </div>
</template>

<style scoped>
.patient-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f7f9fb;
  color: var(--pt-ink);
}

.patient-shell--dark {
  background: #041322;
  color: #ffffff;
}

/* Navbar */
.patient-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 64px;
  background: #071c2f;
  color: #ffffff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: sticky;
  top: 0;
  z-index: 50;
  gap: 1.5rem;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  color: #ffffff;
}

.brand-logo {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: #0f766e;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.brand-logo img {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  background: #ffffff;
  object-fit: contain;
}

.brand-title {
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #ffffff;
}

.role-pill {
  background: rgba(15, 118, 110, 0.25);
  color: #34d399;
  font-size: 0.6875rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  border: 1px solid rgba(52, 211, 153, 0.35);
  white-space: nowrap;
}

/* Center Tabs */
.navbar-center {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  overflow-x: auto;
}

.nav-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.nav-tab:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
}

.nav-tab--active {
  background: #0f766e !important;
  color: #ffffff !important;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(15, 118, 110, 0.35);
}

.live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 8px #34d399;
}

.nav-tab__badge {
  background: #0d9488;
  color: #ffffff;
  font-size: 0.6875rem;
  font-weight: 800;
  border-radius: 999px;
  min-width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

/* Right Area */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.sensor-pill {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: rgba(15, 118, 110, 0.2);
  border: 1px solid rgba(20, 184, 166, 0.35);
  color: #5eead4;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  white-space: nowrap;
}

.sensor-pill .pi {
  font-size: 0.75rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.avatar-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #0d9488;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
}

.user-text {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.1;
}

.user-desc {
  font-size: 0.65625rem;
  color: #94a3b8;
}

.btn-signout {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease, background 0.15s ease;
}

.btn-signout:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
}

/* Content Area */
.patient-content {
  flex: 1;
  padding: 2rem 2.5rem 3rem;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
}

.patient-content--dark {
  max-width: 100%;
  padding: 1.5rem 2rem 2rem;
}

/* Footer */
.patient-footer {
  text-align: center;
  padding: 1.5rem;
  font-size: 0.75rem;
  color: #94a3b8;
  border-top: 1px solid #e2e8f0;
  background: #ffffff;
}

.patient-footer p {
  margin: 0;
}

@media (max-width: 1100px) {
  .user-text {
    display: none;
  }
}

@media (max-width: 860px) {
  .sensor-pill {
    display: none;
  }
  .patient-navbar {
    padding: 0 1rem;
  }
  .patient-content {
    padding: 1.25rem 1rem 2rem;
  }
}
</style>
