<template>
  <md-drawer md-permanent="clipped" class="settings-view">
    <md-tabs md-sync-route class="settings-view__tabs">
      <md-tab
        id="tab-general"
        md-label="General"
        to="/en/settings/general"/>
      <md-tab
        id="tab-project-area"
        md-label="Project Area"
        to="/en/settings/project-area"/>
    </md-tabs>

    <nuxt-child class="settings-view__content"/>

    <div class="settings-view__action-wrapper">
      <md-button class="md-primary md-raised">Next</md-button>
    </div>
  </md-drawer>
</template>

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
