<template>
  <aside class="measures">
    <header class="measures__header">
      <h2>Select a measure</h2>
    </header>

    <section class="measures__list-container">
      <div class="measures__options">
        <div class="search">
          <span v-if="searchValue === ''" class="search__search-icon" />
          <input
            v-model="searchValue"
            class="search__input"
            type="text"
            placeholder="Search">
          <button class="search__delete-icon" @click="clearSearch" />
        </div>
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
    clearSearch() {
      this.searchValue = ''
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

.measures__search {
  padding: 10px 8px;
  border-radius: var(--border-radius-small);
  box-shadow: none;
  border: 1px solid var(--text-light-color);
  font-size: 14px;
  width: 250px;
}

.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--spacing-half);
  height: 40px;
  background-color: var(--background-color);
  border-radius: var(--border-radius-small);
  border: 2px solid var(--text-color);
}

.search:focus-within {
  border-color: var(--action-color);
}

.search__search-icon {
  background-image: url('/images/search.svg');
  background-size: contain;
}

.search__delete-icon {
  background-color: var(--text-color);
  border-radius: 50%;
  background-size: 50%;
  background-image: url('/images/delete.svg');
}

.search__search-icon,
.search__delete-icon {
  width: 20px;
  height: 20px;
  background-position: center;
  background-repeat: no-repeat;
}

.search__input {
  flex-grow: 1;
  width: 230px;
  height: 100%;
  border-style: none;
  padding: 0 8px;
}

.search__input:focus {
  outline: none;
}
</style>
