<template>
  <article :style="`border-left-color: ${measure.color.hex}`" class="measure-bar">
    <header class="measure-bar__header">
      <h4 class="md-subheading measure-bar__title">{{ measure.title }}</h4>

      <section class="measure-bar__tags">
        <md-chip v-if="measure.systemSuitability" class="measure-bar__tag-suitability">
          {{ measure.systemSuitability.toFixed(1) }}
        </md-chip>
        <md-chip
          v-for="(score, index) in scores"
          :key="index"

          class="measure-bar__tag">
          <md-icon :md-src="score.icon.url" class="measure-bar__icon" />
        </md-chip>
      </section>
    </header>

    <figure class="measure-bar__media">
      <img
        :src="measure.image.url"
        class="measure-bar__img"
        alt="">
    </figure>

    <footer v-if="interactive" class="measure-bar__footer">
      <md-button :to="`/${$i18n.locale}/project/measures/${measure.slug}`" class="md-dense">{{ $t('learn_more') }}</md-button>
      <md-button class="md-raised md-primary md-dense" @click="chooseMeasure">{{ $t('choose') }}</md-button>
    </footer>
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
.measure-bar {
  position: relative;
  height: 100%;
  padding: var(--spacing-default) var(--spacing-default) var(--spacing-half) var(--spacing-default);
  border-left-width: 5px;
  border-left-style: solid;
  border-bottom: 1px solid var(--neutral-color--medium);
}

@media screen and (min-width: 1200px) {
  .measure-bar {
    display: flex;
    flex-wrap: wrap;
  }
}

.measure-bar__header {
  width: 100%;
  order: 2;
}

@media screen and (min-width: 1200px) {
  .measure-bar__header {
    width: auto;
    max-width: calc(100% - 100px);
    flex-grow: 2;
  }
}

.measure-bar__title {
  font-size: 18px;
}

.measure-bar__media {
  width: 80px;
  margin-top: var(--spacing-default);
  margin-right: 0;
  margin-left: 0;
  order: 1;
}

@media screen and (min-width: 1200px) {
  .measure-bar__media {
    margin-top: 0;
    margin-right: var(--spacing-default);
  }
}

.measure-bar__img {
  height: 100%;
  object-fit: contain;
}

.measure-bar__tags {
  margin-top: var(--spacing-half);
  display: flex;
  flex-wrap: wrap;
}

.measure-bar__tag-suitability,
.measure-bar__tag {
  margin-top: .2rem;
}

.measure-bar__tag {
  width: 32px;
  height: 32px;
  margin-right: .2rem;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 50%;
}

.measure-bar__icon {
  text-align: center;
  vertical-align: middle;
}

.measure-bar__icon svg > path {
  fill: #000 !important;
}

.measure-bar__icon svg {
  max-width: 20px;
}

.measure-bar__footer {
  width: 100%;
  text-align: right;
  order: 4;
}
</style>
