<template>
  <article 
    :style="`border-color: ${measure.color.hex}`"
    class="measure-card">
    
    <div class="measure-card__content">
      <div class="measure-card__text">
        <h3 class="measure-card__title">{{ measure.title }}</h3>
        <div v-html="measure.body" />
      </div>
      
      <responsive-image :image="measure.image" class="measure-card__image" />
    </div>
    <button class="measure-card__info" @click="showMeasureInfo"/>
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
  methods: {
    showMeasureInfo() {
      // TODO show additional info
    },
  },
}
</script>

<style>
.measure-card {
  padding: 1.5rem var(--spacing-default);
  width: 320px;
  border-top: 8px solid;
  box-shadow: 2px 2px 15px #ddd;
}

.measure-card__content {
  display: flex;
}

.measure-card__text {
  margin-right: var(--spacing-half);
  width: 70%;
  height: 200px;
  overflow: hidden;
}

.measure-card__title {
  margin-bottom: var(--spacing-half);
}

.measure-card__image {
  width: 30%;
}

.measure-card__info {
  display: block;
  margin-left: auto;
  width: 35px;
  height: 35px;
  background-image: url('/images/info.svg');
  background-size: contain;
  background-repeat: no-repeat;
}
</style>
