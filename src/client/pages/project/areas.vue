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

              <span class="md-body-2">{{ $t('measure') }}</span>
              <div class="areas__choose-wrapper">
                <div class="areas__choose-content">
                  <template v-if="appliedMeasure">
                    <p>{{ appliedMeasure.title }}</p>
                    <md-button :to="`/${locale}/project/measures`" class="md-primary">{{ $t('change_measure') }}</md-button>
                  </template>

                  <template v-else>
                    <md-button :to="`/${locale}/project/measures`" class="md-raised md-primary">{{ $t('choose_measure') }}</md-button>
                  </template>
                </div>
                <div class="areas__choose-icon">
                  <img v-if="appliedMeasure" :src="appliedMeasure.image.url" >
                </div>
              </div>

              <input-range
                v-if="appliedMeasure"
                :value="feature.properties.areaDepth"
                label="Measure Depth"
                min="0"
                max="10"
                @change="value => updateAreaProperties({ features: [feature], properties: { areaDepth: value }})"/>

              <input-range
                v-if="appliedMeasure"
                :value="feature.properties.areaInflow"
                label="Inflow Area"
                min="0"
                max="10"
                @change="value => updateAreaProperties({ features: [feature], properties: { areaInflow: value }})"/>

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

export default {
  middleware: ['access-level-settings'],
  components: { InputRange, TextInput },
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
