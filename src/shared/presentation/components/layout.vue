<script setup>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import SidebarNavigation from "./sidebar-navigation.vue";
import AppTopbar from "./app-topbar.vue";
import LanguageSwitcher from "./language-switcher.vue";
// To import when IAM is implemented:
// import AuthenticationSection from "../../../iam/presentation/components/authentication-section.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const menuOpen = ref(false);
watch(() => route.fullPath, () => { menuOpen.value = false; });

const user = computed(() => ({
  name: 'Lic. Diego Salazar',
  role: route.path.includes('subscription') ? 'Administrador de Cuenta' : 'Fisioterapeuta Clínico'
}));
const clinic = { name: 'Centro de Rehabilitación Física Lima Sur', plan: 'Anual Activa', active: 24, total: 50 };

/**
 * Each route can declare its header in `meta`:
 *  - headerTitle / headerSubtitle: i18n keys (subtitle receives {count}).
 *  - headerAction: { label (i18n key), to } renders the primary button.
 *  - signOut: shows the sign-out button.
 * Without headerTitle the header shows the clinic and its subscription summary.
 */
const header = computed(() => {
  const meta = route.meta;
  if (meta.headerTitle) {
    return {
      title: t(meta.headerTitle),
      subtitle: meta.headerSubtitle ? t(meta.headerSubtitle, { count: clinic.active }) : ''
    };
  }
  return {
    title: clinic.name,
    subtitle: t('shell.subscription-summary', { plan: clinic.plan, active: clinic.active, total: clinic.total })
  };
});
const action = computed(() => route.meta.headerAction ?? null);
const showSignOut = computed(() => route.meta.signOut === true);
</script>

<template>
  <pv-toast/>
  <pv-confirm-dialog/>
  <div class="shell">
    <div class="shell__sidebar" :class="{ 'shell__sidebar--open': menuOpen }">
      <sidebar-navigation :user="user" @navigate="menuOpen = false"/>
    </div>
    <div v-if="menuOpen" class="shell__overlay" @click="menuOpen = false"/>

    <div class="shell__content">
      <app-topbar v-if="!route.meta.hideTopbar" :title="header.title" :subtitle="header.subtitle"
                  @toggle-menu="menuOpen = !menuOpen">
        <template #actions>
          <language-switcher/>
          <!-- To add when IAM is implemented -->
          <!--<authentication-section/>-->
          <pv-button v-if="action" class="cta" icon="pi pi-plus" :label="t(action.label)" @click="router.push(action.to)"/>
          <pv-button v-if="showSignOut" class="signout" text :label="t('shell.sign-out')" @click="router.push('/')"/>
        </template>
      </app-topbar>
      <main class="shell__main">
        <router-view/>
      </main>
    </div>
  </div>
</template>

<style scoped>
.shell {
  display: grid;
  grid-template-columns: 267px minmax(0, 1fr);
  min-height: 100vh;
  background: var(--pt-page);
}
.shell__sidebar { position: sticky; top: 0; height: 100vh; z-index: 30; }
.shell__content { display: flex; flex-direction: column; min-width: 0; }
.shell__main { flex: 1; padding: 2.5rem 2.5rem 3rem; }
.shell__overlay { position: fixed; inset: 0; background: rgba(10, 31, 51, 0.5); z-index: 20; }

.cta {
  --p-button-primary-background: var(--pt-teal);
  --p-button-primary-border-color: var(--pt-teal);
  --p-button-primary-hover-background: var(--pt-teal-strong);
  --p-button-primary-hover-border-color: var(--pt-teal-strong);
  --p-button-primary-active-background: var(--pt-teal-strong);
  --p-button-primary-active-border-color: var(--pt-teal-strong);
  --p-button-primary-color: #ffffff;
  --p-button-primary-hover-color: #ffffff;
  font-size: 0.8125rem;
  font-weight: 700;
}
.signout {
  --p-button-text-primary-color: var(--pt-muted);
  --p-button-text-primary-hover-background: transparent;
  font-size: 0.8125rem;
}

@media (max-width: 991px) {
  .shell { grid-template-columns: minmax(0, 1fr); }
  .shell__sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    width: 267px;
    transform: translateX(-100%);
    transition: transform 0.2s ease;
  }
  .shell__sidebar--open { transform: translateX(0); }
  .shell__main { padding: 1.25rem 1rem 2rem; }
}
@media (max-width: 640px) {
  .cta :deep(.p-button-label), .signout { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .shell__sidebar { transition: none; }
}
</style>
