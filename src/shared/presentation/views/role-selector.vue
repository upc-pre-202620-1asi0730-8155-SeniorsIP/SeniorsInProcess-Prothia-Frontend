<script setup>
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import useRoleStore from "../../../../../../../Desktop/SeniorsInProcess-Prothia-Frontendd/src/shared/application/role.store.js";
import LanguageSwitcher from "../components/language-switcher.vue";

const router = useRouter();
const { t } = useI18n();
const roleStore = useRoleStore();

function chooseRole(roleKey) {
  roleStore.setRole(roleKey);
  if (roleKey === 'technician') {
    router.push('/technician/dashboard');
  } else if (roleKey === 'therapist') {
    router.push('/home');
  } else if (roleKey === 'patient') {
    router.push('/patient/my-day');
  }
}
</script>

<template>
  <div class="role-portal">
    <!-- Navbar / Header -->
    <header class="role-portal__header">
      <div class="brand">
        <span class="brand__logo" aria-hidden="true" />
        <div>
          <span class="brand__name">PROTHIA</span>
          <span class="brand__tagline">{{ t('role-selection.system-tag') }}</span>
        </div>
      </div>
      <div class="header-actions">
        <language-switcher />
      </div>
    </header>

    <!-- Hero / Title -->
    <main class="role-portal__main">
      <div class="hero">
        <span class="hero__badge">{{ t('role-selection.badge') }}</span>
        <h1 class="hero__title">{{ t('role-selection.title') }}</h1>
        <p class="hero__subtitle">{{ t('role-selection.subtitle') }}</p>
      </div>

      <!-- 3 Roles Grid -->
      <div class="roles-grid">
        <!-- Rol 1: Paciente Amputado -->
        <article class="role-card role-card--patient" @click="chooseRole('patient')">
          <div class="role-card__top">
            <div class="role-icon role-icon--patient">
              <i class="pi pi-user" />
            </div>
            <span class="role-tag role-tag--patient">{{ t('role-selection.roles.patient.tag') }}</span>
          </div>

          <h2 class="role-card__title">{{ t('role-selection.roles.patient.title') }}</h2>
          <p class="role-card__institution">{{ t('role-selection.roles.patient.institution') }}</p>
          <p class="role-card__desc">{{ t('role-selection.roles.patient.desc') }}</p>

          <ul class="role-card__features">
            <li><i class="pi pi-check-circle" /> {{ t('role-selection.roles.patient.f1') }}</li>
            <li><i class="pi pi-check-circle" /> {{ t('role-selection.roles.patient.f2') }}</li>
            <li><i class="pi pi-check-circle" /> {{ t('role-selection.roles.patient.f3') }}</li>
          </ul>

          <div class="role-card__cta">
            <pv-button
              class="btn-role btn-role--patient"
              :label="t('role-selection.roles.patient.cta')"
              icon="pi pi-arrow-right"
              iconPos="right"
              fluid
            />
          </div>
        </article>

        <!-- Rol 2: Técnico Ortoprotésico (Highlighted) -->
        <article class="role-card role-card--technician role-card--highlighted" @click="chooseRole('technician')">
          <div class="role-card__top">
            <div class="role-icon role-icon--technician">
              <i class="pi pi-cog" />
            </div>
            <span class="role-tag role-tag--technician">{{ t('role-selection.roles.technician.tag') }}</span>
          </div>

          <h2 class="role-card__title">{{ t('role-selection.roles.technician.title') }}</h2>
          <p class="role-card__institution">{{ t('role-selection.roles.technician.institution') }}</p>
          <p class="role-card__desc">{{ t('role-selection.roles.technician.desc') }}</p>

          <ul class="role-card__features">
            <li><i class="pi pi-check-circle" /> {{ t('role-selection.roles.technician.f1') }}</li>
            <li><i class="pi pi-check-circle" /> {{ t('role-selection.roles.technician.f2') }}</li>
            <li><i class="pi pi-check-circle" /> {{ t('role-selection.roles.technician.f3') }}</li>
          </ul>

          <div class="role-card__cta">
            <pv-button
              class="btn-role btn-role--technician"
              :label="t('role-selection.roles.technician.cta')"
              icon="pi pi-arrow-right"
              iconPos="right"
              fluid
            />
          </div>
        </article>

        <!-- Rol 3: Terapeuta Asociado a Clínica -->
        <article class="role-card role-card--therapist" @click="chooseRole('therapist')">
          <div class="role-card__top">
            <div class="role-icon role-icon--therapist">
              <i class="pi pi-heart-fill" />
            </div>
            <span class="role-tag role-tag--therapist">{{ t('role-selection.roles.therapist.tag') }}</span>
          </div>

          <h2 class="role-card__title">{{ t('role-selection.roles.therapist.title') }}</h2>
          <p class="role-card__institution">{{ t('role-selection.roles.therapist.institution') }}</p>
          <p class="role-card__desc">{{ t('role-selection.roles.therapist.desc') }}</p>

          <ul class="role-card__features">
            <li><i class="pi pi-check-circle" /> {{ t('role-selection.roles.therapist.f1') }}</li>
            <li><i class="pi pi-check-circle" /> {{ t('role-selection.roles.therapist.f2') }}</li>
            <li><i class="pi pi-check-circle" /> {{ t('role-selection.roles.therapist.f3') }}</li>
          </ul>

          <div class="role-card__cta">
            <pv-button
              class="btn-role btn-role--therapist"
              :label="t('role-selection.roles.therapist.cta')"
              icon="pi pi-arrow-right"
              iconPos="right"
              fluid
            />
          </div>
        </article>
      </div>
    </main>

    <!-- Footer -->
    <footer class="role-portal__footer">
      <p>Prothia Healthcare IoT Platform • Seniors in Process © 2026</p>
      <p class="footer-meta">Arquitectura Domain-Driven Design (DDD) • Módulos de Clínica, Taller Ortopédico y Paciente</p>
    </footer>
  </div>
</template>

<style scoped>
.role-portal {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #f7f9fb 0%, #eef3f7 100%);
  color: var(--pt-ink);
}

.role-portal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 3rem;
  background: var(--pt-surface);
  border-bottom: 1px solid var(--pt-border);
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.brand__logo {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: var(--pt-teal);
}

.brand__name {
  display: block;
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--pt-navy-900);
  line-height: 1.2;
  letter-spacing: 0.02em;
}

.brand__tagline {
  display: block;
  font-size: 0.625rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--pt-teal-strong);
  text-transform: uppercase;
}

.role-portal__main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
}

.hero {
  text-align: center;
  max-width: 760px;
}

.hero__badge {
  display: inline-block;
  padding: 0.3rem 0.9rem;
  border-radius: 999px;
  background: #e6f4f5;
  color: var(--pt-teal-strong);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.hero__title {
  margin: 0;
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--pt-navy-900);
  line-height: 1.2;
}

.hero__subtitle {
  margin: 0.75rem 0 0;
  font-size: 1.05rem;
  color: var(--pt-muted);
  line-height: 1.5;
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.75rem;
  width: 100%;
}

.role-card {
  background: var(--pt-surface);
  border: 1px solid var(--pt-border);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  cursor: pointer;
  position: relative;
}

.role-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(10, 31, 51, 0.08);
  border-color: #cbd5e1;
}

.role-card--highlighted {
  border-color: var(--pt-teal);
  box-shadow: 0 8px 24px rgba(59, 153, 163, 0.12);
}

.role-card--highlighted:hover {
  border-color: var(--pt-teal-strong);
}

.role-card__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.role-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
}

.role-icon--patient {
  background: #eaf7f0;
  color: var(--pt-green);
}

.role-icon--technician {
  background: #e6f4f5;
  color: var(--pt-teal);
}

.role-icon--therapist {
  background: #e8f0fe;
  color: #1a73e8;
}

.role-tag {
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
}

.role-tag--patient { background: #eaf7f0; color: var(--pt-green); }
.role-tag--technician { background: #e6f4f5; color: var(--pt-teal-strong); }
.role-tag--therapist { background: #e8f0fe; color: #1a73e8; }

.role-card__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--pt-navy-900);
}

.role-card__institution {
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--pt-teal-strong);
}

.role-card__desc {
  margin: 0.85rem 0 1.25rem;
  font-size: 0.8125rem;
  color: #475569;
  line-height: 1.5;
  min-height: 58px;
}

.role-card__features {
  list-style: none;
  padding: 0;
  margin: 0 0 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  border-top: 1px solid var(--pt-border);
  padding-top: 1.1rem;
}

.role-card__features li {
  font-size: 0.78125rem;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.role-card__features .pi {
  color: var(--pt-teal-strong);
  font-size: 0.85rem;
  flex-shrink: 0;
}

.role-card__cta {
  margin-top: auto;
}

.btn-role {
  font-weight: 700;
  font-size: 0.8125rem;
  padding: 0.7rem 1rem;
  border-radius: 10px;
}

.btn-role--patient {
  --p-button-primary-background: var(--pt-green);
  --p-button-primary-border-color: var(--pt-green);
  --p-button-primary-hover-background: #257e59;
  --p-button-primary-hover-border-color: #257e59;
  --p-button-primary-color: #ffffff;
}

.btn-role--technician {
  --p-button-primary-background: var(--pt-teal);
  --p-button-primary-border-color: var(--pt-teal);
  --p-button-primary-hover-background: var(--pt-teal-strong);
  --p-button-primary-hover-border-color: var(--pt-teal-strong);
  --p-button-primary-color: #ffffff;
}

.btn-role--therapist {
  --p-button-primary-background: var(--pt-navy-700);
  --p-button-primary-border-color: var(--pt-navy-700);
  --p-button-primary-hover-background: var(--pt-navy-900);
  --p-button-primary-hover-border-color: var(--pt-navy-900);
  --p-button-primary-color: #ffffff;
}

.role-portal__footer {
  text-align: center;
  padding: 1.5rem;
  font-size: 0.75rem;
  color: var(--pt-muted);
  border-top: 1px solid var(--pt-border);
  background: var(--pt-surface);
}

.role-portal__footer p {
  margin: 0.2rem 0;
}

.footer-meta {
  font-size: 0.6875rem;
  color: #94a3b8;
}

@media (max-width: 960px) {
  .roles-grid {
    grid-template-columns: 1fr;
    max-width: 480px;
  }
  .role-portal__header {
    padding: 1rem 1.5rem;
  }
}
</style>
