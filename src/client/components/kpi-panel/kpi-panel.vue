<template>
  <section class="kpi-panel">
    <h4>KPI Panel</h4>
  </section>
</template>

<script>
export default {
  props: {
    kpis: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style>
.kpi-panel {
  padding: 1rem;
}
</style>
