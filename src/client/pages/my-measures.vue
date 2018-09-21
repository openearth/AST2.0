<template>
  <md-drawer md-permanent="clipped">
    <md-list>
      <div
        v-for="({measure, areas}, index) in measureCollection"
        :key="index"
        :style="`border-left: 5px solid ${measure.color.hex}`">
        <div style="display: flex; justify-content: space-between;">
          <md-subheader>{{ measure.title }}</md-subheader>
          <md-switch :value="true" />
        </div>

        <md-list-item
          v-for="(area, index) in areas"
          :key="area.id"
          :class="{'md-inset': index !== 0}">
          <md-avatar v-if="index === 0">
            <img :src="measure.image.url" alt="" >
          </md-avatar>
          <span class="md-list-item-text">{{ area.properties.name }}</span>
          <md-switch :value="true" />
        </md-list-item>

        <md-divider/>
      </div>
    </md-list>
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
      shownAreaIds: [],
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
}
</script>
