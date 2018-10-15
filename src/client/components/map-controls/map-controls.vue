<template>
  <ul class="map-controls">
    <li v-if="polygon" class="map-controls__item map-controls__item--polygon">
      <md-button
        :class="{'md-primary': currentMode === 'draw_polygon'}"
        class="md-icon-button md-raised"
        @click="$emit('setMode', 'draw_polygon')">
        <md-icon>crop_square</md-icon>
      </md-button>
    </li>

    <li v-if="line" class="map-controls__item map-controls__item--line">
      <md-button
        :class="{'md-primary': currentMode === 'draw_line_string'}"
        class="md-icon-button md-raised"
        @click="$emit('setMode', 'draw_line_string')">
        <md-icon>timeline</md-icon>
      </md-button>
    </li>

    <li v-if="point" class="map-controls__item map-controls__item--point">
      <md-button
        :class="{'md-primary': currentMode === 'draw_point'}"
        class="md-icon-button md-raised"
        @click="$emit('setMode', 'draw_point')">
        <md-icon>location_on</md-icon>
      </md-button>
    </li>

    <li v-if="trash" class="map-controls__item map-controls__item--trash">
      <md-button
        class="md-icon-button md-raised"
        @click="$emit('trash')">
        <md-icon>delete_outline</md-icon>
      </md-button>
    </li>

    <li v-if="layers" class="map-controls__item map-controls__item--layers">
      <md-button
        class="md-icon-button md-raised"
      >
        <md-icon>layers</md-icon>
      </md-button>
      <layer-list
        :layers="wmsLayers"
        class="map-controls__layer-list"/>
    </li>

    <li v-if="zoomIn" class="map-controls__item map-controls__item--zoom-in">
      <md-button
        class="md-icon-button md-raised"
        @click="$emit('zoom-in')">
        <md-icon>add</md-icon>
      </md-button>
    </li>

    <li v-if="zoomOut" class="map-controls__item map-controls__item--zoom-out">
      <md-button
        class="md-icon-button md-raised"
        @click="$emit('zoom-out')">
        <md-icon>remove</md-icon>
      </md-button>
    </li>
  </ul>
</template>

<script>
import LayerList from "../layer-list";

export default {
  components: { LayerList },
  props: {
    line: {
      type: Boolean,
      default: false,
    },
    polygon: {
      type: Boolean,
      default: false,
    },
    point: {
      type: Boolean,
      default: false,
    },
    trash: {
      type: Boolean,
      default: false,
    },
    layers: {
      type: Boolean,
      default: false,
    },
    zoomIn: {
      type: Boolean,
      default: false,
    },
    zoomOut: {
      type: Boolean,
      default: false,
    },
    currentMode: {
      type: String,
      default: '',
    },
    wmsLayers: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

<style>
.map-controls {
  padding: 0;
}

.map-controls__item {
  margin-top: 6px;
  margin-bottom: 6px;
}

.map-controls__item--layers {
  position: relative;
}

.map-controls__layer-list {
  position: absolute;
  width: 300px;
  background-color: red;
  left: 50px;
  top: 0;
}
</style>
