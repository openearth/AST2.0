<template>
  <ul class="map-controls">
    <li v-if="search" class="map-controls__item map-controls__item--search">
      <md-button
        :class="{'md-primary': showSearch}"
        class="md-icon-button md-raised"
        @click="showSearch = !showSearch">
        <md-icon>search</md-icon>
      </md-button>
      <search-input
        v-if="showSearch"
        :show="showSearch"
        @search="(event) => {
          $emit('search', event)
          showSearch = false
        }"
      />
    </li>

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
import SearchInput from '../search-input'

export default {
  components: { SearchInput },
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
    search: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showSearch: false,
    }
  },
}
</script>

<style>
.map-controls {
  padding: 0;
  z-index: 1;
}

.map-controls__item {
  margin-top: 6px;
  margin-bottom: 6px;
}

.map-controls__item--search {
  display: flex;
  align-items: center;
}
</style>
