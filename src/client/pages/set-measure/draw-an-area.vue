<template>
  <measure-aside>
    <measure-stepper :current="1"/>
    <div class="measure-list__list">
      <measure-card
        :measure="measure"
        :scores="[]"
        class="measure-list__card"
        @choose="choose"/>
    </div>
  </measure-aside>
</template>

<script>
import { mapGetters } from "vuex"
import { MeasureAside, MeasureStepper, MeasureCard } from '~/components'

export default {
    components: { MeasureAside, MeasureStepper, MeasureCard },

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

    // mounted() {
    //   console.log('measureById', this.measureById)
    //   console.log('getSelectedMeasureId', this.getSelectedMeasureId);
    // },

    methods: {
      choose() {
        console.log('choose')
      },
    },
}
</script>
