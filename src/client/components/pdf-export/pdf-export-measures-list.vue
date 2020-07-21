<template>
  <article class="pdf-export-measures-list">
    <h2>Measure list</h2>
    <ul>
      <li v-for="{ measure } in measureCollection" :key="measure.measureId">
        <section>
          <h3>{{ measure.title }}</h3>
          <img
            :src="measure.image.url"
            :width="measure.image.width"
            :height="measure.image.height"
            class="pdf-export-measures-list__image"
            alt="">
          <div v-html="measure.summary" />
        </section>
      </li>
    </ul>
  </article>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('project', ['measureCollection']),
  },
}
</script>

<style>
.pdf-export-measures-list__image {
  max-width: 100px;
  max-height: 100px;
}
</style>
