<template>
  <input-range
    v-model="internalValue"
    :min="min"
    :max="max"
    :label="$t(`area_${ valueTypeLower }`)"
    :multi="multi"
    @change="updateExternal"
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

const arrayEquals = (a, b) =>
  Array.isArray(a) &&
  Array.isArray(b) &&
  a.length === b.length &&
  a.every((val, i) => val === b[i])

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
    values: {
      type: Array,
      required: true,
      validator: arr => arr.every(val => typeof val === 'string'),
    },
    min: {
      type: String,
      required: true,
    },
    max: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    internalValue: null,
    updateHappendThroughSelectionChange: false,
    multi: false,
  }),
  computed: {
    valueTypeLower() {
      return this.valueType.toLowerCase()
    },
  },
  watch: {
    values(newArr, oldArr) {
      if(newArr.length !== oldArr.length) {
        this.updateHappendThroughSelectionChange = true
      }
      if(arrayEquals(newArr, oldArr)) return
      this.updateInternal()
    },
  },
  created() {
    this.updateInternal()
  },
  methods: {
    updateInternal() {
      // If all values are the same, we can safely edit them as one value
      if(this.values.every((val, i, arr) => val === arr[0])) {
        this.internalValue = this.values[0]
      }
      // Otherwise, we set the value in the center of the slider and display a 'multi' sign
      else {
        this.multi = true
        this.internalValue = ''
      }
    },
    updateExternal(value) {
      if(this.updateHappendThroughSelectionChange) {
        this.updateHappendThroughSelectionChange = false
        return
      }
      this.multi = false
      this.$emit('change', {
        key: this.valueType,
        value,
      })
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
