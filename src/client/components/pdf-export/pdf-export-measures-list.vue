<template>
  <article class="pdf-export-measures-list">
    <h2 class="md-title">
      Beschrijving van toegepaste maatregelen
    </h2>
    <ul class="pdf-export-measures-list__list">
      <li
        v-for="{ measure } in measureCollection"
        :key="measure.measureId"
        :style="`border-color: ${measure.color.hex}`"
        class="pdf-export-measures-list__item"
      >
        <section>
          <h3 class="pdf-export-measures-list__item-title md-subheading">
            {{ measure.title }}
          </h3>
          <img
            :src="`${measure.image.url}?w=75&h=75`"
            width="75px"
            height="75px"
            class="pdf-export-measures-list__image"
            alt=""
          >
          <img
            v-if="measure.images[0]"
            class="pdf-export-measures-list__second-image"
            :src="`${measure.images[0].image.url}?h=150`"
          >
          <div class="md-body-1 pdf-export-measures-list__summary" v-html="measure.summary" />
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
.pdf-export-measures-list__list {
  list-style: none;
  padding: 0;
}

.pdf-export-measures-list__item {
  margin-top: 0.5cm;
  margin-bottom: 1cm;
  border-left: 0.2cm solid;
  padding-left: 0.25cm;
  min-height: calc(100px + 3rem);
  page-break-inside: avoid;
}

.pdf-export-measures-list__item:not(:nth-child(1+3)) {
  margin-left: 3vw;
}

.pdf-export-measures-list__item-title {
  margin-bottom: 0.25cm;
  font-weight: bold;
}

.pdf-export-measures-list__image {
  float: left;
  margin-right: 0.25cm;
  margin-bottom: 0.25cm;
}

.pdf-export-measures-list__second-image {
  float: right;
  margin-left: 0.25cm;
  margin-bottom: 0.25cm;
  transform: translateY(-1.5rem);
}
</style>
