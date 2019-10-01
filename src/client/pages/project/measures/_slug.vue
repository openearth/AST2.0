<template>
  <div class="measure">
    <back-button class="measure__top">
      <md-button
        :disabled="!selectedFeatures.length"
        class="md-raised md-primary"
        @click="() => onChoose(measure)"
      >
        {{ $t('choose') }}
      </md-button>
    </back-button>

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
import { RichText, FixedRatio, ImageCarousel, BackButton } from '~/components'

export default {
  components: { RichText, FixedRatio, ImageCarousel, BackButton },
  asyncData ({ params }) {
    return { slug: params.slug }
  },
  computed: {
    ...mapGetters('selectedAreas', { selectedFeatures: 'features' }),
    ...mapGetters('data/measures', ['measureDetails']),
    measure() { return this.measureDetails(this.slug)},
  },
  methods: {
    ...mapActions({ setAreaMeasure: 'project/setAreaMeasure' }),
    onChoose(measure) {
      this.setAreaMeasure({ features: this.selectedFeatures, measure })
      this.$router.push(`/${this.$i18n.locale}/project/areas/`)
    },
    back() {
      this.$router.back()
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

.measure__top {
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
