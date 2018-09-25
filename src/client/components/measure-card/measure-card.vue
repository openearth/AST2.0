<template>
  <md-card class="measure-card">
    <md-card-media md-ratio="16:9">
      <img
        :src="measure.image.url"
        class="md-image measure-card__img"
        alt="">
    </md-card-media>

    <md-card-content :style="`border-top-color: ${measure.color.hex}`" class="measure-card__content">
      <div class="md-subheading">{{ measure.title }}</div>
      <div class="md-subhead">{{ scoresString }}</div>
    </md-card-content>

    <md-card-actions>
      <md-button>Learn More</md-button>
      <md-button class="md-primary" @click="chooseMeasure">Choose</md-button>
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
  },
  computed: {
    scoresString() {
      return this.scores.join(' - ')
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
}

.measure-card__content {
  border-top-width: 5px;
  border-top-style: solid;
  flex: 1;
}

.measure-card__img {
  height: 100%;
  object-fit: contain;
}
</style>
