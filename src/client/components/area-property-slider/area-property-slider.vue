<template>
  <input-range
    :value="value"
    :min="min"
    :max="max"
    :label="$t(`area_${ valueTypeLower }`)"
    @change="$emit('change', $event)"
  >
    <template v-slot:info>
      <app-tooltip
        :message="$t(`area_${ valueTypeLower }_info`)"
        class="area-property-slider__info"
        direction="left"
      />
    </template>
  </input-range>
</template>

<script>
import InputRange from '@/components/input-range'
import AppTooltip from '@/components/app-tooltip'

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
    value: {
      type: String,
      required: true,
    },
    min: {
      type: String,
      default: '0.1',
    },
    max: {
      type: String,
      default: '10',
    },
  },
  computed: {
    valueTypeLower() {
      return this.valueType.toLowerCase()
    },
  },
  methods: {

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
