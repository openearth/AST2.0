<template>
  <md-card :style="`border-left-color: ${measure.color.hex}`" class="measure-card">
    <md-card-header class="measure-card__header">
      <md-card-header-text class="measure-card__header-text">
        <h4 class="md-subheading measure-card__title">{{ measure.title }}</h4>
      </md-card-header-text>

      <div class="md-caption measure-card__tags">
        <md-chip v-if="measure.systemSuitability" class="md-body-2 measure-card__tag-suitability">
          {{ measure.systemSuitability.toFixed(1) }}
        </md-chip>
        <md-chip
          v-for="(score, index) in scores"
          :key="index"

          class="measure-card__tag">
          <md-icon :md-src="score.icon.url" class="measure-card__icon" />
        </md-chip>
      </div>

      <md-card-media class="measure-card__media">
        <img
          :src="measure.image.url"
          class="md-image measure-card__img"
          alt="">
      </md-card-media>
    </md-card-header>

    <md-card-actions v-if="interactive">
      <md-button :to="`/${$i18n.locale}/project/measures/${measure.slug}`" class="md-dense">{{ $t('learn_more') }}</md-button>
      <md-button class="md-raised md-primary md-dense" @click="chooseMeasure">{{ $t('choose') }}</md-button>
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
    interactive: {
      type: Boolean,
      default: true,
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

.measure-card__header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.measure-card  .measure-card__header-text {
  width: 100%;
  flex: 2 1 100%;
}

.measure-card__title {
  font-size: 18px;
}

.measure-card__media {
  width: 80px;
  margin-top: var(--spacing-default);
}

.measure-card__img {
  height: 100%;
  object-fit: contain;
}

.measure-card__tags {
  max-width: calc(100% - 100px);
  margin-top: var(--spacing-default);
  display: flex;
  flex-wrap: wrap;
}

.measure-card__tag-suitability,
.measure-card__tag {
  margin-top: .2rem;
}

.measure-card__tag {
  width: 32px;
  height: 32px;
  margin-right: .2rem;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 50%;
}

.measure-card__icon {
  text-align: center;
  vertical-align: middle;
}

.measure-card__icon svg > path {
  fill: #000 !important;
}

.measure-card__icon svg {
  max-width: 20px;
}
</style>
