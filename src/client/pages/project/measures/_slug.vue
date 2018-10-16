<template>
  <div class="measure">
    <div class="measure__actions">
      <nuxt-link :to="`/${$i18n.locale}/project/measures/`" class="md-link measure__link">&#x2190; {{ $t('back') }}</nuxt-link>
      <md-button
        :disabled="!selectedFeatures.length"
        class="md-raised md-primary"
        @click="() => onChoose(measure.measureId, measure.color.hex)">{{ $t('choose') }}</md-button>
    </div>

    <header class="measure__header">
      <div class="measure__image">
        <img :src="measure.image.url">
      </div>

      <div>
        <h2 class="md-title measure__title">{{ measure.title }}</h2>
        <md-chip
          v-for="tag in measure.climateEffectTags"
          :key="tag.key"
          class="measure__tag">{{ tag.title }}</md-chip>
      </div>
    </header>

    <rich-text :text="measure.summary" />

    <image-carousel :images="measure.images"/>

    <rich-text :text="measure.content" />

    <a
      :href="measure.externalLinkUrl"
      class="measure__external-link"
      target="_blank">{{ measure.externalLinkLabel }}</a>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import { RichText, FixedRatio, ImageCarousel } from '~/components'

export default {
  components: { RichText, FixedRatio, ImageCarousel },
  asyncData ({ params }) {
    return { slug: params.slug }
  },
  computed: {
    ...mapGetters('selectedAreas', { selectedFeatures: 'features' }),
    ...mapGetters('data/measures', ['measureDetails']),
    measure() { return this.measureDetails(this.slug)},
  },
  methods: {
    ...mapActions({ updateAreaProperties: 'project/updateAreaProperties' }),
    onChoose(id, color) {
      this.updateAreaProperties({
        features: this.selectedFeatures,
        properties: {
          measure: id,
          color,
          areaInflow: 1,
          areaDepth: 1,
          areaWidth: 1,
          areaRadius: 1,
        },
      })
      this.$router.push(`/${this.$i18n.locale}/project/areas`)
    },
  },
}
</script>

<style>
.measure {
  padding: var(--spacing-double);
  position: relative;
}

.measure__actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-double);
}

.measure__header {
  display: flex;
  margin-bottom: var(--spacing-double);
}

.measure__title {
  margin-bottom: var(--spacing-default);
}

.measure__image {
  width: 100px;
  margin-right: var(--spacing-double);
}

.measure__tag:not(:last-child) {
  margin-right: .2rem
}

.measure__external-link {
  margin-left: auto;
  display: block;
}
</style>
