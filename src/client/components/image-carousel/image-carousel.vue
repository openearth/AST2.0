<template>
  <carousel
    :per-page="1"
    :navigation-enabled="true"
    class="image-carousel">
    <slide
      v-for="(image, index) in images"
      :key="index"
      :data-index="index"
      :data-name="`image-${index}`">

      <fixed-ratio
        :height="2"
        :width="3"
        comp-inner="figure"
      >
        <img :src="image.image.url" class="md-image" >
      </fixed-ratio>
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
  margin-bottom: var(--spacing-double);
}

.image-carousel img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
