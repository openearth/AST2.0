<template>
  <measure-list
    :measures="orderedMeasures"
    @choose="chooseMeasure"
  />
</template>

<script>
import { AppPanel, MeasureStepper, MeasureList } from '~/components'
import { mapGetters, mapActions } from "vuex"

export default {
    components: { AppPanel, MeasureStepper, MeasureList },
    computed: {
    ...mapGetters('data/measures', ['orderedMeasures']),
    },
    methods: {
      ...mapActions({
        chooseMeasure: 'setMeasureFlow/chooseMeasure',
      }),
      cancel() {
        console.log('clicked cancel')
      },
    },
}
</script>

<style>
</style>
