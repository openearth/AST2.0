<template>
  <div class="layout-default">
    <app-header class="layout-default__app-header"/>
    <section class="layout-default__project">
      <nuxt class="layout-default__page"/>
      <map-viewer
        :active-base-layer="map.activeBaseLayer"
        :base-layers="map.baseLayers"
        class="layout-default__map"
        @create="onAreaCreate"
        @update="onAreaUpdate"
        @delete="deleteArea"
        @baseLayerSwitch="onBaseLayerSwitch"/>
      <kpi-panel />
    </section>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { AppHeader, MapViewer, KpiPanel } from '../components'

export default {
  components: { AppHeader, MapViewer, KpiPanel },
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
    }),
    onAreaCreate(e) {
      const [features] = e
      this.createArea(features)
    },
    onAreaUpdate(e) {
      const [features] = e
      this.updateArea(features)
    },
  },
}
</script>

<style>
@import '../components/app-core/index.css';

.layout-default {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.layout-default__app-header {
  height: 50px;
}

.layout-default__project {
  display: flex;
  flex-direction: row;
  flex: 1;
}

.layout-default__map {
  flex: 1;
}
</style>
