<template>
  <md-list class="kpi-group">
    <h2 class="kpi-group__title md-body-2">
      {{ kpiGroup.title }}
    </h2>

    <md-list-item
      v-for="kpi in kpiGroup.kpis"
      :key="kpi.key"
      class="kpi-group__kpi"
    >
      <span class="md-body-1 kpi-group__kpi-title">
        {{ kpi.title }} (<unit-output :unit="kpi.unit" /><template v-if="kpi.unit === 'number'">{{ $t('number') }}</template>)
      </span>
      <p v-if="type === 'numbers'" class="md-body-1 kpi-group__kpi-value">
        <unit-output
          :value="kpiByKey(kpi.key)"
          :unit="kpi.unit"
          hide-unit
        />
      </p>

      <md-progress-bar
        v-if="type === 'bars'"
        :md-value="percentageKpiByKey(kpi.key)"
        class="kpi-group__kpi-meter"
      />

      <div v-if="(type === 'numbers') && selectedAreas" class="kpi-group__measure-kpi">
        <span><em>{{ $t('measure') }}</em></span>
        <span><em><unit-output :value="getKpiValueForArea(kpi.key)" :unit="kpi.unit" /></em></span>
      </div>
    </md-list-item>
  </md-list>
</template>

<script>
import calculateFmeasArea from '../../lib/calculate-fmeas-area'
import UnitOutput from '~/components/unit-output'

const displayDecimal = number => {
  return `${Math.round(number * 100)}`.replace(/(.+)(.{2})$/, '$1.$2')
}

export default {
  components: { UnitOutput },
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
    kpiByKey(key) {
      return key === 'Fmeas_area'
        ? displayDecimal(this.kpiValues[key])
        : this.roundValue(this.kpiValues[key])
    },
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
    inferKpiTitleWithUnit(title, unit) {
      const formattedUnit = ` (${ this.unit(unit) })`
      return `${ title }${ this.type === 'numbers' ? formattedUnit : '' }:`
    },
    getKpiValueForArea(key) {
      return key === 'Fmeas_area'
        ? displayDecimal(calculateFmeasArea(
            this.$store.state.project.settings.area.properties.area,
            this.$store.state.project.settings.pluvfloodParam.A_p,
            this.$store.state.project.settings.pluvfloodParam.Frac_RA,
            this.selectedAreas.properties.apiData[key],
          ))
        : this.roundValue(this.selectedAreas.properties.apiData[key])
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
</style>
