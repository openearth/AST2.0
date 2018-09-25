<template>
  <md-list class="kpi-group">
    <h2 class="kpi-group__title md-body-2">{{ kpiGroup.title }}</h2>

    <md-list-item
      v-for="kpi in kpiGroup.kpis"
      :key="kpi.key"
      class="kpi-group__kpi">
      <span class="md-body-1 kpi-group__kpi-title">{{ kpi.title }}:</span>

      <md-progress-bar
        v-if="type === 'bars'"
        :md-value="percentageKpiByKey(kpi.key)"
        class="kpi-group__kpi-meter"
      />

      <span v-else class="kpi-group__kpi-value">{{ roundValue(kpiByKey(kpi.key)) }} {{ unit(kpi.unit) }}</span>
    </md-list-item>
  </md-list>
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
    kpiPercentageValues: {
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
    valueTimes10(val) { return val * 10 },
    kpiByKey(key) { return this.kpiValues[key] },
    percentageKpiByKey(key) { return this.kpiPercentageValues[key] },
    unit(...args) {
      return this.$store.getters['data/units/displayValue'](...args)
    },
    roundValue(value) {
      if (value >= 100) {
        return Math.round(value)
      } else {
        return Math.round(value * 100) / 100
      }
    },
  },
}
</script>

<style>
.kpi-group {
  margin-bottom: var(--spacing-double);
}

.kpi-group__title {
  margin-bottom: var(--spacing-half);
}

.kpi-group__kpi .md-list-item-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  position: relative;
  margin-bottom: var(--spacing-half);
  padding: 0;
  min-height: 30px; /* overwrites material ui min-height */
}

.kpi-group__kpi-title {
  margin-bottom: var(--spacing-half);
  max-width: 90%;
}

.kpi-group__kpi-value {
  margin-bottom: var(--spacing-half);
}

.kpi-group__kpi-meter {
  position: absolute;
  bottom: 0;
  flex-basis: 100%;
  width: 100%;
}
</style>
