<template>
  <aside class="measures">
    <header class="measures__header">
      <h2>Select a measure</h2>
    </header>

    <section class="measures__list-container">
      <div class="measures__options">
        <input
          v-model="searchValue" 
          type="text"
          placeholder="search something">
        <button class="button" @click="sortItems">{{ !isAlphabeticallyOrdered ? 'A-z' : 'Default' }}</button>
      </div>
      <ul class="measures__list">
        <li
          v-for="measure in filteredMeasuresList"
          :key="measure.id"
          class="measures__list__item">
          
          <measure-card :measure="measure" :scores="scoresArray" />
        </li>
      </ul>
    </section>
  </aside>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import { MeasureCard } from '~/components'

export default {
  components: { MeasureCard },
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
  margin-bottom: var(--spacing-double);
}

.measures__list-container {
  width: 700px;
}

.measures__options {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-default);
  padding: var(--spacing-default);
  background-color: var(--neutral-color);
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
