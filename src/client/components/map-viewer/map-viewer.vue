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
    <map-base-layer-switcher
      :base-layers="baseLayers"
      class="map-viewer__layer-switcher"
      @switch="onBaseLayerSwitch"/>
  </div>
</template>

<script>
import { MapBox, MapBaseLayerSwitcher } from "..";

export default {
  components: { MapBox, MapBaseLayerSwitcher },
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
  },
}
</script>

<style>
.map-viewer {
  display: flex;
  position: relative;
}

.map-viewer__map {
  flex: 1;
}

.map-viewer__layer-switcher {
  position: absolute;
  bottom: 30px;
  right: 55px;
}
</style>
