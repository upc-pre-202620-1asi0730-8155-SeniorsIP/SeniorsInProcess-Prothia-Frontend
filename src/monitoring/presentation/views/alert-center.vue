<script setup>
import AlertHistory from "../components/alert-history.vue";
import ThresholdCalibration from "../components/threshold-calibration.vue";
</script>

<template>
  <div class="center">
    <alert-history/>
    <threshold-calibration/>
  </div>
</template>

<style scoped>
.center { display: flex; flex-direction: column; gap: 2rem; max-width: 1180px; margin: 0 auto; }
</style>
