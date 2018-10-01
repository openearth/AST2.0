<template>
  <md-drawer md-permanent="clipped">
    <nuxt-child />
  </md-drawer>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex"
import { MeasureCard, SearchInput } from '~/components'
import MapEventBus, { REDRAW } from "../lib/map-event-bus";

export default {
  components: { MeasureCard, SearchInput },
  data() {
    return {
      isAreasListVisible: false,
      isAreaVisible: true,
    }
  },
  computed: {
    ...mapState('data', ['measures']),
    ...mapState('project', ['areas']),
    ...mapGetters('selectedAreas', { selectedFeatures: 'features' }),
    ...mapGetters('project', ['areasByMeasure', 'measureCollection']),
  },
  mounted() {
    MapEventBus.$emit(REDRAW)
  },
  methods: {
    ...mapActions({ updateAreaProperties: 'project/updateAreaProperties' }),
  },
}
</script>

<style>
.legend__item {
  border-left-width: 8px;
  border-left-style: solid;
  transition: border-left-color .3s ease-in-out;
}

.legend__item-header {
  display: flex;
  justify-content: space-between;
}
</style>
