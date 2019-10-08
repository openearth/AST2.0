<template>
  <div>
    <md-toolbar md-elevation="0">
      <div class="md-toolbar-row">
        <div class="md-toolbar-section-start">
          <text-input
            :value="searchValue"
            :on-change="value => searchValue = value"
            md-clearable
            label="search" />
        </div>

        <div class="md-toolbar-section-end">
          <md-button
            :class="{'md-primary': featureSorted}"
            class="md-icon-button"
            @click="sortHandler('featureSorted')">
            <md-icon v-if="featureSorted">star</md-icon>
            <md-icon v-else>star_border</md-icon>
          </md-button>

          <md-button
            :class="{'md-primary': alphaSorted}"
            class="md-icon-button"
            @click="sortHandler('alphaSorted')">
            <md-icon>sort_by_alpha</md-icon>
          </md-button>
        </div>
      </div>

    </md-toolbar>

    <ul class="measure-list__list">
      <li
        v-for="measure in filteredMeasures"
        :key="measure.id"
        class="measure-list__item">
        <measure-card
          :measure="measure"
          :scores="measure.climateEffectTags"
          class="measure-list__card"
          @choose="choose"/>
      </li>
    </ul>
  </div>
</template>

<script>
import { MeasureCard } from "..";
import TextInput from '../text-input'
export default {
  components: { MeasureCard, TextInput },
  props: {
    measures: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    searchValue: '',
    alphaSorted: false,
    featureSorted: true,
  }),
  computed: {
    alphaSortedMeasures() {
      return [...this.measures].sort((a, b) => {
        if (a.title > b.title) {
          return 1
        }
        if (a.title < b.title) {
          return -1
        }
        return 0
      })
    },
    systemSuitabilitySortedMeasures() {
      return [...this.measures].sort((a, b) => {
        if (a.systemSuitability > b.systemSuitability) {
          return 1
        }
        if (a.systemSuitability < b.systemSuitability) {
          return -1
        }
        return 0
      })
    },
    sortedMeasures() {
      return this.alphaSorted
        ? this.alphaSortedMeasures
        : this.systemSuitabilitySortedMeasures
    },
    filteredMeasures() {
      return this.sortedMeasures.filter(measure => {
        return measure.title.match(new RegExp(this.searchValue, 'i'))
      })
    },
  },
  methods: {
    choose(value) {
      this.$emit('choose', value)
    },
    sortHandler(selected) {
      const types = ['alphaSorted', 'featureSorted'];
      types.forEach( type => {
        this[type] = selected === type ? !this[type] : false
      })
    },
  },
}
</script>

<style>
.measure-list__list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-gap: var(--spacing-double);
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  padding: var(--spacing-default);
}

.measure-list__card {
  height: 100%;
}
</style>
