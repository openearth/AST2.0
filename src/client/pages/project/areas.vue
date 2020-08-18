<template>
  <aside>
    <md-toolbar md-elevation="0">
      <span class="md-title">{{ $t('selected_measures') }}</span>
    </md-toolbar>

    <md-card v-if="hasSelection">
      <div
        :style="`border-left-color: ${ combinedMeasure ? combinedMeasure.color.hex : 'transparent' }`"
        class="areas__item-content"
      >
        <md-card-header>
          <md-avatar class="areas__avatar">
            <img
              v-if="combinedMeasure"
              :src="combinedMeasure.image.url"
              alt="Avatar"
            >
          </md-avatar>

          <div class="md-title">
            {{ combinedFeature.properties.name }}
          </div>
          <div class="md-subhead areas__subhead">
            {{ combinedMeasure ? combinedMeasure.title : ' ' }}
          </div>
        </md-card-header>

        <md-card-content>
          <!-- Name input -->
          <text-input
            v-if="isSingleSelection"
            :label="$t('area_name')"
            :value="combinedFeature.properties.name"
            :on-change="name => updateAreaProperty({ id: feature.id, properties: { name }})"
          />

          <!-- Measure type input -->
          <span class="md-subheading">
            {{ $t('measure') }}
          </span>
          <div class="areas__choose-wrapper">
            <div class="areas__choose-content">
              <p v-if="combinedMeasure">
                {{ combinedMeasure.title }}
              </p>
              <md-button
                :to="`/${locale}/project/measures`"
                class="md-accent md-raised areas__choose-button"
              >
                {{ combinedMeasure ? $t('change_measure') : $t('choose_measure') }}
              </md-button>
            </div>
            <div v-if="combinedMeasure" class="areas__choose-icon">
              <img :src="combinedMeasure.image.url">
            </div>
          </div>

          <!-- Depth input -->
          <!-- <input-range
            v-if="combinedMeasure && getDefaultValueProperty('depth', 'show', combinedMeasure.defaultValues)"
            :value="inputValue(combinedFeature.properties.areaDepth, combinedFeature.properties.defaultDepth)"
            :min="getDefaultValueProperty('depth', 'min', combinedMeasure.defaultValues)"
            :max="getDefaultValueProperty('depth', 'max', combinedMeasure.defaultValues)"
            :label="$t('area_depth')"
            @change="updateValue('areaDepth', combinedFeature, $event)"
          >
            <template v-slot:info>
              <app-tooltip
                :message="$t('area_depth_info')"
                class="areas__info-button"
                direction="left"
              />
            </template>
          </input-range> -->

          <!-- Inflow input -->
          <!-- <input-range
            v-if="combinedMeasure && getDefaultValueProperty('inflow', 'show', combinedMeasure.defaultValues)"
            :value="inputValue(combinedFeature.properties.areaInflow, combinedFeature.properties.defaultInflow)"
            :min="getDefaultValueProperty('inflow', 'min', combinedMeasure.defaultValues)"
            :max="getDefaultValueProperty('inflow', 'max', combinedMeasure.defaultValues)"
            :label="$t('area_inflow')"
            @change="value => updateAreaProperties({ features: [combinedFeature], properties: { areaInflow: value }})"
          >
            <template v-slot:info>
              <app-tooltip
                :message="$t('area_inflow_info')"
                class="areas__info-button"
                direction="left"
              />
            </template>
          </input-range> -->

          <!-- Width input -->
          <!-- <input-range
            v-if="combinedMeasure && combinedFeature.geometry.type === 'LineString' && getDefaultValueProperty('width', 'show', combinedMeasure.defaultValues)"
            :value="inputValue(combinedFeature.properties.areaWidth, combinedFeature.properties.defaultWidth)"
            :min="getDefaultValueProperty('width', 'min', combinedMeasure.defaultValues)"
            :max="getDefaultValueProperty('width', 'max', combinedMeasure.defaultValues)"
            :label="$t('area_width')"
            @change="value => updateAreaProperties({ features: [combinedFeature], properties: { areaWidth: value }})"
          >
            <template v-slot:info>
              <app-tooltip
                :message="$t('area_width_info')"
                class="areas__info-button"
              />
            </template>
          </input-range> -->

          <!-- Radius input -->
          <!-- <input-range
            v-if="combinedMeasure && combinedFeature.geometry.type === 'Point' && getDefaultValueProperty('radius', 'show', combinedMeasure.defaultValues)"
            :value="inputValue(combinedFeature.properties.areaRadius, combinedFeature.properties.defaultRadius)"
            :min="getDefaultValueProperty('radius', 'min', combinedMeasure.defaultValues)"
            :max="getDefaultValueProperty('radius', 'max', combinedMeasure.defaultValues)"
            :label="$t('area_radius')"
            @change="value => updateAreaProperties({ features: [combinedFeature], properties: { areaRadius: value }})"
          >
            <template v-slot:info>
              <app-tooltip
                :message="$t('area_radius_info')"
                class="areas__info-button"
              />
            </template>
          </input-range> -->
        </md-card-content>

        <md-card-actions>
          <md-button @click="onDone">
            {{ $t('done') }}
          </md-button>
        </md-card-actions>
      </div>
    </md-card>
  </aside>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex';
import MapEventBus, { REDRAW, MODE, DELETE } from '../../lib/map-event-bus';
import InputRange from '../../components/input-range'
import TextInput from '../../components/text-input'
import AppTooltip from '~/components/app-tooltip'

export default {
  middleware: ['access-level-settings'],
  components: { InputRange, TextInput, AppTooltip },
  data() {
    return {
      visibleAreas: [],
      areaName: '',
    }
  },
  computed: {
    ...mapState('i18n', ['locale']),
    ...mapGetters('data/measures', ['measureById']),
    ...mapGetters({ selectedFeatures: 'selectedAreas/features' }),

    featuresWithMeasure() {
      return this.selectedFeatures.map(feature => ({
        feature,
        measure: this.measureById(feature.properties.measure),
      }))
    },

    hasSelection() {
      return this.selectedFeatures.length > 0
    },

    isSingleSelection() {
      return this.selectedFeatures.length === 1
    },

    isMultiSelection() {
      return this.selectedFeatures.length > 1
    },

    isEditableMultiSelection() {
      return true
    },

    combinedFeature() {
      if(this.isSingleSelection) {
        return this.selectedFeatures[0]
      }
      else {
        return null
      }
    },

    combinedMeasure() {
      if(this.isSingleSelection) {
        return this.measureById(this.selectedFeatures[0].properties.measure)
      }
      else {
        return null
      }
    },
  },
  mounted() {
    MapEventBus.$emit(REDRAW)
    MapEventBus.$on(DELETE, this.onDelete)
  },
  destroyed() {
    MapEventBus.$off(DELETE, this.onDelete)
  },
  methods: {
    ...mapActions({ updateAreaProperties: 'project/updateAreaProperties' }),
    ...mapMutations({ updateAreaProperty: 'project/updateAreaProperty' }),
    onDelete() {
      this.$router.push(`/${this.locale}/project/`).catch(() => {})
      MapEventBus.$emit(MODE, 'simple_select')
    },
    onDone() {
      this.$router.push(`/${this.locale}/project/`).catch(() => {})
      MapEventBus.$emit(MODE, 'simple_select')
    },
    getDefaultValueProperty(key, property, defaultValues) {
      const values = defaultValues.find(values => values.key.toLowerCase() === key)
      const value = values ? values[property] : ''
      return property === 'show' ? value : String(value)
    },
    inputValue(value, defaultValue) {
      let returnValue = value || defaultValue
      returnValue = value === '' ? value : returnValue
      return returnValue
    },
    updateValue(setting, feature, value) {
      this.updateAreaProperties({
        features: [ feature ],
        properties: {
          [setting]: value,
        },
      })
    },
  },
}
</script>

<style>
.areas__list {
  list-style: none;
  padding: var(--spacing-default);
}

.areas__item {
  margin-bottom: var(--spacing-default);
}

.areas__item-content {
  border-left-width: 5px;
  border-left-style: solid;
}

.areas__avatar {
  background-color: lightgrey;
}

.areas__choose-wrapper {
  display: flex;
  align-items: center;
  padding-bottom: var(--spacing-double);
}

.areas__choose-content {
  flex: 1;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-right: var(--spacing-default);
}

.areas__choose-button {
  margin-left: 0;
  margin-top: var(--spacing-default);
}

.areas__choose-icon {
  width: 100px;
  height: 100px;
  border: 5px solid lightgrey;
  border-radius: 3px;
}

.areas__choose-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: lightgrey;
}

.areas__subhead {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.areas__info-button {
  position: absolute;
  top: -9px;
  right: -40px;
}
</style>
