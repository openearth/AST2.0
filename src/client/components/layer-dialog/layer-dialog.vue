<template>
  <md-dialog :md-active="showLayerDialog" class="md-fullscreen">
    <md-dialog-title> {{ $t(state) }} </md-dialog-title>
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
      <p v-if="state === 'layers' || 'error'">
        {{ message }}
      </p>
      <md-list v-if="state === 'layers'">
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
      serverUrl: 'test',
      serverType: 'MOCK',
      state: 'settings', //TODO: Look if working with this state is the best way to go
      layers: [],
      message: '',
      options: [{
        name: 'WMS',
        value: 'WMS',
      }, {
        name: 'WMTS',
        value: 'WMTS',
      }, {
        name: 'ArcREST',
        value: 'ESRI',
      }, {
        name: 'Not sure',
        value: '?',
      }],
    }
  },
  computed: {
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
