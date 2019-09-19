<template>
  <app-panel>
    <measure-stepper :current="1"/>
    <div class="measure-list__list">
      <measure-card
        :measure="measure"
        :scores="[]"
        class="measure-list__card"
        @choose="choose"/>
    </div>
    <md-button
      slot="footer"
      class="md-raised"
      @click="cancel">
      Cancel
    </md-button>
  </app-panel>
</template>

<script>
import { mapGetters } from "vuex"
import { AppPanel, MeasureStepper, MeasureCard } from '~/components'

export default {
    components: { AppPanel, MeasureStepper, MeasureCard },

    computed: {
      ...mapGetters('data/measures', ['measureById']),
      ...mapGetters('selectedMeasureId', ['getSelectedMeasureId']),
      measureId() {
        return this.getSelectedMeasureId
      },
      measure() {
        return this.measureById(this.measureId)
      },
    },

    methods: {
      choose() {
        console.log('choose')
      },
      cancel() {
        console.log('clicked cancel')
      },
    },
}
</script>
