<template>
  <div>
    <md-toolbar md-elevation="0">
      <span class="md-title">{{ $t('measures') }}</span>
    </md-toolbar>

    <measure-list
      :measures="filteredMeasuresList"
      @choose="onChooseMeasure"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex"
import { MeasureCard, SearchInput, MeasureList } from '~/components'
import MapEventBus, { REDRAW } from "~/lib/map-event-bus";

export default {
  components: { MeasureCard, SearchInput, MeasureList },
  data() {
    return {
      isAlphabeticallyOrdered: false,
      searchValue: '',
    }
  },
  computed: {
    ...mapState('data', ['measures']),
    ...mapGetters('data/measures', ['orderedMeasures', 'measuresBySystemSuitability']),
    ...mapGetters('selectedAreas', { selectedFeatures: 'features' }),
    measuresList() {
      return this.isAlphabeticallyOrdered
        ? this.orderedMeasures
        : this.measuresBySystemSuitability || this.measures
    },
    filteredMeasuresList() {
      return this.measuresList.filter(item => item.title.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1)
    },
  },
  mounted() {
    MapEventBus.$emit(REDRAW)
  },
  methods: {
    sortItems () {
      this.isAlphabeticallyOrdered = !this.isAlphabeticallyOrdered
    },
    searchMeasures(val) {
      this.searchValue = val
    },
    onChooseMeasure(measureId) {
      const measure = this.orderedMeasures.find(measure => measure.measureId === measureId)
      this.$store.dispatch('project/setAreaMeasure', { features: this.selectedFeatures, measure })
      this.$router.push(`/${this.$i18n.locale}/project/areas/`).catch(err => {})
    },
  },
}
</script>

<style>
</style>
