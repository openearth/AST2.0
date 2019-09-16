<template>
  <measure-aside>
    <measure-stepper :current="0"/>
    <nuxt-child/>
  </measure-aside>
</template>

<script>
import { MeasureAside, MeasureStepper } from '~/components'

export default {
    components: { MeasureAside, MeasureStepper },
}
</script>

<style>
</style>
