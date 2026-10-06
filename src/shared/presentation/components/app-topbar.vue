<script setup>
import { useI18n } from "vue-i18n";

/**
 * Top bar of the content area: institution title + subtitle on the left,
 * actions (slot "actions") on the right. Shows a menu button on small screens.
 */
defineProps({
  title:    { type: String, required: true },
  subtitle: { type: String, default: '' }
});
const emit = defineEmits(['toggle-menu']);
const { t } = useI18n();
</script>

<template>
  <header class="topbar">
    <div class="topbar__left">
      <pv-button class="topbar__menu" icon="pi pi-bars" text rounded
                 :aria-label="t('shell.open-menu')" @click="emit('toggle-menu')"/>
      <div>
        <h1 class="topbar__title">{{ title }}</h1>
        <p v-if="subtitle" class="topbar__subtitle">{{ subtitle }}</p>
      </div>
    </div>
    <div class="topbar__actions"><slot name="actions"/></div>
  </header>
</template>

<style scoped>
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
.topbar__left { display: flex; align-items: center; gap: 0.5rem; min-width: 0; }
.topbar__title { margin: 0; font-size: 1.0625rem; font-weight: 700; color: var(--pt-navy-600); }
.topbar__subtitle { margin: 0; font-size: 0.75rem; color: var(--pt-muted); }
.topbar__actions { display: flex; align-items: center; gap: 1rem; flex-shrink: 0; }
.topbar__menu { display: none; }

@media (max-width: 991px) {
  .topbar { padding: 0.75rem 1rem; }
  .topbar__menu { display: inline-flex; }
}
@media (max-width: 640px) {
  .topbar__subtitle { display: none; }
}
</style>
