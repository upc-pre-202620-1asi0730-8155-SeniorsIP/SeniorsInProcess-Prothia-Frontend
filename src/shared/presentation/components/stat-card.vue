<script setup>
/**
 * KPI card: label, big value, optional suffix and caption.
 * Tones: navy | teal | red | green | muted
 */
defineProps({
  label:       { type: String, required: true },
  value:       { type: [String, Number], required: true },
  valueTone:   { type: String, default: 'navy' },
  suffix:      { type: String, default: '' },
  suffixTone:  { type: String, default: 'muted' },
  caption:     { type: String, default: '' },
  captionTone: { type: String, default: 'muted' }
});
</script>

<template>
  <article class="stat-card">
    <h3 class="stat-card__label">{{ label }}</h3>
    <p class="stat-card__row">
      <span class="stat-card__value" :class="`tone--${valueTone}`">{{ value }}</span>
      <span v-if="suffix" class="stat-card__suffix" :class="`tone--${suffixTone}`">{{ suffix }}</span>
    </p>
    <p v-if="caption" class="stat-card__caption" :class="`tone--${captionTone}`">{{ caption }}</p>
  </article>
</template>

<style scoped>
.stat-card {
  padding: 1.25rem 1.25rem 1.1rem;
  background: var(--pt-surface);
  border: 1px solid var(--pt-border);
  border-radius: 14px;
  box-shadow: 0 1px 3px rgba(10, 31, 51, 0.04);
}
.stat-card__label {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--pt-muted);
}
.stat-card__row {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  margin: 0.5rem 0 0.35rem;
}
.stat-card__value {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.1;
}
.stat-card__suffix { font-size: 0.8125rem; font-weight: 600; }
.stat-card__caption { margin: 0; font-size: 0.75rem; font-weight: 500; }

.tone--navy  { color: var(--pt-navy-600); }
.tone--teal  { color: var(--pt-teal-strong); }
.tone--red   { color: var(--pt-red); }
.tone--green { color: var(--pt-green); }
.tone--muted { color: var(--pt-muted); }
</style>
