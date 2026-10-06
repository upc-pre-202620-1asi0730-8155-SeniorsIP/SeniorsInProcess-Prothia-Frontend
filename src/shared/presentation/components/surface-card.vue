<script setup>
/**
 * Plain white rounded container used by the pages of every bounded context.
 */
defineProps({
  padding: { type: String, default: '1.5rem' }
});
</script>

<template>
  <section class="surface-card" :style="{ padding }"><slot/></section>
</template>

<style scoped>
.surface-card {
  background: var(--pt-surface);
  border: 1px solid var(--pt-border);
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(10, 31, 51, 0.04);
  overflow: hidden;
}
</style>
