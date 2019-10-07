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
            :class="{'md-primary': listView}"
            class="md-icon-button"
            @click="listView = !listView">
            <md-icon>list</md-icon>
          </md-button>
          <md-button
            :class="{'md-primary': alphaSorted}"
            class="md-icon-button"
            @click="alphaSorted = !alphaSorted">
            <md-icon>sort_by_alpha</md-icon>
          </md-button>
        </div>
      </div>

    </md-toolbar>

    <ul :class="{'measure-list__list-bars': listView}" class="measure-list__list">
      <template v-if="listView">
        <li
          v-for="measure in filteredMeasures"
          :key="measure.id"
          class="measure-list__item">
          <measure-bar
            :measure="measure"
            :scores="measure.climateEffectTags"
            @choose="choose"/>
        </li>
      </template>
      <template v-else>
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
      </template>

    </ul>
  </div>
</template>

<script>
import { MeasureCard, MeasureBar } from "..";
import TextInput from '../text-input'
export default {
  components: { MeasureCard, TextInput, MeasureBar },
  props: {
    measures: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    searchValue: '',
    alphaSorted: false,
    listView: false,
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
    sortedMeasures() {
      return this.alphaSorted
        ? this.alphaSortedMeasures
        : this.measures
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

.measure-list__list-bars {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-template-columns: repeat(auto-fill, 100%);
  grid-gap: 0;
}

@media screen and (min-width: 1400px) {
  .measure-list__list-bars {
    grid-template-columns: repeat(auto-fill, 50%);
  }
}

.measure-list__card {
  height: 100%;
}
</style>
