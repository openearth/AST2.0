<template>
  <md-drawer md-permanent="clipped" class="new-project">
    <md-toolbar md-elevation="0">
      <span class="md-title">{{ $t('project_area') }}</span>
    </md-toolbar>

    <div class="new-project__content">
      <hint-text
        v-if="!createdProjectArea"
        :icon="'crop_square'"
        :text="$t('empty_project_area')"
        class="new-project__hint-text"
      />
      <div v-else>
        <p class="md-body-2">
          {{ $t('area_size') }}:
        </p>
        <span v-if="settings.area.properties" class="md-subheading">{{ areaSize }}m<sup>2</sup></span>
      </div>
    </div>

    <div class="new-project__action-wrapper">
      <md-button
        :to="`/${locale}/settings/project-area/`"
        :disabled="!createdProjectArea"
        class="md-raised md-accent"
      >
        {{ $t('next') }}
      </md-button>
    </div>
  </md-drawer>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import MapEventBus, { REDRAW } from '../lib/map-event-bus'
import { HintText } from '~/components'

export default {
  middleware: ['access-level-legal', 'state-is-draw-project-area'],
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
  padding: var(--spacing-default);
}

.new-project__action-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
