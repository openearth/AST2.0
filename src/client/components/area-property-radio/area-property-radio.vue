<template>
  <fieldset>
    <legend class="area-property-radio__label">
      {{ $t(`area_${valueTypeLower}`) }}
      <app-tooltip
        :message="$t(`area_${ valueTypeLower }_info`)"
        class="area-property-radio__info"
        direction="left"
      />
    </legend>
    <md-radio
      v-for="option in options"
      :key="option"
      v-model="internalValue"
      :name="valueType"
      :value="option"
      @change="update(option)"
    >
      {{ $t(`area_${ valueTypeLower }_${option}`) }}
    </md-radio>
  </fieldset>
</template>

<script>
import AppTooltip from '@/components/app-tooltip'

export default {
  components: {
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
    options: {
      type: Array,
      required: true,
    },
  },
  data: () => ({
    internalValue: null,
  }),
  computed: {
    valueTypeLower() {
      return this.valueType.toLowerCase()
    },
  },
  watch: {
    value(newVal, oldVal) {
      if(newVal === oldVal) return
      this.updateInternal()
    },
  },
  created() {
    this.updateInternal()
  },
  methods: {
    updateInternal() {
      this.internalValue = this.value
    },
    update(value) {
      this.$emit('change', {
        key: this.valueType,
        value,
      })
    },
  },
}
</script>

<style>
.aoperty-radio:focus-within .area-property-radio__label {
  color: var(--md-theme-default-primary);
}

.area-property-radio__label {
  position: relative;
  display: block;
  font-size: var(--font-size-extra-small);
  color: rgba(0,0,0,0.54);
}
.area-property-radio__info {
  position: absolute;
  top: -9px;
  right: -40px;
}
</style>
