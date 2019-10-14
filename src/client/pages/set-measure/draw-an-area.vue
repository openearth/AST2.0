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
import { mapGetters, mapState, mapMutations } from "vuex"
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
    mounted() {
      this.measure.canDrawPolygon
       ? this.polygonActive()
       : this.polygonInactive()

      this.measure.canDrawPolyline
       ? this.lineActive()
       : this.lineInactive()

      this.measure.canDrawPoint
       ? this.pointActive()
       : this.pointInactive()
    },
    destroyed() {
      this.polygonActive()
      this.lineActive()
      this.pointActive()
    },
    methods: {
      ...mapMutations({
        polygonActive: 'map/polygonActive',
        polygonInactive: 'map/polygonInactive',
        lineActive: 'map/lineActive',
        lineInactive: 'map/lineInactive',
        pointActive: 'map/pointActive',
        pointInactive: 'map/pointInactive',
      }),
    },
}
</script>
