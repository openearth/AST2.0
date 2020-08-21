<template>
  <article class="app-results-heatstress">
    <p
      class="app-results-heatstress__description"
      v-html="datoContent.heatstressDescription"
    />
    <div
      class="app-results-heatstress__content"
    >
      <md-list
        v-if="heatstressLayers.length > 0"
      >
        <h2 class="app-results-heatstress__title md-body-2">
          {{ datoContent.heatstressTitle }}
        </h2>
        <md-list-item
          v-for="(result, key) in heatstressResults"
          :key="key"
          class="app-results-heatstress__list"
        >
          <span class="md-body-1 app-results-heatstress__title">
            {{ datoContent[key] }} ({{ unit('temperature') }}):
          </span>
          <p class="app-results-heatstress__value">
            {{ roundValue(result) }}
          </p>
        </md-list-item>
      </md-list>
      <md-list
        v-if="heatstressLayers.length > 0"
        class="app-results-heatstress__information"
      >
        <md-list-item
          v-for="layer in heatstressLayers"
          :key="layer.id"
          class="app-results-heatstress__list"
        >
          <div class="md-list-item__container app-results-heatstress__list-container">
            <div class="md-list-item__content app-results-heatstress__list-item">
              <span
                class="md-list-item-text app-results-heatstress-layers__title"
              >{{ layer.title }}</span>
              <md-switch
                :value="!layer.visible"
                @change="value => switchHeatstressLayer({ id: layer.id, value: !!value })"
              />
              <md-button
                class="md-icon-button md-list-action"
                @click.stop="setExpanded(layer.id)"
              >
                <md-icon
                  :style="{
                    transform: expanded.includes(layer.id) ? 'rotate(180deg)' : 'rotate(0)'
                  }"
                >
                  keyboard_arrow_down
                </md-icon>
              </md-button>
            </div>
            <div
              :style="{height: expanded.includes(layer.id) ? 'auto' : '0px'}"
              class="md-list-expand"
            >
              <md-list>
                <md-list-item class="md-inset">
                  <img
                    :src="layer.legendUrl"
                    alt=""
                  >
                </md-list-item>
              </md-list>
            </div>
          </div>
        </md-list-item>
      </md-list>
    </div>
    <footer class="app-results-heatstress__footer">
      <small
        v-if="!hasAreas"
        class="app-results-heatstress__footer__message"
      >
        {{ datoContent.heatstressSelectMeasures }}
      </small>
      <div class="app-results-heatstress__buttons-wrapper">
        <md-button
          class="md-raised"
          :href="datoContent.heatstressDocumentationLinkAddress"
          target="_blank"
        >
          {{ datoContent.documentationLinkText }}
        </md-button>
        <div class="app-results-heatstress__footer-cta-wrapper">
          <md-button
            :disabled="isLoading || !hasAreas"
            class="md-raised md-accent"
            @click="handleFetchData"
          >
            {{ datoContent.heatstressCalculateButton }}
          </md-button>
          <md-progress-spinner
            v-if="isLoading"
            :md-diameter="30"
            :md-stroke="3"
            class="app-results-heatstress__loading-indicator"
            md-mode="indeterminate"
          />
        </div>
      </div>
    </footer>
  </article>
</template>

<script>
import { mapMutations } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'

export default {
  props: {
    heatstressLayers: {
      type: Array,
      default: () => [],
    },
    heatstressResults: {
      type: Object,
      default: () => {},
    },
    areas: {
      type: Array,
      default: () => [],
    },
    datoContent: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      isLoading: false,
      expanded: [],
    }
  },
  computed: {
    hasAreas() {
      const areas = this.areas.filter(area => !isEmpty(area.properties.apiData) && !area.properties.hidden)
      return areas.length > 0
    },
  },
  watch: {
    heatstressLayers() {
      if (this.heatstressLayers.length > 0) {
        this.isLoading = false
      }
    },
  },
  methods: {
    ...mapMutations({
      updateHeatstressLayers: 'project/updateHeatstressLayers',
    }),
    setExpanded(id) {
      if (this.expanded.includes(id)) {
        this.expanded = this.expanded.filter(ex => ex !== id)
      } else {
        this.expanded.push(id)
      }
    },
    switchHeatstressLayer(evt) {
      const layers = cloneDeep(this.heatstressLayers)
      const heatstressLayer = layers.find(layer => layer.id === evt.id)
      heatstressLayer.visible = evt.value
      // Set expanded depending on the switch
      if (!this.expanded.includes(evt.id) && evt.value) {
        this.expanded.push(evt.id)
      } else if (this.expanded.includes(evt.id) && !evt.value){
        this.expanded = this.expanded.filter(ex => !ex === evt.id)
      }

      this.updateHeatstressLayers(heatstressLayer)
    },
    handleFetchData() {
      this.isLoading = true
      this.$emit('fetch-data')
    },
    unit(...args) {
      return this.$store.getters['data/units/displayValue'](...args)
    },
    roundValue(value) {
      if (value >= 100) {
        return Math.round(value)
      } else {
        return Math.round(value * 100) / 100
      }
    },
  },
}
</script>

<style>
.app-results-heatstress {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.app-results-heatstress__description {
  flex-shrink: 1;
}

.app-results-heatstress__content  {
  flex: 1;
  padding: 0;
}

.app-results-heatstress__title {
  margin-bottom: var(--spacing-half);
}

.app-results-heatstress__list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  position: relative;
  margin-bottom: var(--spacing-half);
  padding: 0;
  margin: 0;
  min-height: 30px; /* overwrites material ui min-height */
}

.app-results-heatstress__value {
  margin-bottom: var(--spacing-half);
}

.app-results-heatstress__footer {
  display: grid;
  grid-template-columns: auto min-content;
  position: sticky;
  bottom: 0;
  z-index: 10;
  margin-left: calc(-1 * var(--spacing-default));
  width: calc(100% + (var(--spacing-default) * 2));
  padding: var(--spacing-half);
  border-top: 1px solid var(--border-color);
  background-color: var(--background-color);
}

.app-results-heatstress__buttons-wrapper,
.app-results-heatstress__footer-cta-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
}

.app-results-heatstress__loading-indicator {
  position: absolute;
  top: calc(50% - 15px); /* 15px is half of the with. somehow translate does not have any effect */
  left: calc(50% - 25px); /* 15px is half of the with. somehow translate does not have any effect */
  --md-theme-default-primary: var(--yellow-color);
}

info-button {
  position: absolute;
  right: 2px;
}

.md-list-item-content {
  padding-left: 0;
}

.app-results-heatstress__list-container {
  width: 100%;
  text-align: left;
}
.app-results-heatstress__list-item {
  padding: 0;
  display: flex;
  align-items: center;
}

</style>
