<template>
  <md-toolbar class="md-primary">
    <div class="md-toolbar-section-start">
      <h2 class="md-title">AST 2.0</h2>
    </div>

    <div class="md-toolbar-section-end">
      <md-button
        :to="`/${this.$i18n.locale}/my-measures`"
        class="md-primary md-icon-button">
        <md-icon>build</md-icon>
      </md-button>
      <md-button
        :to="`/${this.$i18n.locale}/settings/`"
        class="md-primary md-icon-button">
        <md-icon>settings</md-icon>
      </md-button>
    </div>
  </md-toolbar>
</template>

<style>

</style>
