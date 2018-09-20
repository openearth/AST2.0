<template>
  <md-drawer md-permanent="clipped">
    <md-list>
      <div
        v-for="({measure, areas}, index) in measureCollection"
        :key="index"
        :style="!hiddenMeasures.includes(measure.measureId) ? `border-left: 5px solid ${measure.color.hex}` : `border-left: 5px solid #ccc`">
        <div style="display: flex; justify-content: space-between;">
          <md-subheader>{{ measure.title }}</md-subheader>
          <md-switch
            :value="measure.measureId"
            v-model="hiddenMeasures"
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
          <md-switch :value="true" />
        </md-list-item>

        <md-divider/>
      </div>
    </md-list>
    <pre>hidden: {{ hiddenAreas.map(area => area.properties.name) }}</pre>
    <pre>shown: {{ shownAreas.map(area => area.properties.name) }}</pre>
    <pre>active: {{ activeMeasures }}</pre>
  </md-drawer>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex"
import { MeasureCard, SearchInput } from '~/components'

export default {
  components: { MeasureCard, SearchInput },
  data() {
    return {
      isAreasListVisible: false,
      isAreaVisible: true,
      shownAreaIds: [],
      hiddenMeasures: [],
    }
  },
  computed: {
    ...mapState('data', ['measures']),
    ...mapState('project', ['areas']),
    ...mapGetters('selectedAreas', { selectedFeatures: 'features' }),
    ...mapGetters('project', ['areasByMeasure', 'hiddenAreas', 'shownAreas']),
    ...mapGetters('data/measures', ['activeMeasures']),
    measureCollection() {
      return Object.keys(this.areasByMeasure).map(key => this.areasByMeasure[key])
    },
  },
  methods: {
    onMeasureToggle(id) {
      const updatedAreas = this.areas.filter(area => area.properties.measure === id)

      if (this.hiddenMeasures.includes(id)) {
        // this.$store.commit('project/hideMeasure', id)
        this.updateAreasByMeasureVisibility(updatedAreas, true)
        // this.$store.dispatch('project/deleteAreaOnMap', updatedAreas)
        return
      }

      this.$store.commit('project/showMeasure', id)
      this.$store.dispatch('project/addAreaToMap', updatedAreas)
      this.updateAreasByMeasureVisibility(updatedAreas, false)
    },
    updateAreasByMeasureVisibility(features, isHidden) {
      return this.$store.dispatch('project/updateAreaProperties', {
        features: features,
        properties: {
          hidden: isHidden,
        },
      })
    },
  },
}
</script>
