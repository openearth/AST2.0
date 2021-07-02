<template>
  <span>
    <span>{{ computedValue }} </span>
    <template v-if="outputMetric">
      <template v-if="metricUnit === 'mm'">mm</template>
      <template v-if="metricUnit === 'm'">m</template>
      <template v-if="metricUnit === 'm2'">m<sup>2</sup></template>
      <template v-if="metricUnit === 'm3'">m<sup>3</sup></template>
      <template v-if="metricUnit === 'c'">°C</template>
    </template>
    <template v-if="outputImperial">
      <template v-if="imperialUnit === 'inch'">inch</template>
      <template v-if="imperialUnit === 'ft'">ft</template>
      <template v-if="imperialUnit === 'ft2'">ft<sup>2</sup></template>
      <template v-if="imperialUnit === 'ft3'">ft<sup>3</sup></template>
      <template v-if="imperialUnit === 'f'">°F</template>
    </template>
  </span>
</template>

<script>
import convertValue from './convert-value'
export default {
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
    metricUnit: {
      type: String,
      required: true,
      validator: value => {
        switch (value) {
          case 'mm':
          case 'm':
          case 'm3':
          case 'm2':
          case 'c':
            return true;
          default:
            return false;
        }
      },
    },
    targetSystem: {
      type: String,
      default: 'metric',
      validator: value => /metric|imperial/.test(value),
    },
    decimals: {
      type: Number,
      default: 2,
    },
  },
  computed: {
    outputMetric() {
      return this.targetSystem === 'metric'
    },
    outputImperial() {
      return this.targetSystem === 'imperial'
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
      const converted =  this.targetSystem === 'imperial'
        ? convertValue(this.value, this.metricUnit)
        : this.value

      const places = Math.pow(10, this.decimals)
      const rounded = Math.round(converted * places) / places

      const thousandSeparator = '.'
      const decimalSeparator = ','

      return rounded.toString().replace('.', decimalSeparator).replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${thousandSeparator}`) // 1000 -> 1.000
    },
  },
}
</script>
