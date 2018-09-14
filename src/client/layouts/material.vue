<template>
  <section class="app">
    <md-app class="app__wrapper">
      <md-app-toolbar class="md-primary">
        <span class="md-title">AST 2.0</span>
      </md-app-toolbar>

      <md-app-drawer md-permanent="clipped">
        <nuxt />
      </md-app-drawer>

      <md-app-content class="app__content">
        <map-viewer
          :active-base-layer="map.activeBaseLayer"
          :base-layers="map.baseLayers"
          class="layout-default__map"
          @create="createArea"
          @update="updateArea"
          @delete="deleteArea"
          @selectionchange="selectionChange"
          @baseLayerSwitch="onBaseLayerSwitch"/>
      </md-app-content>
    </md-app>
  </section>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { MapViewer, KpiPanel } from '../components'

export default {
  components: { MapViewer, KpiPanel },
  computed: {
    ...mapState({
      map: state => state.project.map,
      area: state => state.project.settings.projectArea.area,
    }),
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

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
}

.app__wrapper {
  flex: 1;
}

.app__content {
  display: flex;
  padding: 0;
}

.app__content .map-viewer {
  flex: 1;
}
</style>
