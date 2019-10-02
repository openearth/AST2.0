<template>
  <md-dialog :md-active="showLayerDialog" class="md-fullscreen">
    <md-dialog-title> {{ $t(state) }} </md-dialog-title>
    <md-dialog-content>
      <form v-if="state === 'settings'">
        <md-field>
          <md-select v-model="serverType" md-dense>
            <!-- <label> server url</label> -->
            <md-option
              v-for="option in options"
              :key="option.value"
              :value="option.value">{{ option.name }}</md-option>
          </md-select>
        </md-field>
        <md-field>
          <label> server url</label>
          <md-input v-model="serverUrl" :placeholder="placeholder"/>
        </md-field>
      </form>
      <p v-if="state === 'layers' || 'error'">
        {{ message }}
      </p>
      <md-list v-if="state === 'layers'">
        <app-spinner v-if="layers.length === 0" />
        <md-list-item
          v-for="layer in layers"
          :key="layer.name"
          class="layer-dialog__layer"
        >
          <md-checkbox
            v-if="wmsLayerIds.includes(layer.id)"
            :model="checked"
            :disabled="wmsLayerIds.includes(layer.id)"
          />
          <md-checkbox v-else v-model="layer.checked"/>

          <p class="md-list-item-text layer-dialog__layer-label">
            <span :class="{'layer-dialog__layer-disabled': wmsLayerIds.includes(layer.id)}">
              {{ layer.name }}
            </span>
            <span v-if="wmsLayerIds.includes(layer.id)" class="layer-dialog__layer-hint">
              <md-icon class="layer-dialog__warn">warning</md-icon>
              {{ $t('layer_already_exists') }}
            </span>
          </p>

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
import get from 'lodash/get';
import { AppSpinner } from '~/components'

export default {
  components: { AppSpinner },
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
      serverUrl: '', // optional to debug: test || ''
      serverType: '', // optional to debug:  MOCK || ''
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
    checked: true,
    }
  },
  computed: {
    placeholder() {
      const option = this.options.find(option => option.name === this.serverType)
      return get('placeholder', option) || ""
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
          console.log('data', data);
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

.layer-dialog__layer-label {
  width: 100%;
}

.layer-dialog__layer-disabled {
  text-decoration: line-through;
}

.layer-dialog__layer .md-list-item-content {
  align-items: flex-start;
  padding-top: 14px;
}

.layer-dialog__layer-hint {
  width: 100%;
  margin-top: 5px;
  font-size: 14px;
  color: var(--warning-color);
}

.layer-dialog__warn {
  display: inline-block;
  vertical-align: top;
  width: 18px;
  height: 18px;
  min-width: 18px;
  margin-top: -2px;
  margin-right: 4px;

  font-size: 16px !important;
  line-height: 16px;
  color: var(--warning-color) !important;
}

</style>
