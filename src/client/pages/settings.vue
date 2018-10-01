<template>
  <md-drawer md-permanent="clipped" class="settings-view">
    <md-tabs md-sync-route class="settings-view__tabs">
      <md-tab
        id="tab-general"
        :to="`/${locale}/settings/general`"
        :md-label="$t('general')"/>
      <md-tab
        id="tab-project-area"
        :to="`/${locale}/settings/project-area`"
        :md-label="$t('project_area')"/>
      <md-tab
        id="tab-project-target"
        :to="`/${locale}/settings/project-target`"
        :md-label="$t('project_target')"/>
    </md-tabs>

    <nuxt-child class="settings-view__content"/>

    <div class="settings-view__action-wrapper">
      <md-button :to="`/${locale}/project`" class="md-primary md-raised">{{ $t('next') }}</md-button>
    </div>
  </md-drawer>
</template>

<script>
import { mapState } from "vuex";
import MapEventBus, { REDRAW } from "../lib/map-event-bus"

export default {
  computed: { ...mapState('i18n', ['locale']) },
  layout: 'settings',
  mounted() {
    MapEventBus.$emit(REDRAW)
  },
}
</script>

<style>
.settings-view {
  display: flex;
  flex-direction: column;
  width: 800px;
}

.settings-view__content {
  flex: 1;
  overflow-y: scroll;
}

.settings-view__action-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
