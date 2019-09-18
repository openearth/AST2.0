<template>
  <md-steppers
    ref="stepper"
    :md-active-step="stepId(current)"
    md-linear
    md-sync-route
    md-dynamic-height>
    <md-step
      v-for="(step, index) in steps"
      :to="step.to"
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
  },
  data() {
    return {
      steps: [
          {
              title: 'Select a measure',
              to: '/en/set-measure',
          },
          {
              title: 'Draw an area on the map to connect with the selected measure',
              to: '/en/set-measure/draw-an-area',
          },
          {
              title: 'Adjust measure settings',
              to: '/en/set-measure/adjust-measure-settings',
          },
          ],
    }
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

.stepper-title {
  margin-top: 10px;
  margin-bottom: 20px;
  color: var(--md-theme-default-primary);
}
</style>
