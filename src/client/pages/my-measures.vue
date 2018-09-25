<template>
  <md-drawer md-permanent="clipped">
    <div class="legend">
      <md-toolbar md-elevation="0">
        <span class="md-title">{{ $t('your_measures') }}</span>
      </md-toolbar>
      <md-list>
        <div
          v-for="({measure, areas, someAreasAreShown}, index) in measureCollection"
          :key="index"
          :style="someAreasAreShown ? `border-left-color: ${measure.color.hex}` : `border-left-color: #ccc`"
          class="legend__item">
          <div class="legend__item-header">
            <md-subheader>{{ measure.title }}</md-subheader>
            <md-switch
              :value="!someAreasAreShown"
              @change="value => updateAreaProperties({ features: areas, properties: { hidden: !value }})"
            />
          </div>

          <md-list-item
            v-for="(area, index) in areas"
            :key="area.id"
            :class="{'md-inset': index !== 0}">
            <md-avatar v-if="index === 0">
              <img :src="measure.image.url" alt="" >
            </md-avatar>
            <span class="md-list-item-text">{{ area.properties.name }}</span>
            <md-switch
              :value="area.properties.hidden"
              @change="value => updateAreaProperties({ features: [area], properties: { hidden: !value }})"
            />
          </md-list-item>

          <md-divider/>
        </div>
      </md-list>
    </div>
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
    onMeasureToggle(id) {
      this.$store.dispatch('project/toggleMeasureVisibility', id)
    },
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
