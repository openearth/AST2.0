<template>
  <div class="map-viewer">
    <map-box
      :active-base-layer="activeBaseLayer"
      :interactive="interactive"
      :point="point"
      :line="line"
      :polygon="polygon"
      :is-project="isProject"
      :project-area="projectArea"
      :areas="areas"
      :map-zoom="mapZoom"
      :map-center="mapCenter"
      class="map-viewer__map"
      @create="onCreate"
      @update="onUpdate"
      @delete="onDelete"
      @selectionchange="onSelectionchange"
      @move="onMove"
    />

    <map-controls
      :line="true"
      :polygon="true"
      :point="true"
      @mode-line="changeMode('draw_line_string')"
      @mode-polygon="changeMode('draw_polygon')"
      @mode-point="changeMode('draw_point')"/>

    <map-base-layer-switcher
      :base-layers="baseLayers"
      class="map-viewer__layer-switcher"
      @switch="onBaseLayerSwitch"/>
  </div>
</template>

<script>
import MapEventBus, { MODE } from "../../lib/map-event-bus";
import MapBox from "../map-box";
import MapBaseLayerSwitcher from "../map-base-layer-switcher";
import MapControls from "../map-controls";

export default {
  components: { MapBox, MapBaseLayerSwitcher, MapControls },
  props: {
    activeBaseLayer: {
      type: String,
      required: true,
    },
    baseLayers: {
      type: Array,
      default: () => ([]),
    },
    interactive: {
      type: Boolean,
      default: true,
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
  },
  methods: {
    onCreate(event) { this.$emit('create', event) },
    onUpdate(event) { this.$emit('update', event) },
    onDelete(event) { this.$emit('delete', event) },
    onSelectionchange(event) { this.$emit('selectionchange', event) },
    onBaseLayerSwitch(event) { this.$emit('baseLayerSwitch', event) },
    onMove(event) { this.$emit('move', event) },
    changeMode(mode) {
      MapEventBus.$emit(MODE, mode)
    },
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
  /* transform: translate(-50%, -50%); */
}

.map-viewer__layer-switcher {
  position: absolute;
  bottom: 30px;
  right: 55px;
}
</style>
