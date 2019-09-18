<template>
  <md-dialog :md-active="showLayerDialog" class="md-fullscreen">
    <md-dialog-title> Settings </md-dialog-title>
    <md-dialog-content>
      <form>
        <md-field>
          <label> server url </label>
          <md-input v-model="serverUrl"/>
        </md-field>
        <md-field>
          <md-select v-model="serverType" md-dense>
            <label> server url </label>
            <md-option
              v-for="option in options"
              :key="option.value"
              :value="option.value">{{ option.name }}</md-option>
          </md-select>
        </md-field>
      </form>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-primary" @click="$emit('show-layer-dialog', false)">
        Cancel
      </md-button>
      <md-button class="md-primary" @>
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
      serverUrl: '',
      serverType: '',
    },
  },
  data() {
    return {
      wmsType: [],
      options: [{
        name: 'WMS',
        value: 'wms',
      }, {
        name: 'WMTS',
        value: 'wmts',
      }, {
        name: 'ArcGIS',
        value: 'gis',
      }, {
        name: 'Not sure',
        value: '?',
      }],
    }
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
