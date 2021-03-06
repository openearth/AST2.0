<template>
  <div class="map-viewer">
    <map-box
      :add-only="addOnly"
      :interactive="interactive"
      :animate="animate"
      :point="point"
      :line="line"
      :polygon="polygon"
      :is-project="isProject"
      :project-area="projectArea"
      :areas="areas"
      :map-zoom="mapZoom"
      :map-center="mapCenter"
      :custom-layers="customLayers"
      :layer-list="layerList"
      :heatstress-layers="heatstressLayers"
      :mode="mode"
      :fit-to-bounds="fitToBounds"
      class="map-viewer__map"
      @create="onCreate"
      @update="onUpdate"
      @delete="onDelete"
      @render="onRender"
      @selectionchange="onSelectionchange"
      @move="onMove"
      @modechange="mode => setMode(mode)"
    />

    <map-controls
      :search="interactive && search"
      :line="interactive && line"
      :polygon="interactive && polygon"
      :point="interactive && point"
      :trash="interactive"
      :layers="interactive && layers"
      :custom-layers="customLayers"
      :layer-list="layerList"
      :current-mode="currentMode"
      class="map-viewer__controls--draw"
      @set-mode="setMode"
      @trash="onClickDelete"
      @search="onSearch"
      @layer-opacity-change="setLayerOpacity"
      @legend-visibility-change="setLegendVisibility"
      @layer-visibility-change="setLayerVisibility"
    />

    <map-controls
      :zoom-in="interactive"
      :zoom-out="interactive"
      class="map-viewer__controls--zoom"
      @zoom-in="zoomIn"
      @zoom-out="zoomOut"
    />

    <layer-legend
      v-if="interactive && layers"
      :layers="layerList"
      class="map-viewer__layer-legend"
    />
  </div>
</template>

<script>
import MapEventBus, { DELETE, ZOOM_IN, ZOOM_OUT, SEARCH } from '../../lib/map-event-bus';
import MapBox from '../map-box';
import LayerLegend from '../layer-legend';
import MapControls from '../map-controls';
import { mapMutations, mapActions } from 'vuex';

export default {
  components: { MapBox, MapControls, LayerLegend },
  props: {
    interactive: {
      type: Boolean,
      default: true,
    },
    addOnly: {
      type: Boolean,
      default: false,
    },
    point: {
      type: Boolean,
      default: true,
    },
    line: {
      type: Boolean,
      default: true,
    },
    polygon: {
      type: Boolean,
      default: true,
    },
    search: {
      type: Boolean,
      default: false,
    },
    layers: {
      type: Boolean,
      default: true,
    },
    isProject: {
      type: Boolean,
      required: true,
    },
    projectArea: {
      type: Object,
      default: () => {},
    },
    areas: {
      type: Array,
      default: () => [],
    },
    mapCenter: {
      type: Object,
      default: () => ({ lat: 0, lng: 0 }),
    },
    mapZoom: {
      type: Number,
      default: 0,
    },
    currentMode: {
      type: String,
      default: '',
    },
    customLayers: {
      type: Array,
      default: () => [],
    },
    layerList: {
      type: Array,
      default: () => [],
    },
    heatstressLayers: {
      type: Array,
      default: () => [],
    },
    mode: {
      type: String,
      default: '',
    },
    fitToBounds: {
      type: Array,
      default: () => [],
    },
    animate: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    ...mapActions({
      setMode: 'map/setMode',
    }),
    ...mapMutations({
      setLayerOpacity: 'project/setLayerOpacity',
      setLayerVisibility: 'project/setLayerVisibility',
      setLegendVisibility: 'project/setLegendVisibility',
    }),
    onCreate(event) { this.$emit('create', event) },
    onUpdate(event) { this.$emit('update', event) },
    onDelete(event) { this.$emit('delete', event) },
    onRender(event) { this.$emit('render', event) },
    onSelectionchange(event) { this.$emit('selectionchange', event) },
    onMove(event) { this.$emit('move', event) },
    onClickDelete() { MapEventBus.$emit(DELETE) },
    zoomIn() { MapEventBus.$emit(ZOOM_IN) },
    zoomOut() { MapEventBus.$emit(ZOOM_OUT) },
    onSearch(event) { MapEventBus.$emit(SEARCH, event) },
  },
}
</script>

<style>
.map-viewer {
  display: flex;
  position: relative;
  overflow: hidden;
}

.map-viewer__map {
  width: 100vw;
  height: 100vh;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.map-viewer__layer-switcher {
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.map-viewer__controls--draw {
  position: absolute;
  top: 0;
  left: 0;
}

.map-viewer__controls--zoom {
  position: absolute;
  bottom: 0;
  left: 0;
}

.map-viewer__layer-legend {
  position: absolute;
  top: 0;
  right: 0;
}

.mapboxgl-ctrl-top-right {
  display: none;
}
</style>
