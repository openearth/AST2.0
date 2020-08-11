<template>
  <article class="app-results-heatstress">
    <p
      class="app-results-heatstress__content"
    >
      {{ $t('heatstress_description') }}
    </p>
    <div
      v-if="heatstressLayers.length > 0"
      class="app-results-heatstress__content"
    >
      <md-list>
        <h2 class="kpi-group__title md-body-2">
          {{ $t('heatstress_title') }}
        </h2>

        <md-list-item
          v-for="(result, key) in heatstressResults"
          :key="key"
          class="kpi-group__kpi"
        >
          <span class="md-body-1 kpi-group__kpi-title">
            {{ $t(key) }}:
          </span>
          <p class="kpi-group__kpi-value">
            {{ roundValue(result) }} {{ unit('temperature') }}
          </p>
        </md-list-item>
      </md-list>
      <md-list
        class="app-results-heatstress__information"
      >
        <md-list-item>
          <md-button class="md-icon-button info-button">
            <md-icon>info</md-icon>
            <md-tooltip md-direction="top">
              {{ $t('heatstress_tooltip') }}
            </md-tooltip>
          </md-button>
        </md-list-item>
        <md-list-item v-for="layer in heatstressLayers" :key="layer.id">
          <div class="md-list-item-expand md-list-item-container">
            <div class="md-list-item-content">
              <span
                class="md-list-item-text app-results-heatstress-layers__title"
              >{{ layer.title }}</span>
              <md-switch
                :value="!layer.visible"
                @change="
                  value =>
                    switchHeatstressLayer({ id: layer.id, value: !!value })
                "
              />
            </div>
          </div>
        </md-list-item>
      </md-list>
    </div>
    <footer class="app-results-heatstress__footer">
      <div class="app-results-heatstress__footer-cta-wrapper">
        <md-button
          :disabled="isLoading || !hasAreas"
          class="app-results-heatstress__cta md-raised"
          @click="handleFetchData"
        >
          Bereken hittestress lagen
        </md-button>
        <md-progress-spinner
          v-if="isLoading"
          :md-diameter="30"
          :md-stroke="3"
          class="app-results-heatstress__loading-indicator"
          md-mode="indeterminate"
        />
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
  },
  data() {
    return {
      isLoading: false,
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
    switchHeatstressLayer(evt) {
      const layers = cloneDeep(this.heatstressLayers)
      const heatstressLayer = layers.find(layer => layer.id === evt.id)
      heatstressLayer.visible = evt.value
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

</style>
