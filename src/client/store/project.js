import Vue from 'vue'

export const state = () => ({
  areas: [],
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
  addProjectArea(state, value) {
    return state.settings.projectArea = value
  },
  addArea(state, value) {
    state.areas.push(value)
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
  deleteArea(state, [{ id }]) {
    const { projectArea } = state.settings

    if (projectArea.id === id) {
      return state.settings.projectArea = {}
    }

    state.settings.areas = state.settings.areas.filter(area => area.id !== id)
  },
  
}

export const actions = {
  createArea(state, newArea) {
    if (!state.settings.projectArea.id) {
      return state.settings.projectArea = newArea
    }

    
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
  deleteArea(state, [{ id }]) {
    const { projectArea } = state.settings

    if (projectArea.id === id) {
      return state.settings.projectArea = {}
    }

    state.settings.areas = state.settings.areas.filter(area => area.id !== id)
  },
}
