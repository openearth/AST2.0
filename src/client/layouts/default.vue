<template>
  <div class="layout-default">
    <app-header @onShowNavigation="showNavigation = true"/>
    <app-menu
      :show-navigation="showNavigation"
      :title="$t('ast')"
      :accepted-legal="acceptedLegal"
      :created-project-area="createdProjectArea"
      :filled-in-required-settings="filledInRequiredProjectAreaSettings"
      @onCloseNavigation="showNavigation = false"
      @saveProject="saveProject"/>

    <div class="layout-default__content">
      <nuxt />

      <md-content class="layout-default__map-wrapper">
        <map-viewer
          :active-base-layer="map.activeBaseLayer"
          :base-layers="map.baseLayers"
          :project-area="projectArea"
          :areas="areas"
          :is-project="true"
          class="layout-default__map"
          @create="createArea"
          @update="updateArea"
          @delete="deleteArea"
          @selectionchange="selectionChange"
          @baseLayerSwitch="onBaseLayerSwitch"/>
        <kpi-panel
          :kpis="filteredKpiGroups"
          :kpi-values="filteredKpiValues"
          :kpi-percentage-values="filteredKpiPercentageValues"/>
      </md-content>
    </div>
    <virtual-keyboard class="layout-default__virtual-keyboard"/>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { AppHeader, MapViewer, KpiPanel, VirtualKeyboard, AppMenu } from '../components'
import { mapFields } from 'vuex-map-fields';

export default {
  components: { AppHeader, MapViewer, KpiPanel, VirtualKeyboard, AppMenu },
  data() {
    return {
      showNavigation: false,
    }
  },
  computed: {
    ...mapState({
      map: state => state.project.map,
      areas: state => state.project.areas,
      projectArea: state => state.project.settings.area,
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
      saveProject: 'project/saveProject',
    }),
  },
}
</script>

<style>
@import '../components/app-core/index.css';

.layout-default {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.layout-default__content {
  overflow-y: scroll;
  display: flex;
  flex: 1;
}

.layout-default__map-wrapper {
  flex: 1;
  display: flex;
}

.layout-default__map {
  flex: 1;
}

.layout-default__virtual-keyboard {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 5;
}
</style>
