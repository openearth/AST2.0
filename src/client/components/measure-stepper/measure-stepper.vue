<template>
  <md-steppers
    ref="stepper"
    md-linear
    md-sync-route
    md-dynamic-height
    md-alternative
    class="measure-stepper">
    <md-step
      v-for="(step, index) in steps"
      :id="stepId(index)"
      :key="index"
      :md-done="isDone(index)"
      :md-label="$t(step.label)"
      exact
      @click="$emit('to-step', step)">
      <slot/>
    </md-step>
  </md-steppers>
</template>

<script>
export default {
  props: {
    current: {
      type: Number,
      required: true,
      default: 0,
    },
    steps: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    isDone(index) {
      return index < this.current
    },
    stepId(index) {
      return `measure--${index}`
    },
  },
}
</script>

<style>
/* overwriting default styles for .md-steppers-navigation */
.md-steppers-navigation {
  box-shadow: none;
  border-bottom: 1px solid var(--border-color);
}

/* extending default styles for .md-stepper-header */
.md-stepper-header {
  padding-top: 2px;
}

/* extending default styles for .md-stepper */
.md-stepper {
  padding: 0;
}

.md-steppers-navigation {
  background-color: var(--background-color);
}

.stepper-title {
  margin-top: 20px;
  margin-bottom: 20px;
  padding-right: var(--spacing-default);
  padding-left: var(--spacing-default);
  color: var(--md-theme-default-primary);
}
</style>
