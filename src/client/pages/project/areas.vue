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
          <!-- Name input
            @TODO :: Check if this fires when changing selection
          -->
          <text-input
            v-if="isSingleSelection"
            :label="$t('area_name')"
            :value="combinedFeature.properties.name"
            :on-change="name => updateAreaProperty({ id: combinedFeature.id, properties: { name }})"
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

          <template v-if="combinedMeasure">
            <!-- @TODO :: probably change this into a loop -->
            <area-property-slider
              :value-type="'depth'"
              :feature="combinedFeature"
              :measure="combinedMeasure"
              @change="updateValue('areaDepth', combinedFeature, $event)"
            />
            <area-property-slider
              :value-type="'inflow'"
              :feature="combinedFeature"
              :measure="combinedMeasure"
              @change="updateValue('areaInflow', combinedFeature, $event)"
            />
            <area-property-slider
              v-if="combinedFeature.geometry.type === 'LineString'"
              :value-type="'width'"
              :feature="combinedFeature"
              :measure="combinedMeasure"
              @change="updateValue('areaWidth', combinedFeature, $event)"
            />
            <area-property-slider
              v-if="combinedFeature.geometry.type === 'Point'"
              :value-type="'radius'"
              :feature="combinedFeature"
              :measure="combinedMeasure"
              @change="updateValue('areaRadius', combinedFeature, $event)"
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
  </aside>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex';
import MapEventBus, { REDRAW, MODE, DELETE } from '../../lib/map-event-bus';
import AreaPropertySlider from '@/components/area-property-slider'
import TextInput from '../../components/text-input'

export default {
  middleware: ['access-level-settings'],
  components: { TextInput, AreaPropertySlider },
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
      MapEventBus.$emit(MODE, 'simple_select')
      this.$router.push(`/${this.locale}/project/`).catch(() => {})
    },
    onDone() {
      MapEventBus.$emit(MODE, 'simple_select')
      this.$router.push(`/${this.locale}/project/`).catch(() => {})
    },
    // @TODO :: Check if this needs to be here or in `slider` component
    // after we've accounted for multi-selection
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
</style>
