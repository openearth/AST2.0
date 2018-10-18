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
      @modechange="mode => setMode(mode)"
    />

    <map-controls
      :search="true"
      :line="interactive && line"
      :polygon="interactive && polygon"
      :point="interactive && point"
      :trash="interactive"
      :current-mode="currentMode"
      class="map-viewer__controls--draw"
      @setMode="setMode"
      @trash="onClickDelete"
      @search="onSearch"/>

    <map-controls
      :zoom-in="interactive"
      :zoom-out="interactive"
      class="map-viewer__controls--zoom"
      @zoom-in="zoomIn"
      @zoom-out="zoomOut"/>

    <map-base-layer-switcher
      :base-layers="baseLayers"
      class="map-viewer__layer-switcher"
      @switch="onBaseLayerSwitch"/>
  </div>
</template>

<script>
import MapEventBus, { MODE, TRASH, DELETE, ZOOM_IN, ZOOM_OUT, SEARCH } from "../../lib/map-event-bus";
import MapBox from "../map-box";
import MapBaseLayerSwitcher from "../map-base-layer-switcher";
import MapControls from "../map-controls";
import { mapMutations, mapActions } from "vuex";

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
    currentMode: {
      type: String,
      default: '',
    },
  },
  methods: {
    ...mapActions({
      setMode: 'map/setMode',
    }),
    onCreate(event) { this.$emit('create', event) },
    onUpdate(event) { this.$emit('update', event) },
    onDelete(event) { this.$emit('delete', event) },
    onSelectionchange(event) { this.$emit('selectionchange', event) },
    onBaseLayerSwitch(event) { this.$emit('baseLayerSwitch', event) },
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
  bottom: 30px;
  right: 55px;
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

.mapboxgl-ctrl-top-right {
  display: none;
}
</style>
