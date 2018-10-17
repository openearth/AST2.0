<template>
  <div class="map-base-layer-switcher">
    <md-button
      v-for="layer in baseLayers"
      :key="layer.key"
      class="map-base-layer-switcher__button md-raised"
      @click="$emit('switch', layer.key)">{{ layer.label }}</md-button>
  </div>
</template>

<script>
export default {
  props: {
    baseLayers: {
      type: Array,
      default: () => ([]),
    },
  },
}
</script>

<style>
.map-base-layer-switcher__button {
  margin: 0 0;
}

.map-base-layer-switcher__button:not(:last-child) {
  margin-right: var(--spacing-half);
}
</style>
