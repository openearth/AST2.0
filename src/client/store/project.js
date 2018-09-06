import Vue from 'vue'

export const state = () => ({
  settings: {
    title: 'My project title',
  },
  map: {
    baseLayers: [
      { key: 'default', label: 'Default' },
      { key: 'satellite', label: 'Satellite' },
    ],
    activeBaseLayer: 'default',
  },
})

export const mutations = {
  import(state, file) {
    Vue.set(state, 'settings', file.settings)
  },
  setTitle(state, value) {
    state.settings.title = value
  },
  setBaseLayer(state, value) {
    state.map.activeBaseLayer = value
  },
}
