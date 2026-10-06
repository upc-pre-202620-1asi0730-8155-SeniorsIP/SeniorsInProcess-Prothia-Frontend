<script setup>
import { computed, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import useOptionStore from "../../application/option.store.js";
import useMonitoringStore from "../../../monitoring/application/monitoring.store.js";

const emit = defineEmits(['navigate']);
const { t } = useI18n();
const store = useOptionStore();
const monitoringStore = useMonitoringStore();

onMounted(() => {
  if (!store.optionsLoaded) store.fetchOptions();
  if (!monitoringStore.alertsLoaded) monitoringStore.fetchAlerts();
});

const menuOptions = computed(() => {
  return store.options.map(option => {
    if (option.to === '/alerts') {
      return {
        ...option,
        badge: monitoringStore.pendingCount
      };
    }
    return option;
  });
});
</script>

<template>
  <nav class="option-menu" :aria-label="t('shell.main-navigation')">
    <router-link v-for="option in menuOptions" :key="option.id" :to="option.to" custom
                 v-slot="{ href, navigate, isActive, isExactActive }">
      <a :href="href" class="option"
         :class="{ 'option--active': option.exact ? isExactActive : isActive }"
         :aria-current="(option.exact ? isExactActive : isActive) ? 'page' : undefined"
         @click="e => { navigate(e); emit('navigate'); }">
        <i :class="['pi', option.icon]" aria-hidden="true"/>
        <span class="option__label">{{ t(option.label) }}</span>
        <span v-if="option.badge" class="option__badge">{{ option.badge }}</span>
      </a>
    </router-link>
  </nav>
</template>

<style scoped>
.option-menu { display: flex; flex-direction: column; gap: 0.25rem; }
.option {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.7rem 0.85rem;
  border-radius: 10px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #c9d4df;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.option .pi { font-size: 0.95rem; width: 1.1rem; text-align: center; }
.option:hover { background: rgba(255, 255, 255, 0.06); color: #ffffff; }
.option--active { background: var(--pt-navy-700); color: #ffffff; }
.option__label { flex: 1; }
.option__badge {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: var(--pt-red);
  color: #ffffff;
  font-size: 0.6875rem;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
}
</style>
