<template>
  <measure-aside>
    <measure-stepper :current="1"/>
    <!-- <measure-card
      :measure="measure"
      :scores="[]"
      class="measure-list__card"
      @choose="choose"/> -->
  </measure-aside>
</template>

<script>
// import { mapGetters } from "vuex";
import { MeasureAside, MeasureStepper, MeasureCard } from '~/components'

export default {
    components: { MeasureAside, MeasureStepper, MeasureCard },

    // computed: {
    //   ...mapGetters('data/measures', ['measureById']),
    //   ...mapGetters('selectedMeasureId', 'selectedMeasureId/getSelectedMeasureId'),
    //   measure() {
    //     return this.measureById('8')
    //   },
    // },

    // methods: {
    //   choose() {
    //     console.log('choose')
    //   },
    // },
}
</script>
