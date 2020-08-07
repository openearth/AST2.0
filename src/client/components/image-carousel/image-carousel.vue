<template>
  <carousel
    :per-page="1"
    :navigation-enabled="true"
    class="image-carousel"
  >
    <slide
      v-for="(image, index) in images"
      :key="index"
      :data-index="index"
      :data-name="`image-${index}`"
    >
      <fixed-ratio
        :height="2"
        :width="3"
        comp-inner="figure"
      >
        <img :src="image.image.url" class="md-image">
      </fixed-ratio>
      <p
        v-if="image.image.copyright || image.image.author || image.source"
        class="image-carousel__caption"
      >
        <span
          v-if="image.image.copyright"
          class="image-carousel__caption-entry"
        >
          {{ image.image.copyright }}
        </span>
        <span
          v-if="image.image.author"
          class="image-carousel__caption-entry"
        >
          {{ image.image.author }}
        </span>
        <span
          v-if="image.source"
          class="image-carousel__caption-entry"
        >
          {{ image.source }}
        </span>
      </p>
    </slide>
  </carousel>
</template>

<script>
import { FixedRatio } from '~/components'

export default {
  components: { FixedRatio },
  props: {
    images: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style>
.image-carousel {
  position: relative;
  margin-bottom: var(--spacing-double);
  z-index: 1;
}

.image-carousel .VueCarousel-slide {
  position: relative;
}

.image-carousel .fixed-ratio {
  z-index: 1;
}

.image-carousel__caption {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 2;
  padding: calc( var(--spacing-half) * 0.25) var(--spacing-half);
  background-color: rgba(255, 255, 255, 0.9);
}

.image-carousel__caption-entry {
  display: inline-block;
  font-size: var(--font-size-extra-small);
}

.image-carousel__caption-entry:not(:last-child):after {
  content: ',';
  display: inline-block;
  margin-right: 0.3em;
}

.image-carousel img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
