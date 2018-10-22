<template>
  <md-list>
    <li
      v-for="layer in layers"
      :key="layer.id"
      class="md-list-item">
      <div class="md-list-item-content">
        <img
          v-if="true"
          :src="layer.legendUrl"
          alt="">
      </div>
    </li>
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
}
</script>

<style>

</style>
