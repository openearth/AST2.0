<template>
  <aside>
    <md-toolbar md-elevation="0">
      <span class="md-title">{{ $t('selected_measures') }}</span>
    </md-toolbar>

    <ul class="areas__list">
      <li
        v-for="feature in selectedFeatures"
        :key="feature.id"
        class="areas__item">
        <md-card>
          <div :style="`border-left-color: ${appliedMeasure ? appliedMeasure.color.hex : 'transparent'}`" class="areas__item-content">
            <md-card-header>
              <md-avatar class="areas__avatar">
                <img
                  v-if="appliedMeasure"
                  :src="appliedMeasure.image.url"
                  alt="Avatar">
              </md-avatar>

              <div class="md-title">{{ feature.properties.name }}</div>
              <div class="md-subhead areas__subhead">{{ appliedMeasure ? appliedMeasure.title : '&nbsp;' }}</div>
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
                  <p v-if="appliedMeasure">{{ appliedMeasure.title }}</p>
                  <hint-text
                    v-else
                    :text="$t('empty_area_measure')"
                    class="areas__hint-text"/>
                  <md-button :to="`/${locale}/project/measures`" class="md-primary md-raised areas__choose-button">{{ appliedMeasure ? $t('change_measure') : $t('choose_measure') }}</md-button>
                </div>
                <div v-if="appliedMeasure" class="areas__choose-icon">
                  <img :src="appliedMeasure.image.url" >
                </div>
              </div>

              <input-range
                v-if="appliedMeasure"
                :value="feature.properties.areaDepth || feature.properties.defaultDepth"
                :min="getDefaultValueProperty('depth', 'min', appliedMeasure.defaultValues)"
                :max="getDefaultValueProperty('depth', 'max', appliedMeasure.defaultValues)"
                :label="$t('area_depth')"
                @change="value => updateAreaProperties({ features: [feature], properties: { areaDepth: value }})"/>

              <input-range
                v-if="appliedMeasure"
                :value="feature.properties.areaInflow || feature.properties.defaultInflow"
                :min="getDefaultValueProperty('inflow', 'min', appliedMeasure.defaultValues)"
                :max="getDefaultValueProperty('inflow', 'max', appliedMeasure.defaultValues)"
                :label="$t('area_inflow')"
                @change="value => updateAreaProperties({ features: [feature], properties: { areaInflow: value }})"/>

              <input-range
                v-if="appliedMeasure && feature.geometry.type === 'LineString'"
                :value="feature.properties.areaWidth || feature.properties.defaultWidth"
                :min="getDefaultValueProperty('width', 'min', appliedMeasure.defaultValues)"
                :max="getDefaultValueProperty('width', 'max', appliedMeasure.defaultValues)"
                :label="$t('area_width')"
                @change="value => updateAreaProperties({ features: [feature], properties: { areaWidth: value }})"
              />

              <input-range
                v-if="appliedMeasure && feature.geometry.type === 'Point'"
                :value="feature.properties.areaRadius || feature.properties.defaultRadius"
                :min="getDefaultValueProperty('radius', 'min', appliedMeasure.defaultValues)"
                :max="getDefaultValueProperty('radius', 'max', appliedMeasure.defaultValues)"
                :label="$t('area_radius')"
                @change="value => updateAreaProperties({ features: [feature], properties: { areaRadius: value }})"
              />

            </md-card-content>

            <md-card-actions>
              <md-button @click="onDone">{{ $t('done') }}</md-button>
            </md-card-actions>
          </div>
        </md-card>
      </li>
    </ul>
  </aside>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
import MapEventBus, { REDRAW, MODE } from "../../lib/map-event-bus";
import InputRange from '../../components/input-range'
import TextInput from '../../components/text-input'
import HintText from '~/components/hint-text'

export default {
  middleware: ['access-level-settings'],
  components: { InputRange, TextInput, HintText },
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
  },
  methods: {
    ...mapActions({ updateAreaProperties: 'project/updateAreaProperties' }),
    ...mapMutations({ updateAreaProperty: 'project/updateAreaProperty' }),
    onDone() {
      this.$router.push(`/${this.locale}/project/`)
      MapEventBus.$emit(MODE, 'simple_select')
    },
    getDefaultValueProperty(key, property, defaultValues) {
      const values = defaultValues.find(values => values.key.toLowerCase() === key)
      const value = values[property]
      return String(value)
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
</style>
