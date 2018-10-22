<template>
  <md-field>
    <md-select v-model="selectedValue" md-dense>
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
      required: true,
    },
    options: {
      type: Array,
      required: true,
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
  },
}
</script>

