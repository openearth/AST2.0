<template>
  <md-list class="layer-legend">
    <md-list-item
      :md-expanded="shownLayers"
      :md-expand="shownLayers"
      class="layer-legend__wrapper"
    >
      <span>{{ $t('legend') }}</span>

      <div
        v-if="shownLayers"
        slot="md-expand"
        class="layer-legend__content"
      >
        <md-list>
          <md-list-item
            v-for="layer in layersThatShouldShowLegend"
            :key="layer.id"
          >
            <div class="layer-legend__item">
              <p>{{ layer.title }}</p>
              <img
                :src="layer.legendUrl"
                alt=""
              >
            </div>
          </md-list-item>
        </md-list>
      </div>
    </md-list-item>
  </md-list>
</template>

<script>
export default {
  props: {
    layers: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    layersThatShouldShowLegend() {
      return this.layers.filter(layer => layer.showLegend)
    },
    shownLayers() {
      return !!this.layers
        .filter(layer => layer.showLegend)
        .length
    },
  },
}
</script>

<style>
.layer-legend {
  margin:6px;
  padding: 0;
  background-color: #FFFFFF;
  max-height: calc(100vh - 12px - 70px);
  overflow: hidden;
  box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
}

.layer-legend__wrapper {
  width: 200px;
}

.layer-legend__content {
  overflow-y: auto;
  max-height: calc(100vh - 12px - 120px);
}

.layer-legend__item {
  display: flex;
  flex-direction: column;
}
</style>
