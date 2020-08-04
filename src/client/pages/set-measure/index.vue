<template>
  <measure-list
    :measures="workspaceMeasures"
    @choose="chooseMeasure"
  />
</template>

<script>
import { MeasureList } from '~/components'
import { mapGetters, mapActions } from "vuex"

export default {
    components: { MeasureList },
    computed: {
    ...mapGetters('data/measures', ['workspaceMeasures']),
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
