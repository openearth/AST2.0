<template>
  <md-card :style="`border-left-color: ${measure.color.hex}`" class="measure-card">
    <md-card-header>
      <md-card-header-text>
        <div class="md-subheading measure-card__title">
          {{ measure.title }}
        </div>
      </md-card-header-text>

      <md-card-media>
        <img
          :src="measure.image.url"
          class="md-image measure-card__img"
          alt=""
        >
      </md-card-media>
    </md-card-header>

    <md-card-content>
      <div class="md-caption measure-card__tags">
        <md-chip v-if="measure.systemSuitability" class="md-body-2">
          {{ measure.systemSuitability.toFixed(1) }}
          <md-tooltip md-direction="top">
            {{ $t('tooltip_system_suitability') }}
          </md-tooltip>
        </md-chip>
        <md-chip
          v-for="(score, index) in scoresWithImageProxy"
          :key="index"
          class="measure-card__tag"
        >
          <md-icon :md-src="score.icon.url" class="measure-card__icon" />
          <md-tooltip md-direction="top">
            {{ inferScoreTooltip(score.key) }}
          </md-tooltip>
        </md-chip>
        <md-chip v-if="measure.featured === true" class="measure-card__tag">
          <md-icon class="measure-card__icon">
            star
          </md-icon>
          <md-tooltip md-direction="top">
            {{ $t('tooltip_featured_measure') }}
          </md-tooltip>
        </md-chip>
      </div>
    </md-card-content>

    <md-card-actions v-if="interactive">
      <md-button :to="`/${$i18n.locale}/project/measures/${measure.slug}`" class="md-dense">
        {{ $t('learn_more') }}
      </md-button>
      <md-button
        :disabled="measure.measureId === '0'"
        class="md-accent md-raised md-dense"
        @click="chooseMeasure"
      >
        {{ $t('choose') }}
      </md-button>
    </md-card-actions>
  </md-card>
</template>

<script>
export default {
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
    scoresWithImageProxy() {
      return this.scores.map(score => {
        const iconUrl = process.env.NODE_ENV === 'development'
          ? score.icon.url
          : score.icon.url.replace('https://www.datocms-assets.com/', '/dato-assets/')

        return { ...score, icon: { url: iconUrl } }
      })
    },
  },
  methods: {
    chooseMeasure() {
      // TODO show add measure to selected area
      this.$emit('choose', this.measure.measureId)
    },
    inferScoreTooltip(key) {
      const tooltipKey = key
        .split(/[\s_-]+/)
        .map(word => word.toLowerCase())
        .join('_')
      return this.$t(`tooltip_${ tooltipKey }`)
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
}

/* Vue Material Overrides */
.measure-card .md-card-header {
  padding: var(--spacing-half);
}

.measure-card .md-card-header .md-card-media {
  margin-left: var(--spacing-half);
}

.measure-card .md-card-content {
  padding: 0 var(--spacing-half);
}

.measure-card .md-chip {
  transition: none !important;
}
</style>
