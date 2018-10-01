<template>
  <div class="layout-settings">
    <app-header />

    <div class="layout-settings__content">
      <nuxt />

      <md-content class="layout-settings__map-wrapper">
        <map-viewer
          :active-base-layer="map.activeBaseLayer"
          :base-layers="map.baseLayers"
          class="layout-settings__map"
          @create="createArea"
          @update="updateArea"
          @delete="deleteArea"
          @selectionchange="selectionChange"
          @baseLayerSwitch="onBaseLayerSwitch"/>
      </md-content>
    </div>
    <virtual-keyboard class="layout-settings__virtual-keyboard"/>
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
      area: state => state.project.settings.projectArea.area,
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

.layout-settings {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.layout-settings__content {
  overflow-y: scroll;
  display: flex;
  flex: 1;
}

.layout-settings__map-wrapper {
  flex: 1;
  display: flex;
}

.layout-settings__map {
  flex: 1;
}

.layout-settings__virtual-keyboard {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 5;
}
</style>
