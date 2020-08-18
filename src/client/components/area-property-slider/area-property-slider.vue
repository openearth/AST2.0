<template>
  <!-- @TODO :: We might filter out the 'no-show' properties in parent so we can remove v-if here -->
  <input-range
    v-if="getDefaultValueProperty('show')"
    :value="inputValue"
    :min="getDefaultValueProperty('min')"
    :max="getDefaultValueProperty('max')"
    :label="$t(`area_${ valueType }`)"
    @change="$emit('change', $event)"
  >
    <template v-slot:info>
      <app-tooltip
        :message="$t(`area_${ valueType }_info`)"
        class="area-property-slider__info"
        direction="left"
      />
    </template>
  </input-range>
</template>

<script>
import InputRange from '@/components/input-range'
import AppTooltip from '@/components/app-tooltip'

const capitalize = str => str.trim().replace(/^\w/, c => c.toUpperCase())

export default {
  components: {
    InputRange,
    AppTooltip,
  },
  props: {
    valueType: {
      type: String,
      required: true,
    },
    feature: {
      type: Object,
      required: true,
    },
    measure: {
      type: Object,
      required: true,
    },
  },
  computed: {
    inputValue() {
      const { properties } = this.feature
      const type = capitalize(this.valueType)
      return properties[`area${ type }`] || properties[`default${ type }`]
    },
  },
  methods: {
    getDefaultValueProperty(property) {
      const values = this.measure.defaultValues.find(values => values.key.toLowerCase() === this.valueType)
      const value = values ? values[property] : ''
      return property === 'show' ? value : String(value)
    },
  },
}
</script>

<style>
.area-property-slider__info {
  position: absolute;
  top: -9px;
  right: -40px;
}
</style>
