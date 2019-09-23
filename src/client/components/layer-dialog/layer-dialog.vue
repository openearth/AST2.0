<template>
  <md-dialog :md-active="showLayerDialog" class="md-fullscreen">
    <md-dialog-title> Settings </md-dialog-title>
    <md-dialog-content>
      <form v-if="state === 'settings'">
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
      <p v-if="state === 'layers'">
        {{ message }}
      </p>
      <md-list v-if="state === 'layers'">
        <md-list-item v-for="layer in layers" :key="layer.name">
          <md-checkbox v-model="layer.checked" />
          <span class="md-list-item-text">{{ layer.name }}</span>
        </md-list-item>
      </md-list>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-primary" @click="$emit('show-layer-dialog', false)">
        Cancel
      </md-button>
      <md-button 
        v-if="state === 'settings'" 
        class="md-primary" 
        @click="retrieveLayers()">
        Retrieve layers
      </md-button>
      <md-button 
        v-if="state === 'layers'" 
        class="md-primary" 
        @click="addLayers()">
        Add Layers
      </md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: {
    showLayerDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      serverUrl: 'test',
      serverType: 'MOCK',
      state: 'settings',
      layers: [],
      message: '',
      options: [{
        name: 'WMS',
        value: 'WMS',
      }, {
        name: 'WMTS',
        value: 'WMTS',
      }, {
        name: 'ArcGIS',
        value: 'ESRI',
      }, {
        name: 'Not sure',
        value: '?',
      }],
    }
  },
  methods: {
    ...mapActions({
      getCustomMapLayers: 'data/wmsLayers/getCustomMapLayers',
      addTilesToLayers: 'data/wmsLayers/addTilesToLayers',
    }),
    retrieveLayers() {
      this.state = 'layers'
      this.getCustomMapLayers({ serverUrl: this.serverUrl, serverType: this.serverType })
        .then(data => {
          this.layers = data.layers
          this.message = this.messages
        })
    },
    addLayers() {
      const newLayers = this.layers.filter(layer => layer.checked)
      newLayers.forEach(layer => {
        this.addTilesToLayers(layer)
      })
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
