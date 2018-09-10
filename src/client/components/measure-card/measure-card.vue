<template>
  <article
    :style="`border-color: ${measure.color.hex}`"
    class="measure-card">

    <div class="measure-card__content">
      <div class="measure-card__text">
        <h3 class="measure-card__title">{{ measure.title }}</h3>

        <span class="measure-card__scores">{{ scoresString }}</span>
      </div>

      <responsive-image :image="measure.image" class="measure-card__image" />
    </div>

    <div class="measure-card__actions">
      <button class="measure-card__actions__choose" @click="chooseMeasure">Choose</button>
      <a href="#" class="measure-card__actions__learn-more">Learn more</a>
    </div>
  </article>
</template>

<script>
import ResponsiveImage from '~/components/responsive-image'

export default {
  components: { ResponsiveImage },
  props: {
    measure: {
      type: Object,
      required: true,
    },
    scores: {
      type: Array,
      required: true,
    },
  },
  computed: {
    scoresString() {
      return this.scores.join(' - ')
    },
  },
  methods: {
    chooseMeasure() {
      // TODO show add measure to selected area
      this.$emit('choose', this.measure.measureId)
    },
  },
}
</script>

<style>
.measure-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px var(--spacing-default);
  padding-bottom: 10px;
  width: 320px;
  height: 180px;
  border-left: 5px solid;
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
  font-size: var(--font-size-default);
  margin-bottom: var(--spacing-half);
}

.measure-card__image {
  width: 30%;
}

.measure-card__image.responsive-image {
  margin-bottom: 0;
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
  font-size: var(--font-size-small);
  font-style: italic;
}

.measure-card__actions {
  display: flex;
  justify-content: space-between;
}

.measure-card__actions__choose {
  font-size: 14px;
  font-weight: bold;
  border: 1px solid var(--text-color);
  border-radius: var(--border-radius-small);
  padding: var(--spacing-half) var(--spacing-default);
}

.measure-card__actions__choose:hover {
  background-color: var(--text-light-color);
  border-color: var(--text-light-color);
  color: var(--background-color);
}

.measure-card__actions__learn-more {
  font-size: var(--font-size-small);
  font-weight: bold;
  padding-bottom: .2rem;
  margin-top: auto;
}
</style>
