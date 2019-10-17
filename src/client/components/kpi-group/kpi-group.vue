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
      <p v-if="type === 'numbers'" class="kpi-group__kpi-value">
        {{ roundValue(kpiByKey(kpi.key)) }} {{ unit(kpi.unit) }}
      </p>

      <bar-graph
        v-if="type === 'bars'"
        :amount="percentageKpiByKey(kpi.key)"
        :fragment="selectedAreas ? getFragmentValue(selectedAreas, kpi.key) : 0"
        class="kpi-group__area-impact"
      />

      <div v-if="(type === 'numbers') && selectedAreas" class="kpi-group__measure-kpi">
        <span><em>{{ $t('measure') }}</em></span>
        <span><em>{{ roundValue(selectedAreas.properties.apiData[kpi.key]) }} {{ unit(kpi.unit) }}</em></span>
      </div>
    </md-list-item>
  </md-list>
</template>

<script>
import { mapGetters } from "vuex";
import { BarGraph } from '~/components'

export default {
  components: { BarGraph },
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
  computed: {
    ...mapGetters('project', ['kpiTargetValues']),
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
    getFragmentValue(selectedAreas, key) {
      const value = this.roundValue(selectedAreas.properties.apiData[key]) / this.kpiTargetValues[key];
      return value === Infinity ? 1 : value
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
  /* position: absolute;
  bottom: 0; */
  flex-basis: 100%;
  width: 100%;
}

.kpi-group__measure-kpi {
  position: relative;
  flex-basis: 100%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-extra-small);
  color: var(--neutral-color--dark);
  margin-bottom: var(--spacing-half);
}

.kpi-group__area-impact {
  /* position: absolute;
  bottom: 0;
  left: 0;
  transform: translateY(100%); */
}
</style>
