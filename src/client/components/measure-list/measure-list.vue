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
            :class="{'md-primary': sortFeatured === true}"
            class="md-icon-button"
            @click="sortFeatured = !sortFeatured">
            <md-icon v-if="featureSorted">star_border</md-icon>
            <md-icon v-else>star_border</md-icon>
          </md-button>

          <div class="measure-list__filter-seperator" />

          <md-button
            :class="{'md-primary': sortType === ALPHA}"
            class="md-icon-button"
            @click="sortHandler(ALPHA)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 6.35 6.35"
              height="24"
              width="24">
              <path
                style="-inkscape-font-specification:'Roboto Condensed, Bold'"
                d="M2.635 2.71h-.616l-.16-.468h-.855l-.16.467h-.6L1.097.401h.685zm-.92-.89L1.433.99l-.284.828z"
                fill="currentColor"
                stroke-width=".265"/>
              <path
                style="-inkscape-font-specification:'Roboto Condensed, Bold'"
                d="M2.52 5.1q0 .167-.068.298-.067.132-.185.22-.136.101-.3.145-.163.043-.414.043H.545V3.498h.896q.28 0 .408.018.13.019.257.083.132.066.196.18.065.111.065.255 0 .168-.089.296-.088.127-.25.199v.012q.227.045.359.186.133.141.133.372zm-.763-.95q0-.057-.03-.114-.027-.058-.1-.086-.065-.024-.163-.026-.096-.003-.27-.003h-.057v.488h.093q.141 0 .24-.005.1-.005.157-.03.08-.036.106-.092.024-.057.024-.132zm.146.94q0-.11-.043-.169-.042-.06-.144-.09-.07-.02-.193-.022-.122-.002-.255-.002h-.13v.576h.043q.25 0 .36-.002.108-.002.2-.04.092-.04.126-.103.036-.065.036-.149z"
                fill="currentColor"
              />
              <path fill="currentColor" d="M3.059 1.295h2.8v.709h-2.8zM3.059 4.531h1v.709h-1zM3.059 2.913h1.9v.709h-1.9z"/>
            </svg>
          </md-button>
          <md-button
            :class="{'md-primary': sortType === SYSTEM_SUITABILITY}"
            class="md-icon-button"
            @click="sortHandler(SYSTEM_SUITABILITY)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 6.35 6.35"
              height="24"
              width="24">
              <path
                style="-inkscape-font-specification:'Roboto Condensed, Bold'"
                d="M2.257 1.425q0 .29-.075.54-.074.25-.226.42-.165.185-.408.278-.243.091-.567.091-.115 0-.248-.014-.134-.014-.176-.025v-.454H.62q.047.022.132.047.087.024.236.024.12 0 .237-.03.116-.03.2-.095.092-.07.15-.174.06-.105.08-.252-.135.077-.252.119-.114.04-.286.04-.13 0-.25-.03-.118-.033-.216-.1-.128-.092-.206-.24-.076-.15-.076-.379 0-.37.258-.603.259-.234.677-.234.216 0 .382.058.167.055.288.172.141.133.212.34.072.205.072.502zm-.594-.086q0-.19-.037-.31-.036-.123-.1-.19-.045-.05-.103-.07-.06-.023-.124-.023-.061 0-.117.022-.054.02-.105.071-.048.05-.08.13-.029.081-.029.193 0 .108.033.183.032.073.09.116.054.042.127.059.074.017.161.017.07 0 .152-.017.082-.019.127-.037l.002-.048q.003-.033.003-.096z"
                fill="currentColor"
                stroke-width=".265"/>
              <path
                style="-inkscape-font-specification:'Roboto Condensed, Bold'"
                d="M2.197 4.651q0 .292-.053.523-.052.23-.164.376-.115.15-.295.228-.18.076-.443.076-.259 0-.442-.077-.183-.078-.296-.23-.115-.152-.166-.376-.051-.227-.051-.518 0-.3.053-.523.052-.221.167-.375.115-.152.298-.228.183-.076.437-.076.265 0 .445.08.18.077.294.232.114.152.165.375.05.222.05.513zm-.6 0q0-.418-.082-.595-.082-.178-.273-.178-.19 0-.273.178-.082.177-.082.598 0 .411.084.593.083.181.271.181t.271-.181q.084-.182.084-.596z"
                fill="currentColor"
                stroke-width=".265"/>
              <path fill="currentColor" d="M3.059 1.295h2.8v.709h-2.8zM3.059 4.531h1v.709h-1zM3.059 2.913h1.9v.709h-1.9z"/>
            </svg>
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
import { mapGetters } from "vuex";
import { MeasureCard } from "..";
import TextInput from '../text-input'

const SYSTEM_SUITABILITY = 'system-suitability'
const ALPHA = 'alpha'
const FEATUERD = 'featured'

export default {
  components: { MeasureCard, TextInput },
  props: {
    measures: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    SYSTEM_SUITABILITY,
    ALPHA,
    FEATUERD,
    searchValue: '',
    sortType: SYSTEM_SUITABILITY,
    sortFeatured: true,
  }),
  computed: {
    ...mapGetters({ selectedType: 'selectedAreas/selectedGeometryType' }),
    systemSuitabilitySortedMeasures() {
      return [...this.measures].sort((a, b) => {
        if (a.systemSuitability < b.systemSuitability) {
          return 1
        }
        if (a.systemSuitability > b.systemSuitability) {
          return -1
        }
        return 0
      })
    },
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
    featureSorted() {
      const list = this.sortType === SYSTEM_SUITABILITY
        ? this.systemSuitabilitySortedMeasures
        : this.alphaSortedMeasures

      if (this.sortFeatured) {
        const featured = list.filter(({ featured }) => featured === true)
        const nonfeatured = list.filter(({ featured }) => featured === false)
        return [...featured, ...nonfeatured]
      } else {
        return list
      }
    },
    sortedMeasures() {
      return this.alphaSorted
        ? this.alphaSortedMeasures
        : this.systemSuitabilitySortedMeasures
    },
    filteredMeasures() {
      const searchRE = new RegExp(this.searchValue, 'i')
      const types = {
        'Polygon': 'canDrawPolygon',
        'LineString': 'canDrawPolyline',
        'Point': 'canDrawPoint',
      }
      const selectedType = types[this.selectedType]
      const showAll = this.selectedType === 'all'

      const searchFiltered = list => list
        .filter(measure => measure[selectedType] === true || showAll)
        .filter(measure => measure.title.match(searchRE))

      return searchFiltered(this.featureSorted)
    },
  },
  methods: {
    choose(value) {
      this.$emit('choose', value)
    },
    sortHandler(selected) {
      this.sortType = this.sortType === selected
       ? SYSTEM_SUITABILITY
       : selected
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

.measure-list__filter-seperator {
  border-right: 1px solid grey;
  height: var(--spacing-double);
  width: 1px;
  opacity: 0.5;
}
</style>
