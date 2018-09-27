<template>
  <div>
    <h2>Measure details</h2>
    <pre>{{ measure }}</pre>
    <nuxt-link :to="`/${$i18n.locale}/measures`">Back</nuxt-link>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import { RichText, SearchInput, MeasureList } from '~/components'

export default {
  components: { SearchInput, MeasureList },
  asyncData ({ params }) {
    return { slug: params.slug }
  },
  computed: {
    ...mapGetters('data/measures', ['measureDetails']),
    measure() { return this.measureDetails(this.slug)},
  },
}
</script>

<style>
</style>
