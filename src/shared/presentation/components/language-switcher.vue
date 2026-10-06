<script setup>
import { useI18n } from "vue-i18n";

const { locale, availableLocales } = useI18n();
</script>

<template>
  <pv-select-button v-model="locale" :options="availableLocales" :allow-empty="false" size="small" aria-label="Language">
    <template #option="slotProps">
      <span class="locale-option">{{ slotProps.option.toUpperCase() }}</span>
    </template>
  </pv-select-button>
</template>

<style scoped>
.locale-option { font-size: 0.6875rem; font-weight: 700; letter-spacing: 0.04em; }
</style>
