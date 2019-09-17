<template>
  <measure-aside>
    <measure-stepper :current="0">
      <measure-list :measures="orderedMeasures"/>
    </measure-stepper>
    <nuxt-child/>
  </measure-aside>
</template>

<script>
import { MeasureAside, MeasureStepper, MeasureList } from '~/components'
import { mapGetters } from "vuex"

export default {
    components: { MeasureAside, MeasureStepper, MeasureList },
    computed: {
    ...mapGetters('data/measures', ['orderedMeasures']),
    },
}
</script>

<style>
</style>
