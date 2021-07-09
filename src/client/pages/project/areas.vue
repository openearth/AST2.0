<template>
  <aside>
    <md-toolbar md-elevation="0">
      <span class="md-title">{{ $t('selected_measures') }}</span>
    </md-toolbar>

    <div
      v-if="hasSelection"
      class="areas__editor"
    >
      <md-card>
        <div
          v-if="!isEditableSelection"
          class="areas__editor-content"
        >
          <md-card-content>
            {{ $t('selection_incompatible') }}
          </md-card-content>
        </div>
        <div
          v-else
          :style="`border-left-color: ${ selectedMeasure ? selectedMeasure.color.hex : 'transparent' }`"
          class="areas__editor-content"
        >
          <md-card-header>
            <md-avatar class="areas__avatar">
              <img
                v-if="selectedMeasure"
                :src="selectedMeasure.image.url"
                alt="Avatar"
              >
            </md-avatar>

            <div class="md-title">
              {{ featureName }}
            </div>
            <div class="md-subhead areas__subhead">
              {{ selectedMeasure ? selectedMeasure.title : ' ' }}
            </div>
          </md-card-header>

          <md-card-content>
            <text-input
              v-if="isSingleSelection"
              :label="$t('area_name')"
              :value="featureName"
              :on-change="name => updateAreaProperty({ id: featureId, properties: { name }})"
            />

            <!-- Measure type input -->
            <span class="md-subheading">
              {{ $t('measure') }}
            </span>
            <div class="areas__choose-wrapper">
              <div class="areas__choose-content">
                <p v-if="selectedMeasure">
                  {{ selectedMeasure.title }}
                </p>
                <md-button
                  :to="`/${locale}/project/measures`"
                  class="md-accent md-raised areas__choose-button"
                >
                  {{ selectedMeasure ? $t('change_measure') : $t('choose_measure') }}
                </md-button>
              </div>
              <div v-if="selectedMeasure" class="areas__choose-icon">
                <img :src="selectedMeasure.image.url">
              </div>
            </div>

            <template v-if="selectedMeasure">
              <area-property-slider
                v-for="({ key, min, max, values, unit }) in measurePropertiesToEdit"
                :key="key"
                :value-type="key"
                :values="values"
                :min="min"
                :max="max"
                :unit="unit"
                @change="updateValue"
              />
            </template>
          </md-card-content>

          <md-card-actions>
            <md-button @click="onDone">
              {{ $t('done') }}
            </md-button>
          </md-card-actions>
        </div>
      </md-card>
    </div>
  </aside>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex';
import MapEventBus, { REDRAW, MODE, DELETE } from '@/lib/map-event-bus';
import isNil from '@/lib/isNil'
import AreaPropertySlider from '@/components/area-property-slider'
import TextInput from '@/components/text-input'

export default {
  middleware: ['access-level-settings'],
  components: { TextInput, AreaPropertySlider },
  computed: {
    ...mapState('i18n', ['locale']),
    ...mapGetters('data/measures', ['measureById']),
    ...mapGetters({ selectedFeatures: 'selectedAreas/features' }),

    hasSelection() {
      return this.selectedFeatures.length > 0
    },

    isSingleSelection() {
      return this.selectedFeatures.length === 1
    },

    isMultiSelection() {
      return this.selectedFeatures.length > 1
    },

    isEditableSelection() {
      if(
        this.isSingleSelection ||
        this.selectedFeatures.every(({ properties: { measure } }) => isNil(measure)) ||
        this.selectedFeatures.every(({ properties: { measure } }) => measure === this.selectedMeasureId)
      ) return true
      return false
    },

    featureName() {
      return this.isMultiSelection ? this.$t('group') : this.selectedFeatures[0].properties.name
    },

    featureId() {
      return this.isMultiSelection ? null : this.selectedFeatures[0].id
    },

    selectedMeasureId() {
      return this.selectedFeatures[0].properties.measure
    },

    selectedMeasure() {
      return this.measureById(this.selectedMeasureId)
    },

    selectedGeometryTypes() {
      return this.selectedFeatures.reduce((returnArr, { geometry: { type } }) => {
        return returnArr.includes(type) ? returnArr : [...returnArr, type]
      }, [])
    },

    measurePropertiesToEdit() {
      return this.selectedMeasure.defaultValues
        .map(valueObj => {
          const { key, show } = valueObj
          console.log({ valueObj })
          if(
            !show ||
            ((key === 'Radius' || key === 'Width') && this.selectedGeometryTypes.length > 1) ||
            (key === 'Radius' && this.selectedGeometryTypes[0] !== 'Point') ||
            (key === 'Width' && this.selectedGeometryTypes[0] !== 'LineString')
          ) return null

          const values = this.getValuesForProperty(key)
          const min = valueObj.min.toString()
          const max = valueObj.max.toString()

          let unit
          switch (key) {
            case 'Radius':
              unit = 'surface'
              break
            case 'Width':
              unit = 'distance'
              break
            case 'Depth':
              unit = 'distance'
              break
            case 'Inflow':
            default:
                unit = undefined
          }

          return { key, values, min, max, unit }
        })
        .filter(Boolean)
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
      MapEventBus.$emit(MODE, 'simple_select')
      this.$router.push(`/${this.locale}/project/`).catch(() => {})
    },

    onDone() {
      MapEventBus.$emit(MODE, 'simple_select')
      this.$router.push(`/${this.locale}/project/`).catch(() => {})
    },

    updateValue({ key, value }) {
      this.updateAreaProperties({
        features: this.selectedFeatures,
        properties: {
          [`area${ key }`]: value,
        },
      })
    },

    getValuesForProperty(key) {
      return this.selectedFeatures.map(
        ({ properties }) => (properties[`area${ key }`] || properties[`default${ key}`]).toString())
    },
  },
}
</script>

<style>
.areas__editor {
  list-style: none;
  padding: var(--spacing-default);
}

.areas__editor-content {
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
