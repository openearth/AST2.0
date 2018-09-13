<template>
  <div class="map-viewer">
    <map-box
      :active-base-layer="activeBaseLayer"
      class="map-viewer__map"
      @create="onCreate"
      @update="onUpdate"
      @delete="onDelete"
      @selectionchange="onSelectionchange"
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
  },
  methods: {
    onCreate(event) { this.$emit('create', event) },
    onUpdate(event) { this.$emit('update', event) },
    onDelete(event) { this.$emit('delete', event) },
    onSelectionchange(event) { this.$emit('selectionchange', event) },
    onBaseLayerSwitch(event) { this.$emit('baseLayerSwitch', event) },
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
