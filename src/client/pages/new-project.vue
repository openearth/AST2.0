<template>
  <md-drawer md-permanent="clipped" class="new-project">
    <md-toolbar md-elevation="0">
      <span class="md-title">{{ $t('project_area') }}</span>
    </md-toolbar>

    <div class="new-project__content inner-container">
      <md-list>
        <md-list-item>
          <hint-text
            v-if="!createdProjectArea"
            :icon="'crop_square'"
            :translation="'empty_project_area'" />
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
import { HintText } from '~/components'

export default {
  layout: 'draw-project-area',
  middleware: ['access-level-legal'],
  components: { HintText },
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
</style>
