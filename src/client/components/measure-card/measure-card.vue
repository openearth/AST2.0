<template>
  <article 
    :style="`border-top: 8px solid ${ measure.color.hex }`"
    class="measure-card">
    
    <div class="measure-card__text">
      <h3 class="measure-card__text__title">{{ measure.title }}</h3>
      <div v-html="measure.body" />
    </div>
    
    <responsive-image :image="measure.image" class="measure-card__image" />
  </article>
</template>

<script>
import { ResponsiveImage } from '~/components'

export default {
  components: { ResponsiveImage },
  props: {
    measure: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style>
.measure-card {
    display: flex;
    padding: 1.5rem var(--spacing-default);
    max-width: 320px;
    box-shadow: 2px 2px 10px #ccc;
  }

.measure-card__text {
  width: 70%;
  height: 200px;
  overflow: hidden;
}

.measure-card__text__title {
  margin-bottom: var(--spacing-half);
}

.measure-card__image {
  width: 30%;
}
</style>
