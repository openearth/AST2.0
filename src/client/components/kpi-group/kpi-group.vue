<template>
  <ul class="kpi-group">
    <h2 class="kpi-group__title">{{ kpiGroup.title }}</h2>
    
    <li
      v-for="kpi in kpiGroup.kpis"
      :key="kpi.key"
      class="kpi-group__kpi">
      <span class="kpi-group__kpi-title">{{ kpi.title }}:</span>

      <md-progress-bar
        v-if="type === 'bars'"
        :md-value="kpiTimes10(kpiByKey(kpi.key))"
        class="kpi-group__kpi-meter"
      />

      <span v-else class="kpi-group__kpi-value">{{ kpiByKey(kpi.key) }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    kpiGroup: {
      type: Object,
      required: true,
    },
    kpiValues: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
      default: 'bars',
    },
  },
  methods: {
    kpiTimes10(val) { return val * 10 },
    kpiByKey(key) { return this.kpiValues[key] },
  },
}
</script>

<style>
.kpi-group {
  margin-bottom: var(--spacing-double);
}

.kpi-group__title {
  margin-bottom: var(--spacing-default);
  font-size: var(--font-size-default);
}

.kpi-group__kpi {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: var(--spacing-half);
}

.kpi-group__kpi-title {
  margin-bottom: var(--spacing-half);
  font-size: 14px;
  max-width: 90%;
}

.kpi-group__kpi-meter {
  flex-basis: 100%;
  width: 100%;
}
</style>
