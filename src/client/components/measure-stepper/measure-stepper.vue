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
      <p>{{ step.label }}</p>
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
              label: 'Select a measure',
              to: '/en/set-measure',
          },
          {
              label: 'draw an area',
              to: '/en/set-measure/draw-an-area',
          },
          {
              label: 'Adjust measure settings',
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
</style>
