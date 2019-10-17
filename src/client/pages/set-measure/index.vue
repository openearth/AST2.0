<template>
  <measure-list
    :measures="workspaceMeasures"
    @choose="chooseMeasure"
  />
</template>

<script>
import { AppPanel, MeasureStepper, MeasureList } from '~/components'
import { mapGetters, mapActions } from "vuex"

export default {
    components: { AppPanel, MeasureStepper, MeasureList },
    computed: {
    ...mapGetters('data/measures', ['workspaceMeasures']),
    },
    methods: {
      ...mapActions({
        chooseMeasure: 'setMeasureFlow/chooseMeasure',
      }),
    },
}
</script>

<style>
</style>
