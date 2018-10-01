<template>
  <div class="measure">
    <div class="measure__actions">
      <nuxt-link :to="`/${$i18n.locale}/measures`" class="md-link measure__link">&#x2190; {{ $t('back') }}</nuxt-link>
      <md-button
        :disabled="!selectedFeatures.length"
        class="md-raised md-primary"
        @click="() => { updateAreaProperties({ features: selectedFeatures, properties: { measure: measure.measureId, color: measure.color.hex }})}">{{ $t('choose') }}</md-button>
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

    <carousel
      :per-page="1"
      class="measure__carousel">
      <slide
        v-for="(image, index) in measure.images"
        :key="index"
        :data-index="index"
        :data-name="`image-${index}`">

        <fixed-ratio :height="2" :width="3">
          <img :src="image.image.url" class="md-image" >
        </fixed-ratio>
      </slide>
    </carousel>

    <rich-text :text="measure.content" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import { RichText, FixedRatio } from '~/components'
import { Carousel, Slide } from 'vue-carousel'

export default {
  components: { RichText, FixedRatio, Carousel, Slide },
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

.measure__carousel {
  margin-bottom: var(--spacing-double);
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.measure__tag:not(:last-child) {
  margin-right: .2rem
}
</style>
