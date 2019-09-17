<template>
  <measure-aside wide>
    <measure-stepper ref="stepper" :current="0">
      <measure-list :measures="orderedMeasures" @choose="onChooseMeasure"/>
    </measure-stepper>
    <nuxt-child/>
  </measure-aside>
</template>

<script>
import { MeasureAside, MeasureStepper, MeasureList } from '~/components'
import { mapGetters, mapMutations } from "vuex"

export default {
    components: { MeasureAside, MeasureStepper, MeasureList },
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
    },
}
</script>

<style>
</style>
