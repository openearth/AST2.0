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
        @delete="onAreaDelete"
        @baseLayerSwitch="onBaseLayerSwitch"/>
      <kpi-panel />
    </section>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { AppHeader, MapViewer, KpiPanel } from '../components'
import turf from '@turf/area'

export default {
  components: { AppHeader, MapViewer, KpiPanel },
  computed: {
    ...mapState({ map: state => state.project.map }),
  },
  methods: {
    ...mapMutations({
      onBaseLayerSwitch: 'project/setBaseLayer',
      createArea: 'project/createArea',
      updateArea: 'project/updateArea',
      onAreaDelete: 'project/deleteArea',
    }),
    onAreaCreate(e) {
      const area = turf(e[0].geometry)
      console.log(area.toFixed(2))
      const [projectArea] = e

      this.createArea({ ...projectArea, area })
    },
    onAreaUpdate(e) {
      const area = turf(e[0].geometry)
      const [projectArea] = e

      this.updateArea({ ...projectArea, area })
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
