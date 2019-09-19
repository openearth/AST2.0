<template>
  <app-panel wide>
    <measure-stepper ref="stepper" :current="0">
      <measure-list :measures="orderedMeasures" @choose="onChooseMeasure"/>
    </measure-stepper>
    <md-button
      slot="footer"
      class="md-raised"
      @click="cancel">
      Cancel
    </md-button>
  </app-panel>
</template>

<script>
import { AppPanel, MeasureStepper, MeasureList } from '~/components'
import { mapGetters, mapMutations } from "vuex"

export default {
    components: { AppPanel, MeasureStepper, MeasureList },
    computed: {
    ...mapGetters('data/measures', ['orderedMeasures']),
    },
    methods: {
      ...mapMutations({
        setSelectedMeasureId: 'selectedMeasureId/setSelectedMeasureId',
      }),
      onChooseMeasure(value) {
        this.$refs.stepper.nextStep()
        this.setSelectedMeasureId(value)
        console.log('value', value);
      },
      cancel() {
        console.log('clicked cancel')
      },
    },
}
</script>

<style>
</style>
