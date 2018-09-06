<template>
  <div class="map-base-layer-switcher">
    <button
      v-for="layer in baseLayers"
      :key="layer.key"
      class="map-base-layer-switcher__button button"
      @click="$emit('switch', layer.key)">{{ layer.label }}</button>
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
  margin-left: var(--spacing-default);
}
</style>
