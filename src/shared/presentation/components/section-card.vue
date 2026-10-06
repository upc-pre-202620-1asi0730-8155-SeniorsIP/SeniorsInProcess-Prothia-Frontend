<script setup>
/**
 * White container with a title, subtitle and an optional header action (slot "action").
 */
defineProps({
  title:    { type: String, required: true },
  subtitle: { type: String, default: '' },
  flush:    { type: Boolean, default: false }
});
</script>

<template>
  <section class="section-card">
    <header class="section-card__header">
      <div>
        <h2 class="section-card__title">{{ title }}</h2>
        <p v-if="subtitle" class="section-card__subtitle">{{ subtitle }}</p>
      </div>
      <div class="section-card__action"><slot name="action"/></div>
    </header>
    <div class="section-card__body" :class="{ 'section-card__body--flush': flush }">
      <slot/>
    </div>
  </section>
</template>

<style scoped>
.section-card {
  background: var(--pt-surface);
  border: 1px solid var(--pt-border);
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(10, 31, 51, 0.04);
  overflow: hidden;
}
.section-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 2rem 2rem 1rem;
}
.section-card__title {
  margin: 0;
  font-size: 1.1875rem;
  font-weight: 700;
  color: var(--pt-navy-600);
}
.section-card__subtitle {
  margin: 0.15rem 0 0;
  font-size: 0.8125rem;
  color: var(--pt-muted);
}
.section-card__action { padding-top: 0.25rem; font-size: 0.8125rem; font-weight: 600; color: var(--pt-teal-strong); }
.section-card__body { padding: 0.5rem 2rem 2rem; }
.section-card__body--flush { padding: 0.5rem 0 0; }

@media (max-width: 640px) {
  .section-card__header { padding: 1.25rem 1rem 0.75rem; flex-direction: column; }
  .section-card__body { padding: 0.5rem 1rem 1.25rem; }
}
</style>
