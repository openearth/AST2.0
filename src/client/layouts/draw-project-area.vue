<template>
  <div class="layout-draw-project-area">
    <app-header @onShowNavigation="showNavigation = true"/>
    <app-menu
      :show-navigation="showNavigation"
      :title="$t('ast')"
      :accepted-legal="acceptedLegal"
      :created-project-area="createdProjectArea"
      :filled-in-required-settings="filledInRequiredProjectAreaSettings"
      @onCloseNavigation="showNavigation = false"/>

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
          :polygon="true"
          :map-center="center"
          :map-zoom="zoom"
          class="layout-draw-project-area__map"
          @create="createArea"
          @update="updateArea"
          @delete="deleteArea"
          @selectionchange="selectionChange"
          @baseLayerSwitch="onBaseLayerSwitch"
          @move="setMapPosition"/>
      </md-content>
    </div>
    <virtual-keyboard class="layout-draw-project-area__virtual-keyboard"/>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { AppHeader, MapViewer, VirtualKeyboard, AppMenu } from '../components'
import { mapFields } from 'vuex-map-fields';

export default {
  components: { AppHeader, MapViewer, VirtualKeyboard, AppMenu },
  data() {
    return {
      showNavigation: false,
    }
  },
  computed: {
    ...mapState({
      map: state => state.project.map,
      projectArea: state => state.project.settings.area,
      areas: state => state.project.areas,
      center: state => state.project.map.center,
      zoom: state => state.project.map.zoom,
    }),
    ...mapGetters('project', ['filteredKpiValues', 'filteredKpiPercentageValues', 'filteredKpiGroups']),
    ...mapGetters('flow', ['acceptedLegal', 'createdProjectArea', 'filledInRequiredProjectAreaSettings']),
  },
  methods: {
    ...mapMutations({ onBaseLayerSwitch: 'project/setBaseLayer' }),
    ...mapActions({
      createArea: 'project/createArea',
      updateArea: 'project/updateArea',
      deleteArea: 'project/deleteArea',
      selectionChange: 'selectedAreas/changeSelection',
      setMapPosition: 'project/setMapPosition',
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
