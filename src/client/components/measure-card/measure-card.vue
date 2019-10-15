<template>
  <div
    :style="`border-left-color: ${measure.color.hex}`"
    :class="{'measure-card__reduced': reduced}"
    class="measure-card"
  >
    <div class="measure-card__content">
      <h5 class="md-subheading measure-card__title">{{ measure.title }}</h5>

      <img
        v-if="!reduced"
        :src="measure.image.url"
        class="measure-card__media"
        alt="">

      <ul class="measure-card__tags">
        <li v-if="measure.systemSuitability" class="measure-card__tag measure-card__tag-float">
          {{ measure.systemSuitability.toFixed(1) }}
        </li>
        <li
          v-for="(score, index) in scoresWithImageProxy"
          :key="index"
          class="measure-card__tag">
          <!-- <md-icon :md-src="score.icon.url" class="measure-card__icon" /> -->
        </li>
        <li v-if="measure.featured === true" class="measure-card__tag">
          <!-- <md-icon class="measure-card__icon">
            star
          </md-icon> -->
        </li>
      </ul>
    </div>

    <div v-if="interactive" class="measure-card__actions">
      <!-- <md-button
        v-if="!reduced"
        :to="`/${$i18n.locale}/project/measures/${measure.slug}`"
        class="md-dense"
      >
        {{ $t('learn_more') }}
      </md-button> -->
      <!-- <md-button
        class="md-raised md-primary md-dense"
        @click="chooseMeasure"
      >
        {{ $t('choose') }}
      </md-button> -->
      <nuxt-link
        v-if="!reduced"
        :to="`/${$i18n.locale}/project/measures/${measure.slug}`"
      >
        {{ $t('learn_more') }}
      </nuxt-link>
      <button
        @click="chooseMeasure"
      >
        {{ $t('choose') }}
      </button>
    </div>
  </div>
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
    reduced: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    scoresString() {
      const scores = this.scores.reduce((acc, curr) => {
        return [...acc, curr.title]
      }, [])
      return scores.join(' - ')
    },
    scoresWithImageProxy() {
      return this.scores.map(score => {
        const iconUrl = score.icon.url.replace('https://www.datocms-assets.com/', '/dato-assets/')
        return { ...score, icon: { url: iconUrl } }
      })
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
.measure-card:not(.measure-card__reduced) {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--spacing-default);
  box-shadow: var(--shadow-wide-grey);
}

.measure-card.measure-card__reduced {
  display: flex;
  padding: 0;
  box-shadow: none;
}

/* ================================ content */
.measure-card:not(.measure-card__reduced) .measure-card__content {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-grow: 2;
}

.measure-card.measure-card__reduced .measure-card__content {
  width: auto;
  flex-grow: 2;
}

.measure-card__title {
  width: 100%;
}

/* ================================ tags */
.measure-card__tags {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  padding-left: 0;
  list-style-type: none;
}

.measure-card__tag {
  min-width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: cneter;
  margin-right: var(--spacing-small);

  background-color: var(--border-color);
  border-radius: 30px;
  list-style-type: none;
}

.measure-card__tag-float {
  padding-right: var(--spacing-small);
  padding-left: var(--spacing-small);
  line-height: 32px;
}

.measure-card__icon {
  width: 24px;
  height: 24px;
  user-select: none;
}

/* ================================ media */
.measure-card__media {
  display: block;
  width: 100px;
  height: auto;
}

/* ================================ actions */
.measure-card:not(.measure-card__reduced) .measure-card__actions {
  margin-top: var(--spacing-small);
  text-align: right;
}

.measure-card.measure-card__reduced .measure-card__actions {
  display: flex;
  flex-direction: column;
}

.measure-card.measure-card__reduced .measure-card__actions > * {
  width: 100%;
  margin-right: 0;
  margin-left: 0;
}

/* .measure-card {
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
  margin-top: var(--spacing-default);
  display: flex;
}

.measure-card__tag{
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: .2rem;
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
} */
</style>
