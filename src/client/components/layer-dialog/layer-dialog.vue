<template>
  <md-dialog :md-active="showLayerDialog" class="md-fullscreen">
    <md-dialog-title> {{ $t(state) }} </md-dialog-title>
    <md-dialog-content>
      <form v-if="state === 'settings'">
        <md-field>
          <md-select v-model="serverType" md-dense>
            <label> server url </label>
            <md-option
              v-for="option in options"
              :key="option.value"
              :value="option.value">{{ option.name }}</md-option>
          </md-select>
        </md-field>
        <md-field>
          <label> server url </label>
          <md-input v-model="serverUrl" :placeholder="placeholder"/>
        </md-field>
      </form>
      <p v-if="state === 'layers' || 'error'">
        {{ message }}
      </p>
      <md-list v-if="state === 'layers'">
        <md-progress-spinner v-if="layers.length === 0" md-mode="indeterminate"/>
        <md-list-item v-for="layer in layers" :key="layer.name">
          <md-checkbox v-model="layer.checked" :disabled="wmsLayerIds.includes(layer.id)"/>
          <span class="md-list-item-text">{{ layer.name }}</span>
        </md-list-item>
      </md-list>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-primary" @click="$emit('update:showLayerDialog', false); resetState">
        Cancel
      </md-button>
      <md-button
        v-if="state !== 'settings'"
        class="md-primary"
        @click="state = 'settings'">
        {{ $t('back') }}
      </md-button>
      <md-button
        v-if="state === 'settings'"
        class="md-primary"
        @click="retrieveLayers()">
        {{ $t('retrieve_layers') }}
      </md-button>
      <md-button
        v-if="state === 'layers'"
        class="md-primary"
        @click="addLayers(); $emit('update:showLayerDialog', false)">
        {{ $t('add_layers') }}
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
    wmsLayers: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      serverUrl: '',
      serverType: '',
      state: 'settings',
      layers: [],
      message: '',
      options: [{
        name: 'WMS',
        value: 'WMS',
        placeholder: '', //TODO:  Ask for placeholder for WMS layer
      }, {
        name: 'WMTS',
        value: 'WMTS',
        placeholder: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS',
      }, {
        name: 'ArcREST',
        value: 'ESRI',
        placeholder: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/',
      },
    ],
    }
  },
  computed: {
    placeholder() {
      const option = this.options.find(option => option.name === this.serverType)
      console.log(option, this.serverType, option.placeholder)
      return option.placeholder
    },
    wmsLayerIds() {
      return this.wmsLayers.map(layer => layer.id)
    },
  },
  mounted() {
    this.serverType = this.options[0].name
  },
  methods: {
    ...mapActions({
      getCustomMapLayers: 'data/wmsLayers/getCustomMapLayers',
      addCustomTilesToLayers: 'data/wmsLayers/addCustomTilesToLayers',
    }),
    retrieveLayers() {
      this.state = 'layers'

      // Send url and type to back-end to look for available layers in this server
      this.layers = []
      this.message =  ''
      this.getCustomMapLayers({ serverUrl: this.serverUrl, serverType: this.serverType })
        .then(data => {
          // if errors on top level is not empty, something went wrong with
          // requesting the server or the corresponding type
          if (data.errors !== '') {
            this.state = 'error'
            this.message = data.errors
          } else {
            this.layers = data.layers
          }
        })
        .catch(error => {
          this.message = error
          this.state = 'error'
        })
    },
    addLayers() {
      // Add the selected layers to the background layers of the application
      // and reset the state of the dialog
      const newLayers = this.layers.filter(layer => layer.checked)
      this.addCustomTilesToLayers(newLayers)
      this.resetState()
    },

    resetState() {
      this.layers = []
      this.state = 'settings'
      this.message = ''
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
