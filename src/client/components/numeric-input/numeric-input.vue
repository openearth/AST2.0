<template>
  <md-field>
    <label>{{ label }}</label>
    <md-input
      v-model="input"
      :placeholder="label"
      @focus="onFocus"
    />
  </md-field>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      input: '',
    }
  },
  methods: {
    onFocus({ target }) {
      this.$emit('focused', target)
    },
  },
}
</script>
