<template>
  <md-field>
    <label :for="`select-${id}`">{{ $t('choose_scenario') }}</label>
    <md-select
      :id="`select-${id}`"
      v-model="selectedValue"
      md-dense
      :disabled="disabled"
    >
      <md-option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.title }}
      </md-option>
    </md-select>
  </md-field>
</template>

<style>
</style>

<script>
export default {
  props: {
    value: {
      type: String,
      default: null,
    },
    options: {
      type: Array,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedValue: this.value,
    }
  },
  watch: {
    selectedValue(val) {
      this.$emit('change', val)
    },
    value(val) {
      this.selectedValue = val
    },
  },
}
</script>
