<template>
  <app-panel>
    <measure-stepper
      :steps="steps"
      :current="activeStep.id"
      :wide="activeStep.isWide"/>
    <nuxt-child />
    <md-button
      slot="footer"
      class="md-raised">
      Cancel
    </md-button>
  </app-panel>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { AppPanel, MeasureStepper } from '~/components'

export default {
  components: { AppPanel, MeasureStepper },
  computed: {
    ...mapState({
      steps: store => store.setMeasureFlow.steps,
    }),
    ...mapGetters('setMeasureFlow', ['activeStep']),
  },
}
</script>
