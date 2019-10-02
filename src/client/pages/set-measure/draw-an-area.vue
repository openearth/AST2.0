<template>
  <div class="measure-list__list">
    <measure-card
      :measure="measure"
      :scores="[]"
      :interactive="false"
      class="measure-list__card"/>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex"
import { AppPanel, MeasureStepper, MeasureCard } from '~/components'

export default {
    components: { AppPanel, MeasureStepper, MeasureCard },

    computed: {
      ...mapGetters('data/measures', ['measureById']),
      ...mapState({ measureId: state => state.setMeasureFlow.id }),
      measure() {
        return this.measureById(this.measureId)
      },
    },
}
</script>
