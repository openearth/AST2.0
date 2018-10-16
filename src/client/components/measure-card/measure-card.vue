<template>
  <md-card :style="`border-left-color: ${measure.color.hex}`" class="measure-card">
    <md-card-header>
      <md-card-header-text>
        <div class="md-subheading measure-card__title">{{ measure.title }}</div>
        <div class="md-caption measure-card__tags"><em>{{ scoresString }}</em></div>
        <md-chip v-if="measure.systemSuitability" class="md-body-2">{{ measure.systemSuitability.toFixed(1) }}</md-chip>
      </md-card-header-text>

      <md-card-media>
        <img
          :src="measure.image.url"
          class="md-image measure-card__img"
          alt="">
      </md-card-media>
    </md-card-header>

    <md-card-actions>
      <md-button :to="`/${$i18n.locale}/project/measures/${measure.slug}`">{{ $t('learn_more') }}</md-button>
      <md-button class="md-primary" @click="chooseMeasure">{{ $t('choose') }}</md-button>
    </md-card-actions>
  </md-card>
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
      const scores = this.scores.reduce((acc, curr) => {
        return [...acc, curr.title]
      }, [])
      return scores.join(' - ')
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
  align-items: space-between;
  justify-content: space-between;
  border-left-width: 5px;
  border-left-style: solid;
}

.measure-card__title {
  font-size: 20px;
}

.measure-card__img {
  height: 100%;
  object-fit: contain;
}

.measure-card__tags {
  margin-top: var(--spacing-half);
}
</style>
