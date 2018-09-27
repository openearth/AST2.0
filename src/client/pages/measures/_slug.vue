<template>
  <div class="measure">
    <h2 class="measure__title">{{ measure.title }}</h2>
    <nuxt-link :to="`/${$i18n.locale}/measures`" class="measure__link">Back to measures list</nuxt-link>
    <rich-text :text="measure.summary" />
    <div class="measure__carousel">
      <div
        v-for="(image, index) in measure.images"
        :key="index"
        :class="itemClass(index)"
        class="carousel__item">
        <img :src="image.image.url" >
      </div>
    </div>
    <button @click="previousImage">prev</button>
    <button @click="nextImage">next</button>
    <rich-text :text="measure.content" />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import { RichText, ResponsiveImage, SearchInput, MeasureList } from '~/components'

export default {
  components: { SearchInput, MeasureList, RichText, ResponsiveImage },
  asyncData ({ params }) {
    return { slug: params.slug }
  },
  data() {
    return {
      currentIndex: 0,
    }
  },
  computed: {
    ...mapGetters('data/measures', ['measureDetails']),
    measure() { return this.measureDetails(this.slug)},
  },
  methods: {
    itemClass(index) {
      if (index === this.currentIndex) {
        return 'carousel__item--active'
      }

      if (index < this.currentIndex) {
        return 'carousel__item--seen'
      }

      return ''
    },
    nextImage() {
      if (this.currentIndex === (this.measure.images.length - 1)) {
        return this.currentIndex = 0
      }

      this.currentIndex++
    },
    previousImage() {
      if (this.currentIndex === 0) {
        return this.currentIndex = this.measures.length - 1
      }

      this.currentIndex--
    },
  },
}
</script>

<style>
.measure {
  padding: var(--spacing-double);
  position: relative;
}

.measure__link {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.measure__title {
  margin-top: 1.5rem;
}

.measure__carousel {
  height: 400px;
  width: 100%;
  position: relative;
  display: inline-block;
  overflow: hidden;
}

.carousel__item {
  position: absolute;
  transform: translateX(100%);
  width: 100%;
  height: 400px;
  background-color: #ccc;
  transition: transform .5s ease-in-out;
}

.carousel__item--active {
  transform: translateX(0);
  transition: transform .5s ease-in-out;
}

.carousel__item--seen {
  transform: translateX(-100%);
  transition: transform .5s ease-in-out;
}

.carousel__item img {
  object-fit: cover;
}
</style>
