<template>
  <md-dialog
    :md-active="showLayerDialog"
    class="md-fullscreen layer-dialog"
  >
    <md-dialog-title>{{ title }}</md-dialog-title>
    <md-dialog-content>
      <form v-if="state === 'settings'">
        <md-field>
          <label>{{ $t('choose_layer_server') }}</label>
          <md-select v-model="serverType" md-dense>
            <md-option
              v-for="option in options"
              :key="option.value"
              :value="option.value">{{ option.name }}</md-option>
          </md-select>
        </md-field>
        <md-field v-if="serverType !== ''">
          <label>{{ $t('server_url') }}</label>
          <md-input v-model="serverUrl" :placeholder="placeholder"/>
          <span v-if="exampleUrl" class="md-helper-text">{{ $t('example_url') }}: {{ exampleUrl }}</span>
        </md-field>
      </form>
      <p v-if="state === 'layers' || 'error'">
        {{ message }}
      </p>
      <md-list v-if="state === 'layers'">
        <app-spinner v-if="layers.length === 0" />

        <md-list-item
          v-for="(layer, index) in layers"
          :key="layer.name"
          class="layer-dialog__layer"
        >
          <md-checkbox
            v-if="doubleLayer[index] || layerError[index]"
            :model="doubleLayer[index] ? checked : false"
            :disabled="doubleLayer[index] || layerError[index]"
          />
          <md-checkbox v-else v-model="layer.checked"/>

          <p class="md-list-item-text layer-dialog__layer-label">
            <span
              :class="{
                'layer-dialog__layer-disabled': doubleLayer[index] || layerError[index]
              }"
            >
              {{ layer.name }}
            </span>
            <span
              v-if="doubleLayer[index] || layerError[index]"
              class="layer-dialog__layer-hint"
            >
              <md-icon class="layer-dialog__warn">warning</md-icon>
              {{ doubleLayer[index] ? $t('layer_already_exists') : '' }}
              <em>{{ layerError[index] ? layer.errors : '' }}</em>
            </span>
          </p>

        </md-list-item>
      </md-list>
    </md-dialog-content>
    <md-dialog-actions>
      <md-button class="md-primary" @click="onCancel">
        {{ $t('cancel') }}
      </md-button>
      <md-button
        v-if="state !== 'settings'"
        class="md-primary"
        @click="state = 'settings'">
        {{ $t('back') }}
      </md-button>
      <md-button
        v-if="state === 'settings'"
        :disabled="serverType === '' || serverUrl === ''"
        class="md-primary"
        @click="retrieveLayers()">
        {{ $t('retrieve_layers') }}
      </md-button>
      <md-button
        v-if="state === 'layers'"
        :disabled="checkedLayers.length === 0"
        class="md-primary"
        @click="addLayers(); $emit('update:showLayerDialog', false)">
        {{ $t('add_layers') }}
      </md-button>
    </md-dialog-actions>
  </md-dialog>
</template>

<script>
import { mapActions } from 'vuex';
import get from 'lodash/get';
import { AppSpinner } from '~/components'

export default {
  components: { AppSpinner },
  props: {
    showLayerDialog: {
      type: Boolean,
      default: false,
    },
    customLayers: {
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
      options: [
        {
          name: 'WMS',
          value: 'WMS',
          placeholder: 'https://geodata.nationaalgeoregister.nl/ahn2/wms',
          exampleUrl: 'https://img.nj.gov/imagerywms/Natural2015?',
        },
        {
          name: 'WMTS',
          value: 'WMTS',
          placeholder: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS',
          exampleUrl: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS',
        },
        {
          name: 'ArcREST',
          value: 'ESRI',
          placeholder: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/',
          exampleUrl: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/',
        },
      ],
      checked: true,
    }
  },
  computed: {
    placeholder() {
      const option = this.options.find(option => option.name === this.serverType)
      return get('placeholder', option) || ""
    },
    doubleLayer() {
      const customLayersIds = this.customLayers.map(layer => layer.id)
      return this.layers.map(layer => customLayersIds.includes(layer.id) );
    },
    layerError() {
      return this.layers.map(layer => layer.errors.length > 0 );
    },
    title() {
      return `${this.$i18n.t('add_layers')}${this.state !== 'settings' ? ` - ${this.state}` : ''}`
    },
    checkedLayers() {
      return(this.layers || []).filter(layer => layer.checked)
    },
    exampleUrl() {
      return this.options.find(item => item.value === this.serverType).exampleUrl
    },
  },
  methods: {
    ...mapActions({
      getCustomMapLayers: 'data/customLayers/getCustomMapLayers',
      addCustomTilesToLayers: 'data/customLayers/addCustomTilesToLayers',
    }),
    retrieveLayers() {
      this.state = 'layers'

      // Send url and type to back-end to look for available layers in this server
      this.layers = []
      this.message =  ''
      this.getCustomMapLayers({ serverUrl: this.serverUrl, serverType: this.serverType })
        .then(data => {
          this.layers = data.layers

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
      const newLayers = this.checkedLayers
      this.addCustomTilesToLayers(newLayers)
      this.resetState()
    },
    resetState() {
      this.layers = []
      this.state = 'settings'
      this.message = ''
    },
    onCancel() {
      this.$emit('update:showLayerDialog', false)
      this.resetState()
    },
  },
}
</script>

<style>
.layer-dialog {
  min-width: 30vw;
}

.layer-dialog__actions {
  display: flex;
  margin-top: var(--spacing-default);
}

.layer-dialog__layer-label {
  width: 100%;
}

.layer-dialog__layer-disabled {
  color: var(--text-light-color);
  cursor: not-allowed;
}

.layer-dialog__layer .md-list-item-content {
  align-items: flex-start;
  padding-top: var(--font-size-small);
}

.layer-dialog__layer-hint {
  width: 100%;
  margin-top: 5px;
  font-size: var(--font-size-small);
  color: var(--text-light-color);
}

.layer-dialog__layer-hint em {
  font-weight: normal;
  font-style: normal;
}

.layer-dialog__warn {
  display: inline-block;
  vertical-align: top;
  width: var(--font-size-medium);
  height: var(--font-size-medium);
  min-width: var(--font-size-medium);
  margin-top: -2px;
  margin-right: 4px;

  font-size: var(--font-size-default) !important;
  line-height: var(--font-size-default);
  color: var(--text-light-color) !important;
}

</style>
