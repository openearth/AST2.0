<template>
  <md-list class="kpi-group">
    <h2 class="kpi-group__title md-body-2">{{ kpiGroup.title }}</h2>

    <md-list-item
      v-for="kpi in kpiGroup.kpis"
      :key="kpi.key"
      class="kpi-group__kpi">
      <span class="md-body-1 kpi-group__kpi-title">
        {{ kpi.title }}:
      </span>
      <p v-if="type === 'numbers'" class="md-body-1 kpi-group__kpi-value">
        {{ roundValue(kpiByKey(kpi.key)) }} {{ unit(kpi.unit) }}
      </p>

      <md-progress-bar
        v-if="type === 'bars'"
        :md-value="percentageKpiByKey(kpi.key)"
        class="kpi-group__kpi-meter"
      />

      <div v-if="(type === 'numbers') && selectedAreas" class="kpi-group__measure-kpi">
        <span><em>{{ $t('measure') }}</em></span>
        <span><em>{{ roundValue(selectedAreas.properties.apiData[kpi.key]) }} {{ unit(kpi.unit) }}</em></span>
      </div>
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
    selectedAreas: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  methods: {
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
  position: relative;
  margin-bottom: var(--spacing-half);
  padding: 0;
  min-height: 30px; /* overwrites material ui min-height */

  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.kpi-group__kpi-title {
  width: 100%;
  white-space: normal;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  hyphens: auto;
}

@media screen and (min-width: 1200px) {
  .kpi-group__kpi-title {
    margin-bottom: var(--spacing-half);
    max-width: 90%;
  }
}

.kpi-group__kpi-value {
  margin-bottom: calc( var(--spacing-half) * 0.5 );
}

@media screen and (min-width: 1200px) {
  .kpi-group__kpi-value {
    margin-bottom: var(--spacing-half);
  }
}

.kpi-group__kpi-meter {
  flex-basis: 100%;
  width: 100%;
}

.kpi-group__measure-kpi {
  position: relative;
  flex-basis: 100%;
  width: 100%;
  font-size: var(--font-size-extra-small);
  color: var(--neutral-color--dark);
  margin-bottom: var(--spacing-half);
}

@media screen and (min-width: 1200px) {
  .kpi-group__measure-kpi {
    display: flex;
    justify-content: space-between;
  }
}

.kpi-group__measure-kpi span {
  display: block;
}
</style>
