<template>
  <md-drawer md-permanent="clipped">
    <md-toolbar md-elevation="0">
      <span class="md-title">{{ $t('your_measures') }}</span>
    </md-toolbar>
    <md-list>
      <div
        v-for="({measure, areas}, index) in measureCollection"
        :key="index"
        :style="(hiddenMeasures.indexOf(measure.measureId) === -1) ? `border-left: 8px solid ${measure.color.hex}` : `border-left: 8px solid #ccc`">
        <div style="display: flex; justify-content: space-between;">
          <md-subheader>{{ measure.title }}</md-subheader>
          <md-switch
            :value="hiddenMeasures.indexOf(measure.measureId) === -1"
            @change="() => onMeasureToggle(measure.measureId)" />
        </div>

        <md-list-item
          v-for="(area, index) in areas"
          :key="area.id"
          :class="{'md-inset': index !== 0}">
          <md-avatar v-if="index === 0">
            <img :src="measure.image.url" alt="" >
          </md-avatar>
          <span class="md-list-item-text">{{ area.properties.name }}</span>
          <md-switch :value="hiddenMeasures.indexOf(measure.measureId) === -1" />
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
    }
  },
  computed: {
    ...mapState('data', ['measures']),
    ...mapState('project', ['areas', 'hiddenMeasures']),
    ...mapGetters('selectedAreas', { selectedFeatures: 'features' }),
    ...mapGetters('project', ['areasByMeasure', 'measureCollection']),
  },
  mounted() {
    MapEventBus.$emit(REDRAW)
  },
  methods: {
    onMeasureToggle(id) {
      this.$store.dispatch('project/toggleMeasureVisibility', id)
    },
  },
}
</script>
