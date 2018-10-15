<template>
  <md-field>
    <md-select v-model="value" md-dense>
      <md-option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.value }}
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
      value: this.searchValue,
    }
  },
  watch: {
    value(val) {
      console.log(val)
      this.$emit('onSelect', val)
    },
  },
}
</script>

