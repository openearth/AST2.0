<template>
  <div class="layer-legend">
    <p class="layer-legend__title"> legend </p>
    <md-list class="layer-legend__list">
      <li
        v-for="layer in layers"
        :key="layer.id"
        class="md-list-item">
        <div
          v-if="layer.showLegend"
          class="md-list-item-content">
          <p>{{ layer.title }}</p>
          <img
            :src="layer.legendUrl"
            alt="">
        </div>
      </li>
    </md-list>
  </div>
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
  .layer-legend
  {
    width:164px;
    margin:6px;
    background-color: #FFFFFF;
    max-height: calc( 100% - 12px );
    overflow-y:auto;
   }

  .layer-legend__title
  {
    padding:4px;
    background-color: #D4D4D4;
    height:32px;
  }

  .layer-legend__list .md-list-item-content
  {
    display:block;
  }
</style>
