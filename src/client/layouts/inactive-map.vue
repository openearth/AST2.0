<template>
  <div class="layout-inactive-map">
    <app-header @onShowNavigation="showNavigation = true"/>
    <app-menu
      :show-navigation="showNavigation"
      :title="$t('ast')"
      :accepted-legal="acceptedLegal"
      :created-project-area="createdProjectArea"
      :filled-in-required-settings="filledInRequiredProjectAreaSettings"
      @onCloseNavigation="showNavigation = false"
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
          class="layout-inactive-map__map"/>
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
    ...mapGetters('flow', ['acceptedLegal', 'createdProjectArea', 'filledInRequiredProjectAreaSettings', 'currentFilledInLevel']),
  },
  methods: {
    ...mapActions({
      importProject: 'project/importProject',
      saveProject: 'project/saveProject',
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
