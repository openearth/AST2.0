<template>
  <md-drawer md-permanent="clipped" class="settings-view">
    <md-tabs md-sync-route class="settings-view__tabs">
      <md-tab
        id="tab-general"
        :to="`/${locale}/settings/general`"
        md-label="General"/>
      <md-tab
        id="tab-project-area"
        :to="`/${locale}/settings/project-area`"
        md-label="Project Area"/>
      <md-tab
        id="tab-project-target"
        :to="`/${locale}/settings/project-target`"
        md-label="Project Target"/>
    </md-tabs>

    <nuxt-child class="settings-view__content"/>

    <div class="settings-view__action-wrapper">
      <md-button class="md-primary md-raised">Next</md-button>
    </div>
  </md-drawer>
</template>

<script>
import { mapState } from "vuex";
export default {
  computed: { ...mapState('i18n', ['locale']) },
}
</script>

<style>
.settings-view {
  display: flex;
  flex-direction: column;
}

.settings-view__content {
  flex: 1;
}

.settings-view__action-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
