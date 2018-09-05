<template>
  <article 
    :style="`border-color: ${measure.color.hex}`"
    class="measure-card">
    
    <div class="measure-card__content">
      <div class="measure-card__text">
        <h3 class="measure-card__title">{{ measure.title }}</h3>

        <ul class="measure-card__scores">
          <li
            v-for="(score, index) in scores"
            :key="index"
            class="measure-card__scores__score">
            {{ score }}
          </li>
        </ul>
      </div>

      <responsive-image :image="measure.image" class="measure-card__image" />
    </div>

    <div class="measure-card__actions">
      <button class="measure-card__actions__choose" @click="chooseMeasure">Choose</button>
      <a href="#" class="measure-card__actions__learn-more" />
    </div>
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
  data() {
    return {
      scores: [
        'Ground water',
        'Drought',
        'Pluvial flooding',
      ],
    }
  },
  methods: {
    chooseMeasure() {
      // TODO show add measure to selected area
    },
  },
}
</script>

<style>
.measure-card {
  padding: 1.5rem var(--spacing-default);
  width: 320px;
  height: 180px;
  border-left: 8px solid;
  box-shadow: 2px 2px 15px #ddd;
}

.measure-card__content {
  display: flex;
}

.measure-card__text {
  margin-right: var(--spacing-half);
  width: 70%;
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

.measure-card__scores {
  font-size: 12px;
}
</style>
