<template>
  <div class="legend">
    <md-toolbar md-elevation="0">
      <span class="md-title">{{ $t('applied_measures') }}</span>
    </md-toolbar>

    <hint-text
      v-if="!measureCollection.length"
      :icon="'crop_square'"
      :text="$t('empty_measures')"
      class="legend__hint-text" />

    <md-list v-else>
      <md-list-item
        v-for="({measure, areas, someAreasAreShown}, index) in measureCollection"
        :key="index"
        :style="someAreasAreShown ? `border-left-color: ${measure.color.hex}` : `border-left-color: #ccc`"
        :md-expanded="true"
        md-expand
        class="legend__item">
        <div class="legend__item-header">
          <md-avatar class="legend__item-avatar">
            <img :src="measure.image.url" alt="" >
          </md-avatar>
          <md-subheader class="legend__item-title">{{ measure.title }}</md-subheader>
          <md-switch
            :value="!someAreasAreShown"
            class="legend__item-toggle"
            @change="value => updateAreaProperties({ features: areas, properties: { hidden: !value }})"
          />
        </div>
        <md-list slot="md-expand">
          <md-list-item
            v-for="area in areas"
            :key="area.id"
            class="md-inset">
            <span class="md-list-item-text">{{ area.properties.name }}</span>
            <md-switch
              :value="area.properties.hidden"
              @change="value => updateAreaProperties({ features: [area], properties: { hidden: !value }})"
            />
          </md-list-item>
        </md-list>
        <md-divider/>
      </md-list-item>
    </md-list>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex"
import { MeasureCard, SearchInput, HintText } from '~/components'
import MapEventBus, { REDRAW } from "../../lib/map-event-bus";

export default {
  middleware: ['access-level-settings'],
  components: { MeasureCard, SearchInput, HintText },
  data() {
    return {
      isAreasListVisible: false,
      isAreaVisible: true,
    }
  },
  computed: {
    ...mapState('data', ['measures']),
    ...mapState('project', ['areas']),
    ...mapGetters('selectedAreas', { selectedFeatures: 'features' }),
    ...mapGetters('project', ['areasByMeasure', 'measureCollection']),
  },
  mounted() {
    MapEventBus.$emit(REDRAW)
  },
  methods: {
    ...mapActions({ updateAreaProperties: 'project/updateAreaProperties' }),
  },
}
</script>

<style>

.legend__item {
  border-left-width: 8px;
  border-left-style: solid;
  transition: border-left-color .3s ease-in-out;
}

.legend__item-header {
  display: flex;
  align-items: flex-start;
  white-space: normal;
  flex-grow: 1;
}

.legend__item-title {
  flex-grow: 1;
}

.legend__item-toggle {
  margin-right: 0;
}

.legend .md-icon {
  margin-left: var(--spacing-default);
}

.legend .md-inset {
  padding-right: 40px; /* md-list-item-content padding (16px) + md-icon width (24px) */
}

.legend__hint-text {
  padding: var(--spacing-default);
}

.legend .hint-text__icon.md-icon {
  margin: 0 var(--spacing-default) 0 0;
}

.legend .md-list {
  padding-top: 0;
}
</style>
