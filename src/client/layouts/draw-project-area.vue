<template>
  <div class="layout-draw-project-area">
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
          :polygon="!projectArea.id"
          :map-center="center"
          :map-zoom="zoom"
          :current-mode="mapMode"
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

    <notification-area
      :notifications="notifications"
      @remove-notification="removeNotification"
    />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { AppHeader, MapViewer, VirtualKeyboard, AppMenu, NotificationArea } from '../components'
import { mapFields } from 'vuex-map-fields';

export default {
  components: { AppHeader, MapViewer, VirtualKeyboard, AppMenu, NotificationArea },
  computed: {
    ...mapState({
      map: state => state.project.map,
      projectArea: state => state.project.settings.area,
      areas: state => state.project.areas,
      center: state => state.project.map.center,
      zoom: state => state.project.map.zoom,
      showNavigation: state => state.appMenu.show,
      title: state => state.project.settings.general.title,
      mapMode: state => state.map.mode,
      notifications: state => state.notifications.messages,
    }),
    ...mapGetters('project', ['filteredKpiValues', 'filteredKpiPercentageValues', 'filteredKpiGroups']),
    ...mapGetters('flow', ['acceptedLegal', 'createdProjectArea', 'filledInRequiredProjectAreaSettings', 'currentFilledInLevel']),
  },
  methods: {
    ...mapMutations({
      onBaseLayerSwitch: 'project/setBaseLayer',
      showMenu: 'appMenu/showMenu',
      hideMenu: 'appMenu/hideMenu',
      removeNotification: 'notifications/remove',
    }),
    ...mapActions({
      createArea: 'project/createArea',
      updateArea: 'project/updateArea',
      deleteArea: 'project/deleteArea',
      selectionChange: 'selectedAreas/changeSelection',
      importProject: 'project/importProject',
      saveProject: 'project/saveProject',
      setMapPosition: 'project/setMapPosition',
      showError: 'notifications/showError',
    }),
    async onFileInput(event) {
      this.importProject(event)
        .then(() => this.$router.push(this.currentFilledInLevel.uri))
        .catch(error => this.showError(this.$i18n.t('could_not_load_file')))
    },
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
