<template>
  <div class="layout-default">
    <app-header />

    <div class="layout-default__content">
      <nuxt />

      <md-content class="layout-default__map-wrapper">
        <map-viewer
          :active-base-layer="map.activeBaseLayer"
          :base-layers="map.baseLayers"
          class="layout-default__map"
          @create="createArea"
          @update="updateArea"
          @delete="deleteArea"
          @selectionchange="selectionChange"
          @baseLayerSwitch="onBaseLayerSwitch"/>
        <kpi-panel />
      </md-content>
    </div>
    <!-- <section class="layout-default__project">
      <nuxt class="layout-default__page"/>
      <map-viewer
        :active-base-layer="map.activeBaseLayer"
        :base-layers="map.baseLayers"
        class="layout-default__map"
        @create="createArea"
        @update="updateArea"
        @delete="deleteArea"
        @selectionchange="selectionChange"
        @baseLayerSwitch="onBaseLayerSwitch"/>
      <kpi-panel />
    </section> -->

    <input
      id="input"
      type="text" 
      placeholder="Text input" 
      data-layout="numeric" 
      @focus="show" >
    
    <vue-touch-keyboard 
      v-if="visible" 
      :layout="layout" 
      :cancel="hide" 
      :accept="accept" 
      :input="input" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { AppHeader, MapViewer, KpiPanel } from '../components'

export default {
  components: { AppHeader, MapViewer, KpiPanel },
  data() {
    return {
      visible: false,
      layout: "normal",
      input: null,
      options: {
        useKbEvents: false,
        preventClickEvent: false,
      },
    }
  },
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

    accept(text) {
      alert("Input text: " + text);
      this.hide();
    },
    show(e) {
      console.log(e)
      this.input = e.target;
      this.layout = e.target.dataset.layout;

      if (!this.visible)
        this.visible = true
    },
    hide() {
      this.visible = false;
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

.layout-default__content {
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
</style>
