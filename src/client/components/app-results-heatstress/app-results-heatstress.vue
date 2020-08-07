<template>
  <article class="app-results-heatstress">
    <p
      v-if="heatstressLayers.length === 0"
      class="app-results-heatstress__content"
    >
      De gedetailleerde hittestress effecten worden berekend op basis van de
      actieve maatregelen. Na toevoegen of aanpassen van de maatregelen wordt de
      berekening uitgevoerd na het indrukken van onderstaande knop.
    </p>
    <div
      v-if="heatstressLayers.length > 0"
      class="app-results-heatstress__content"
    >
      <md-list>
        <span class="md-list-item-text">Heatstress</span>
        <md-button class="md-icon-button info-button">
          <md-icon>info</md-icon>
          <md-tooltip md-direction="top">
            Behulpzame tekst
          </md-tooltip>
        </md-button>
        <md-list-item v-for="layer in heatstressLayers" :key="layer.id">
          <div class="md-list-item-expand md-list-item-container">
            <div class="md-list-item-content">
              <span
                class="md-list-item-text app-results-heatstress-layers__title"
              >{{ layer.title }}</span
              >
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
          :disabled="isLoading"
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
import log from '../../lib/log'
import { mapMutations } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'

export default {
  props: {
    heatstressLayers: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isLoading: false,
    }
  },
  watch: {
    heatstressLayers() {
      this.isLoading = false
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

.app-results-heatstress__content {
  flex: 1;
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

.app-results-heatstress__cta.md-button.md-theme-default.md-raised:not([disabled]) {
  background-color: var(--nature-green-color);
  color: var(--neutral-color);
}

.app-results-heatstress__footer-cta-wrapper {
  position: relative;
}

.app-results-heatstress__loading-indicator {
  position: absolute;
  top: calc(
    50% - 15px
  ); /* 15px is half of the with. somehow translate does not have any effect */
  left: calc(
    50% - 25px
  ); /* 15px is half of the with. somehow translate does not have any effect */
  --md-theme-default-primary: var(--nature-green-color);
}

.app-results-heatstress__data-section {
  margin-bottom: var(--spacing-default);
}

.app-results-heatstress__section-title {
  margin-bottom: var(--spacing-half);
}
</style>
