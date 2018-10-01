<template>
  <md-drawer md-permanent="clipped" class="new-project">
    <md-toolbar md-elevation="0">
      <span class="md-title">{{ $t('project_area') }}</span>
    </md-toolbar>

    <div class="new-project__content">
      <md-list>
        <md-list-item>
          <p>{{ $t('area_size') }}: <span v-if="settings.area.properties">{{ settings.area.properties.area }}</span></p>
        </md-list-item>
        <md-divider />
      </md-list>
    </div>

    <div class="new-project__action-wrapper">
      <md-button
        :to="`/${locale}/settings/general/`"
        :disabled="!createdProjectArea"
        class="md-raised md-primary">{{ $t('next') }}</md-button>
    </div>
  </md-drawer>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import MapEventBus, { REDRAW } from "../lib/map-event-bus"

export default {
  layout: 'settings',
  middleware: ['access-level-legal'],
  computed: {
    ...mapState('i18n', ['locale']),
    ...mapState('project', ['settings']),
    ...mapGetters('flow', ['createdProjectArea']),
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
  overflow-y: scroll;
}

.new-project__action-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
