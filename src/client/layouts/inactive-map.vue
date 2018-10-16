<template>
  <div class="layout-inactive-map">
    <app-header :title="title" @onShowNavigation="showMenu"/>
    <app-menu
      :show-navigation="showNavigation"
      :title="$t('ast')"
      :accepted-legal="acceptedLegal"
      :created-project-area="createdProjectArea"
      :filled-in-required-settings="filledInRequiredProjectAreaSettings"
      @onCloseNavigation="hideMenu"
      @saveProject="saveProject"
      @importProject="onFileInput"/>

    <div class="layout-inactive-map__content">
      <nuxt />

      <md-content class="layout-inactive-map__map-wrapper">
        <map-viewer
          :active-base-layer="map.activeBaseLayer"
          :base-layers="map.baseLayers"
          :project-area="projectArea"
          :is-project="true"
          :areas="areas"
          :interactive="false"
          :map-center="center"
          :map-zoom="zoom"
          :current-mode="mapMode"
          class="layout-inactive-map__map"
          @move="setMapPosition"/>
      </md-content>
    </div>
    <virtual-keyboard class="layout-inactive-map__virtual-keyboard"/>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { AppHeader, MapViewer, KpiPanel, VirtualKeyboard, AppMenu } from '../components'
import { mapFields } from 'vuex-map-fields';

export default {
  components: { AppHeader, MapViewer, KpiPanel, VirtualKeyboard, AppMenu },
  computed: {
    ...mapState({
      map: state => state.project.map,
      projectArea: state => state.project.settings.area,
      center: state => state.project.map.center,
      zoom: state => state.project.map.zoom,
      showNavigation: state => state.appMenu.show,
      title: state => state.project.settings.general.title,
      mapMode: state => state.map.mode,
    }),
    ...mapGetters('project', ['filteredKpiValues', 'filteredKpiPercentageValues', 'filteredKpiGroups', 'areas']),
    ...mapGetters('flow', ['acceptedLegal', 'createdProjectArea', 'filledInRequiredProjectAreaSettings', 'currentFilledInLevel']),
  },
  methods: {
    ...mapActions({
      importProject: 'project/importProject',
      saveProject: 'project/saveProject',
      setMapPosition: 'project/setMapPosition',
    }),
    ...mapMutations({
      showMenu: 'appMenu/showMenu',
      hideMenu: 'appMenu/hideMenu',
    }),
    async onFileInput(event) {
      this.importProject(event)
        .then(() => this.$router.push(this.currentFilledInLevel.uri))
    },
  },
}
</script>

<style>
@import '../components/app-core/index.css';

.layout-inactive-map {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.layout-inactive-map__content {
  overflow-y: scroll;
  display: flex;
  flex: 1;
}

.layout-inactive-map__map-wrapper {
  flex: 1;
  display: flex;
}

.layout-inactive-map__map {
  flex: 1;
}

.layout-inactive-map__virtual-keyboard {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 5;
}
</style>
