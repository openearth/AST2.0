<template>
  <measure-aside>
    <measure-stepper :current="1"/>
  </measure-aside>
</template>

<script>
import { MeasureAside, MeasureStepper } from '~/components'

export default {
    components: { MeasureAside, MeasureStepper },
}
</script>