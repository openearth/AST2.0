<template>
  <div 
    :style="`border-top: 8px solid ${ measure.color.hex }`"
    class="measure-card">
    
    <div class="measure-card__text">
      <h3 class="measure-card__text__title">{{ measure.title }}</h3>
      <div class="measure-card__text__body" v-html="measure.body" />
    </div>
    
    <div class="measure-card__image">
      <img :src="measure.image.url">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    measure: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style>
.measure-card {
    max-width: 320px;
    background-color: white;
    box-shadow: 2px 2px 10px #ccc;
    margin-bottom: 2rem;
    padding: 1.5rem 1rem;
    list-style-type: none;
    display: flex;
  }

.measure-card__text {
  width: 70%;
  max-height: 200px;
  overflow: hidden;
}

.measure-card__text__title {
  margin-bottom: .5rem;
}

.measure-card__image {
  width: 30%;
}
</style>
