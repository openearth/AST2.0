<template>
  <aside class="measures">
    <header class="measures__header">
      <h2>Select a measure</h2>
    </header>

    <section v-if="selectedFeatures.length" class="measures__list-container">
      <div class="measures__options">
        <search-input
          :search-value="searchValue"
          @onSearch="searchMeasures"
        />
        <button class="button" @click="sortItems">{{ !isAlphabeticallyOrdered ? 'A-z' : 'Default' }}</button>
      </div>
      <ul class="measures__list">
        <li
          v-for="measure in filteredMeasuresList"
          :key="measure.id"
          class="measures__list__item">

          <measure-card
            :measure="measure"
            :scores="scoresArray"
            @choose="onChooseMeasure"/>
        </li>
      </ul>
    </section>

    <section v-else>
      <h1>Please select an area first</h1>
    </section>
  </aside>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex"
import { MeasureCard, SearchInput } from '~/components'

export default {
  components: { MeasureCard, SearchInput },
  data() {
    return {
      isAlphabeticallyOrdered: false,
      searchValue: '',
      scoresArray: [
        'Ground water',
        'Drought',
      ],
    }
  },
  computed: {
    ...mapState('data', ['measures']),
    ...mapGetters('data/measures', ['orderedMeasures']),
    ...mapGetters('selectedAreas', { selectedFeatures: 'features' }),
    measuresList() {
      return this.isAlphabeticallyOrdered
        ? this.orderedMeasures
        : this.measures
    },
    filteredMeasuresList() {
      return this.measuresList.filter(item => item.title.toLowerCase().indexOf(this.searchValue.toLowerCase()) !== -1)
    },
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
      this.$store.dispatch('project/updateAreaProperties', {
        features: this.selectedFeatures,
        properties: {
          measure: measureId,
          color: measure.color.hex,
        },
      })
      this.$router.push(`/${this.$i18n.locale}/areas`)
    },
  },
}
</script>

<style>
.measures {
  padding: var(--spacing-double);
  height: 100%;
  overflow: scroll;
  position: relative;
}

.measures__header {
  margin-bottom: var(--spacing-default);
}

.measures__list-container {
  width: 700px;
}

.measures__options {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: var(--spacing-default);
  border-bottom: 1px solid #e0e0e0;
}

.measures__list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0;
}

.measures__list__item {
  margin-bottom: var(--spacing-double);
  list-style-type: none;
}
</style>
