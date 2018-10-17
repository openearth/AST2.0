<template>
  <md-drawer md-permanent="clipped" class="new-project">
    <md-toolbar md-elevation="0">
      <span class="md-title">{{ $t('project_area') }}</span>
    </md-toolbar>

    <div class="new-project__content">
      <md-list>
        <md-list-item>
          <div v-if="!createdProjectArea" class="new-project__empty-area">
            <md-icon>crop_free</md-icon>
            <p class="md-body-2">{{ $t('empty_project_area') }}</p>
          </div>
          <div v-else>
            <p class="md-body-2">{{ $t('area_size') }}:</p>
            <span v-if="settings.area.properties" class="md-subheading">{{ areaSize }}m<sup>2</sup></span>
          </div>
        </md-list-item>
      </md-list>
    </div>

    <div class="new-project__action-wrapper">
      <md-button
        :to="`/${locale}/settings/project-area/`"
        :disabled="!createdProjectArea"
        class="md-raised md-primary">{{ $t('next') }}</md-button>
    </div>
  </md-drawer>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import MapEventBus, { REDRAW } from "../lib/map-event-bus"

export default {
  layout: 'draw-project-area',
  middleware: ['access-level-legal'],
  computed: {
    ...mapState('i18n', ['locale']),
    ...mapState('project', ['settings']),
    ...mapGetters('flow', ['createdProjectArea']),
    areaSize() { return Math.round(this.settings.area.properties.area) },
  },
  mounted() {
    MapEventBus.$emit(REDRAW)
  },
}
</script>

<style>
.new-project {
  display: flex;
  flex-direction: column;
}

.new-project__content {
  flex: 1;
}

.new-project__action-wrapper {
  display: flex;
  justify-content: flex-end;
}

.new-project__empty-area {
  white-space: normal;
  display: flex;
  justify-content: space-between;
}

.new-project__empty-area .md-icon {
  margin-right: var(--spacing-default);
}
</style>
