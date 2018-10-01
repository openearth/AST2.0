<template>
  <div class="layout-modal">
    <app-header />

    <div class="layout-modal__content">
      <div class="layout-modal__page-wrapper">
        <md-content class="md-elevation-6">
          <nuxt class="layout-modal__page"/>
        </md-content>
      </div>

      <map-viewer
        :active-base-layer="map.activeBaseLayer"
        :base-layers="map.baseLayers"
        class="layout-modal__map"
        @create="createArea"
        @update="updateArea"
        @delete="deleteArea"
        @selectionchange="selectionChange"
        @baseLayerSwitch="onBaseLayerSwitch"/>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { AppHeader, MapViewer, KpiPanel, VirtualKeyboard } from '../components'
import { mapFields } from 'vuex-map-fields';

export default {
  components: { AppHeader, MapViewer, KpiPanel, VirtualKeyboard },
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

.layout-modal {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

.layout-modal__content {
  overflow-y: scroll;
  display: flex;
  flex: 1;
  z-index: 0;
}

.layout-modal__map {
  flex: 1;
  z-index: 0;
}

.layout-modal__page-wrapper {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.layout-modal__page {
  padding: var(--spacing-default);
}
</style>
