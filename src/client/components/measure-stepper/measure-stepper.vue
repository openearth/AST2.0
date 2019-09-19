<template>
  <md-steppers
    ref="stepper"
    md-linear
    md-sync-route
    md-dynamic-height
    class="measure-stepper">
    <md-step
      v-for="(step, index) in steps"
      :to="step.slug"
      :id="stepId(index)"
      :key="index"
      :md-done="isDone(index)"
      exact>
      <h3 class="stepper-title md-headline">{{ step.title }}</h3>
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
    nextStep() {
      const buttons = this.$el.querySelectorAll('.md-stepper-header.md-button');
      if(this.current + 1 <= buttons.length) {
        buttons.item(this.current + 1).click()
      }
    },
  },
}
</script>

<style>
/* overwriting default styles for .md-steppers-navigation */
.md-steppers-navigation {
  box-shadow: var(--shadow-small-grey);
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
