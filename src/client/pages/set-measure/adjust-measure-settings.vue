<template>
  <app-panel>
    <measure-stepper :current="2"/>
    <md-button
      slot="footer"
      class="md-raised"
      @click="cancel">
      Cancel
    </md-button>
  </app-panel>
</template>

<script>
import { AppPanel, MeasureStepper } from '~/components'

export default {
    components: { AppPanel, MeasureStepper },

    methods: {
      cancel() {
        console.log('cancel', cancel);
      },
    },
}
</script>
