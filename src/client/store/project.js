import Vue from 'vue'
import turf from '@turf/area'

export const state = () => ({
  areas: [],
  settings: {
    title: 'My project title',
    projectArea: {
      features: {},
      options: {},
    },
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
    return state.settings.projectArea.features = value
  },
  updateProjectArea(state, value) {
    return state.settings.projectArea.features = value
  },
  deleteProjectArea(state) {
    return state.settings.projectArea = {}
  },
  addArea(state, value) {
    state.areas.push(value)
  },
  updateArea(state, value) {
    const updatedArea = (state.areas.find(area => area.id === value.id))
    Object.assign(updatedArea, value)
  },
  deleteArea(state, value) {
    state.areas = state.areas.filter(area => area.id !== value)
  },
  updateProjectAreaSettings(state, value) {
    state.settings.projectArea.options = value
  },
}

export const actions = {
  createArea({ state, commit }, features) {
    const { projectArea } = state.settings
    const area = turf(features.geometry)
    const newArea = { ...features, properties: { ...features.properties, area } }

    if (!projectArea.features.id) {
      return commit('addProjectArea', newArea)
    }

    commit('addArea', newArea)
  },
  updateArea({ state, commit }, features) {
    const { id } = features
    const { projectArea } = state.settings
    const area = turf(features.geometry)
    const updatedArea = { ...features, properties: { ...features.properties, area } }

    if (projectArea.features.id === id) {
      return commit('updateProjectArea', updatedArea)
    }

    commit('updateArea', updatedArea)
  },
  deleteArea({ state, commit }, [{ id }]) {
    const { projectArea } = state.settings

    if (projectArea.features.id === id) {
      return commit('deleteProjectArea')
    }

    commit('deleteArea')
  },
}
