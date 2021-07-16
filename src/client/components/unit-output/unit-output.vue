<template>
  <span>
    <span v-if="value !== null">{{ computedValue }} </span>
    <template v-if="hideUnit === false">
      <template v-if="unit === 'surface'">
        <template v-if="unitSystem === 'metric'">m<sup>2</sup></template>
        <template v-else>ft<sup>2</sup></template>
      </template>
      <template v-else-if="unit === 'volume'">
        <template v-if="unitSystem === 'metric'">m<sup>3</sup></template>
        <template v-else>ft<sup>3</sup></template>
      </template>
      <template v-else-if="unit === 'Ratemmy'">
        <template v-if="unitSystem === 'metric'">mm/{{ $t('year') }}</template>
        <template v-else>in/{{ $t('year') }}</template>
      </template>
      <template v-else-if="unit === 'currency_per_year'">{{ activeWorkspace.currencySymbol }}/{{ $t('year') }}</template>
      <template v-else-if="unit === 'currency'">{{ activeWorkspace.currencySymbol }}</template>
      <template v-else-if="unit === 'years'">{{ $t('years') }}</template>
      <template v-else-if="unit === 'number'">&#8203;</template>
      <template v-else-if="unit">{{ unitMap[unit][unitSystem] }}</template>
    </template>
  </span>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import convertToImperial from './convert-to-imperial'

export default {
  props: {
    value: {
      type: [String, Number],
      default: null,
    },
    unit: {
      type: String,
      default: null,
    },
    decimals: {
      type: Number,
      default: 2,
    },
    hideUnit: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState({
      units: state => state.data.units,
    }),
    ...mapGetters('data/workspaces', ['activeWorkspace']),
    ...mapGetters('data/units', ['displayValue']),
    unitMap() {
      return this.units.reduce((collection, _unit) => {
        const { title, key, ...unit } = _unit
        return {
          ...collection,
          ...{ [key]: unit },
          }
      }, {})
    },
    unitSystem() {
      return this.activeWorkspace.unitSystem
    },
    outputMetric() {
      return this.unitSystem === 'metric'
    },
    outputImperial() {
      return this.unitSystem === 'imperial'
    },
    imperialUnit() {
      switch(this.metricUnit) {
        case 'mm':
          return 'inch'
        case 'm':
          return 'ft'
        case 'm2':
          return 'ft2'
        case 'm3':
          return 'ft3'
        case 'c':
          return 'f'
        default:
          return this.metricUnit
      }
    },
    computedValue() {
      const converted =  this.unitSystem === 'imperial'
        ? convertToImperial(Number(this.value), this.unit)
        : Number(this.value)

      const places = Math.pow(10, this.decimals)
      const rounded = Math.round(converted * places) / places

      const { thousandSeparator, decimalSeparator } = this.activeWorkspace

      if (isNaN(rounded)) {
        return ''
      }

      return rounded.toString().replace('.', decimalSeparator).replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${thousandSeparator}`) // 1000 -> 1.000
    },
  },
}
</script>
