<template>
  <app-panel :wide="currentStep === 0">
    <measure-stepper
      :steps="steps"
      :current="activeStep.id"
      :wide="activeStep.isWide"
      @to-step="toStep"/>
    <nuxt-child/>
    <md-button
      slot="footer"
      class="md-raised"
      @click="resetFlow">
      Cancel
    </md-button>
  </app-panel>
</template>

<script>
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'
import { AppPanel, MeasureStepper } from '~/components'

export default {
  components: { AppPanel, MeasureStepper },
  middleware: ['access-level-settings'],
  computed: {
    ...mapState({
      steps: store => store.setMeasureFlow.steps,
      currentStep: store => store.setMeasureFlow.currentStep,
    }),
    ...mapGetters('setMeasureFlow', ['activeStep']),
  },
  mounted() {
    this.startFlow()
  },
  destroyed() {

    // Do not reset the flow when the user navigates to measure detail
    if (!/project-measures-slug/.test(this.$route.name)) {
      this.resetFlow({ relocate: false })
    }
  },
  methods: {
    ...mapActions({
      startFlow: 'setMeasureFlow/startFlow',
      resetFlow: 'setMeasureFlow/resetFlow',
      toStep: 'setMeasureFlow/toStep',
    }),
  },
}
</script>
