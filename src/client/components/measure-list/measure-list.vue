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
            @click="sortType = ALPHA">
            <svg
              class="measure-list__sort-icon"
              xmlns:svg="http://www.w3.org/2000/svg"
              version="1.1"
              viewBox="0 0 6.3499999 6.3500002">
              <g fill="currentColor" transform="translate(0 -290.65)">
                <path
                  transform="translate(-.53)"
                  d="M2.866 293.36H2.54l-.226-.644h-.998l-.227.643H.777l.84-2.308h.41zm-.648-.908l-.404-1.133-.406 1.133z"/>
                <path
                  transform="translate(-.53)"
                  d="M2.815 296.456H1.014v-.285l1.415-1.75H1.066v-.273h1.715v.277l-1.43 1.758h1.464z"/>
                <rect
                  width="2.799999"
                  height="0.7087056"
                  x="3.0592444"
                  y="291.94455"/>
                <rect
                  width="0.99999917"
                  height="0.70870608"
                  x="3.0592444"
                  y="295.18097"/>
                <rect
                  width="1.8999989"
                  height="0.70870584"
                  x="3.0592444"
                  y="293.56277"/>
              </g>
            </svg>
          </md-button>
          <md-button
            :class="{'md-primary': sortType === SYSTEM_SUITABILITY}"
            class="md-icon-button"
            @click="sortType = SYSTEM_SUITABILITY">
            <svg
              class="measure-list__sort-icon"
              xmlns:svg="http://www.w3.org/2000/svg"
              version="1.1"
              viewBox="0 0 6.3499999 6.3500002">
              <g fill="currentColor" transform="translate(0 -290.65)">
                <path
                  transform="translate(-.53)"
                  d="M2.545 292.066q0 .302-.07.549-.068.246-.207.42-.141.177-.354.273-.212.096-.499.096-.08 0-.152-.009-.07-.008-.127-.026v-.296h.016q.045.023.127.044.082.02.183.02.342 0 .536-.204.196-.206.227-.567-.145.086-.272.124-.127.037-.277.037-.143 0-.26-.028-.114-.028-.23-.109-.137-.094-.206-.24-.069-.146-.069-.349 0-.353.233-.575.233-.222.567-.222.168 0 .31.053.143.051.25.155.132.129.203.332.071.201.071.522zM2.232 292q0-.24-.05-.386-.049-.145-.136-.226-.073-.07-.156-.1-.084-.03-.182-.03-.223 0-.353.14-.129.139-.129.392 0 .147.042.24t.141.163q.07.048.154.065.083.015.186.015.12 0 .245-.032.124-.033.232-.095l.003-.064q.003-.032.003-.082z"/>
                <path
                  transform="translate(-.53)"
                  d="M2.452 295.301q0 .622-.196.913-.193.29-.603.29-.415 0-.607-.294-.191-.295-.191-.906 0-.615.194-.908.193-.295.604-.295.416 0 .606.3.193.297.193.9zm-.408.704q.054-.126.073-.294.02-.171.02-.41 0-.235-.02-.409-.019-.174-.075-.295-.054-.119-.148-.18-.093-.06-.24-.06-.146 0-.243.06-.094.061-.15.184-.053.114-.073.299-.018.184-.018.404 0 .242.017.405.017.163.073.291.05.121.144.185.094.064.25.064.145 0 .241-.061.096-.06.149-.183z"/>
                <rect
                  width="2.799999"
                  height="0.7087056"
                  x="3.0592444"
                  y="291.94455"/>
                <rect
                  width="0.99999917"
                  height="0.70870608"
                  x="3.0592444"
                  y="295.18097"/>
                <rect
                  width="1.8999989"
                  height="0.70870584"
                  x="3.0592444"
                  y="293.56277"/>
              </g>
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

.measure-list__sort-icon {
  width: 100%;
}
</style>
