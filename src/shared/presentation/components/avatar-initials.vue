<script setup>
import { computed } from "vue";

/**
 * Circular avatar that renders the initials of a person's name.
 */
const props = defineProps({
  name: { type: String, required: true },
  tone: { type: String, default: 'mint', validator: v => ['mint', 'blue', 'slate', 'teal', 'navy'].includes(v) },
  size: { type: Number, default: 32 }
});

const initials = computed(() =>
    props.name
        .replace(/^(Lic|Dr|Dra|Mg|Ing)\.?\s+/i, '')
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(word => word[0].toUpperCase())
        .join('')
);
</script>

<template>
  <span class="avatar" :class="`avatar--${tone}`" :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${Math.round(size * 0.34)}px` }" aria-hidden="true">
    {{ initials }}
  </span>
</template>

<style scoped>
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.avatar--mint  { background: #d3f4ea; color: #1f6f58; }
.avatar--blue  { background: #dce8fb; color: #2a4f9a; }
.avatar--slate { background: #eef1f5; color: #3b4a5a; }
.avatar--teal  { background: #3b99a3; color: #ffffff; }
.avatar--navy  { background: #163a5f; color: #ffffff; }
</style>
