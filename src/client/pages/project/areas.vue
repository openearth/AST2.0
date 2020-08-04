<template>
  <aside>
    <md-toolbar md-elevation="0">
      <span class="md-title">{{ $t('selected_measures') }}</span>
    </md-toolbar>

    <ul class="areas__list">
      <li
        v-for="feature in selectedFeatures"
        :key="feature.id"
        class="areas__item"
      >
        <md-card>
          <div :style="`border-left-color: ${appliedMeasure ? appliedMeasure.color.hex : 'transparent'}`" class="areas__item-content">
            <md-card-header>
              <md-avatar class="areas__avatar">
                <img
                  v-if="appliedMeasure"
                  :src="appliedMeasure.image.url"
                  alt="Avatar"
                >
              </md-avatar>

              <div class="md-title">
                {{ feature.properties.name }}
              </div>
              <div class="md-subhead areas__subhead">
                {{ appliedMeasure ? appliedMeasure.title : '&nbsp;' }}
              </div>
            </md-card-header>

            <md-card-content class="areass__card-content">
              <text-input
                :label="$t('area_name')"
                :value="feature.properties.name"
                :on-change="name => updateAreaProperty({ id: feature.id, properties: { name }})"
              />

              <span class="md-subheading">{{ $t('measure') }}</span>
              <div class="areas__choose-wrapper">
                <div class="areas__choose-content">
                  <p v-if="appliedMeasure">
                    {{ appliedMeasure.title }}
                  </p>
                  <md-button
                    :to="`/${locale}/project/measures`"
                    class="md-primary md-raised areas__choose-button"
                  >
                    {{ appliedMeasure ? $t('change_measure') : $t('choose_measure') }}
                  </md-button>
                </div>
                <div v-if="appliedMeasure" class="areas__choose-icon">
                  <img :src="appliedMeasure.image.url">
                </div>
              </div>

              <input-range
                v-if="appliedMeasure"
                :value="inputValue(feature.properties.areaDepth, feature.properties.defaultDepth)"
                :min="getDefaultValueProperty('depth', 'min', appliedMeasure.defaultValues)"
                :max="getDefaultValueProperty('depth', 'max', appliedMeasure.defaultValues)"
                :label="$t('area_depth')"
                @change="value => updateAreaProperties({ features: [feature], properties: { areaDepth: value }})"
              >
                <template v-slot:info>
                  <app-tooltip
                    :message="$t('area_depth_info')"
                    class="areas__info-button"
                    direction="left"
                  />
                </template>
              </input-range>

              <input-range
                v-if="appliedMeasure"
                :value="inputValue(feature.properties.areaInflow, feature.properties.defaultInflow)"
                :min="getDefaultValueProperty('inflow', 'min', appliedMeasure.defaultValues)"
                :max="getDefaultValueProperty('inflow', 'max', appliedMeasure.defaultValues)"
                :label="$t('area_inflow')"
                @change="value => updateAreaProperties({ features: [feature], properties: { areaInflow: value }})"
              >
                <template v-slot:info>
                  <app-tooltip
                    :message="$t('area_inflow_info')"
                    class="areas__info-button"
                    direction="left"
                  />
                </template>
              </input-range>

              <input-range
                v-if="appliedMeasure && feature.geometry.type === 'LineString'"
                :value="inputValue(feature.properties.areaWidth, feature.properties.defaultWidth)"
                :min="getDefaultValueProperty('width', 'min', appliedMeasure.defaultValues)"
                :max="getDefaultValueProperty('width', 'max', appliedMeasure.defaultValues)"
                :label="$t('area_width')"
                @change="value => updateAreaProperties({ features: [feature], properties: { areaWidth: value }})"
              >
                <template v-slot:info>
                  <app-tooltip
                    :message="$t('area_width_info')"
                    class="areas__info-button"
                  />
                </template>
              </input-range>

              <input-range
                v-if="appliedMeasure && feature.geometry.type === 'Point'"
                :value="inputValue(feature.properties.areaRadius, feature.properties.defaultRadius)"
                :min="getDefaultValueProperty('radius', 'min', appliedMeasure.defaultValues)"
                :max="getDefaultValueProperty('radius', 'max', appliedMeasure.defaultValues)"
                :label="$t('area_radius')"
                @change="value => updateAreaProperties({ features: [feature], properties: { areaRadius: value }})"
              >
                <template v-slot:info>
                  <app-tooltip
                    :message="$t('area_radius_info')"
                    class="areas__info-button"
                  />
                </template>
              </input-range>
            </md-card-content>

            <md-card-actions>
              <md-button @click="onDone">
                {{ $t('done') }}
              </md-button>
            </md-card-actions>
          </div>
        </md-card>
      </li>
    </ul>
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
    selectedMeasuresIds() { return this.selectedFeatures.map(feature => feature.properties.measure) },
    appliedMeasure() {
      const id = this.selectedMeasuresIds.join()
      return this.measureById(id)
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
      return String(value)
    },
    inputValue(value, defaultValue) {
      let returnValue = value || defaultValue
      returnValue = value === '' ? value : returnValue
      return returnValue
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
