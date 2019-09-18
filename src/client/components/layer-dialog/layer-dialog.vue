<template>
  <md-dialog :md-active="showLayerDialog" class="md-fullscreen">
    <md-dialog-title> Settings </md-dialog-title>
    <md-dialog-content>
      Settings for the server url and type
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-primary" @click="$emit('show-layer-dialog', false)">
        Cancel
      </md-button>
      <md-button class="md-primary">
        Retrieve layers
      </md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
export default {
  props: {
    showLayerDialog: {
      type: Boolean,
      default: false,
    },
  },

}
</script>

<style>
.layer-dialog {
  max-width: 40vw;
  position: absolute;
}

.layer-dialog__actions {
  display: flex;
  margin-top: var(--spacing-default);
}
</style>
