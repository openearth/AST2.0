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
import { mapState, mapGetters } from "vuex"
import { MeasureList } from '~/components'
import MapEventBus, { REDRAW } from "~/lib/map-event-bus";

export default {
  components: { MeasureList },
  data() {
    return {
      isAlphabeticallyOrdered: false,
      searchValue: '',
    }
  },
  computed: {
    ...mapState('data', ['measures']),
    ...mapGetters('data/measures', ['workspaceMeasures']),
    ...mapGetters('selectedAreas', { selectedFeatures: 'features' }),
    ...mapGetters('data/measures', ['measureById']),
    filteredMeasuresList() {
      return this.workspaceMeasures.filter(item => item.title.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1)
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
      const measure = this.measureById(measureId)
      this.$store.dispatch('project/setAreaMeasure', { features: this.selectedFeatures, measure })
      this.$router.push(`/${this.$i18n.locale}/project/areas/`).catch(() => {})
    },
  },
}
</script>

<style>
</style>
