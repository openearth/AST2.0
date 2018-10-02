<template>
  <div class="layout-draw-project-area">
    <app-header />

    <div class="layout-draw-project-area__content">
      <nuxt />

      <md-content class="layout-draw-project-area__map-wrapper">
        <map-viewer
          :active-base-layer="map.activeBaseLayer"
          :base-layers="map.baseLayers"
          :project-area="projectArea"
          :is-project="false"
          :areas="areas"
          :point="false"
          :line="false"
          :polygon="!hasProjectArea"
          class="layout-draw-project-area__map"
          @create="createArea"
          @update="updateArea"
          @delete="deleteArea"
          @selectionchange="selectionChange"
          @baseLayerSwitch="onBaseLayerSwitch"/>
      </md-content>
    </div>
    <virtual-keyboard class="layout-draw-project-area__virtual-keyboard"/>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { AppHeader, MapViewer, VirtualKeyboard } from '../components'
import { mapFields } from 'vuex-map-fields';

export default {
  components: { AppHeader, MapViewer, VirtualKeyboard },
  computed: {
    ...mapState({
      map: state => state.project.map,
      projectArea: state => state.project.settings.area,
      hasProjectArea: state => !!state.project.settings.area.properties,
      areas: state => state.project.areas,
    }),
    ...mapGetters('project', ['filteredKpiValues', 'filteredKpiPercentageValues', 'filteredKpiGroups']),
  },
  methods: {
    ...mapMutations({ onBaseLayerSwitch: 'project/setBaseLayer' }),
    ...mapActions({
      createArea: 'project/createArea',
      updateArea: 'project/updateArea',
      deleteArea: 'project/deleteArea',
      selectionChange: 'selectedAreas/changeSelection',
    }),
  },
}
</script>

<style>
@import '../components/app-core/index.css';

.layout-draw-project-area {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.layout-draw-project-area__content {
  overflow-y: scroll;
  display: flex;
  flex: 1;
}

.layout-draw-project-area__map-wrapper {
  flex: 1;
  display: flex;
}

.layout-draw-project-area__map {
  flex: 1;
}

.layout-draw-project-area__virtual-keyboard {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 5;
}
</style>
