<template>
  <md-field>
    <md-select v-model="value" md-dense>
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
    selectedValue: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      value: this.selectedValue,
    }
  },
  watch: {
    value(val) {
      this.$emit('onSelect', val)
    },
  },
}
</script>

