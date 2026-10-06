<script setup>
/**
 * Small pill used for clinical states and alert categories.
 * tone: success | warning | danger | neutral
 */
defineProps({
  tone: { type: String, default: 'neutral', validator: v => ['success', 'warning', 'danger', 'neutral'].includes(v) }
});
</script>

<template>
  <span class="badge" :class="`badge--${tone}`"><slot/></span>
</template>

<style scoped>
.badge {
  display: inline-block;
  padding: 1px 8px;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 600;
  line-height: 1.5;
  white-space: nowrap;
}
.badge--success { background: var(--pt-green-bg); border-color: #bfe6d3; color: var(--pt-green); }
.badge--warning { background: var(--pt-amber-bg); border-color: #f4dc9a; color: #9a6a00; }
.badge--danger  { background: var(--pt-red-bg);   border-color: #f3c4cb; color: var(--pt-red); }
.badge--neutral { background: #f1f4f7;            border-color: var(--pt-border); color: var(--pt-muted); }
</style>
