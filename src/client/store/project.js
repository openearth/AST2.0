import Vue from 'vue'

export const state = () => ({
  settings: {
    title: 'My project title',
    projectArea: {},
    areas: [],
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
  createArea(state, newArea) {
    if (!state.settings.projectArea.id) {
      return state.settings.projectArea = newArea
    }

    state.settings.areas.push(newArea)
  },
  updateArea(state, updates) {
    const { id } = updates
    const { projectArea } = state.settings

    if (projectArea.id === id) {
      return state.settings.projectArea = updates
    }

    const updatedArea = (state.settings.areas.find(area => area.id === id))
    Object.assign(updatedArea, updates)
  },
  deleteArea(state, value) {
    const [{ id }] = value
    const { projectArea } = state.settings

    if (projectArea.id === id) {
      return state.settings.projectArea = {}
    }

    state.settings.areas = state.settings.areas.filter(area => area.id !== id)
  },
}
