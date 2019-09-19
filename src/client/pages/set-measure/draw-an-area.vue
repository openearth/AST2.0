<template>
  <div class="measure-list__list">
    <measure-card
      :measure="measure"
      :scores="[]"
      class="measure-list__card"
      @choose="choose"/>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex"
import { AppPanel, MeasureStepper, MeasureCard } from '~/components'

export default {
    components: { AppPanel, MeasureStepper, MeasureCard },

    computed: {
      ...mapState({
        measureId: state => state.setMeasureFlow.id,
      }),
      ...mapGetters('data/measures', ['measureById']),
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
