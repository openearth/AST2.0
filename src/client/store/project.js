import Vue from 'vue'
import turf from '@turf/area'
import MapEventBus, { UPDATE_FEATURE_PROPERTY } from '../lib/map-event-bus'

export const state = () => ({
  areas: [],
  settings: {
    area: {},
    general: {
      title: 'My project title',
    },
    projectArea: {},
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
    return state.settings.area = value
  },
  updateProjectArea(state, value) {
    return state.settings.area = value
  },
  updateProjectAreaProperty(state, properties) {
    const areaToUpdate = state.settings.area
    Object.assign(areaToUpdate.properties, properties)
    Object.keys(properties).forEach(key => {
      MapEventBus.$emit(UPDATE_FEATURE_PROPERTY, {
        featureId: areaToUpdate.id,
        key,
        value: properties[key],
      })
    })
  },
  deleteProjectArea(state) {
    return state.settings.area = {}
  },
  addArea(state, value) {
    state.areas.push(value)
  },
  updateArea(state, value) {
    const updatedArea = (state.areas.find(area => area.id === value.id))
    Object.assign(updatedArea, value)
  },
  updateAreaProperty(state, { id, properties }) {
    const areaToUpdate = (state.areas.find(area => area.id === id))
    Object.assign(areaToUpdate.properties, properties)
    Object.keys(properties).forEach(key => {
      MapEventBus.$emit(UPDATE_FEATURE_PROPERTY, {
        featureId: id,
        key,
        value: properties[key],
      })
    })
  },
  deleteArea(state, value) {
    state.areas = state.areas.filter(area => area.id !== value)
  },
  updateProjectAreaSettings(state, value) {
    state.settings.projectArea = value
  },
}

export const actions = {
  createArea({ state, commit }, features) {
    features.forEach(feature => {
      const area = turf(feature.geometry)

      if (!state.settings.area.id) {
        commit('addProjectArea', feature)
        commit('updateProjectAreaProperty', { area, isProjectArea: true })
        return
      }

      commit('addArea', feature)
      commit('updateAreaProperty', { id: feature.id, properties: { area } })
    })
  },
  updateArea({ state, commit }, features) {
    features.forEach(feature => {
      const { id } = feature
      const area = turf(feature.geometry)

      if (state.settings.area.id === id) {
        commit('updateProjectArea', feature)
        commit('updateProjectAreaProperty', { area })
        return
      }

      commit('updateArea', feature)
      commit('updateAreaProperty', { id, properties: { area } })
    })
  },
  updateAreaProperties({ commit }, { features, properties }) {
    features.forEach(({ id }) => {
      commit('updateAreaProperty', { id, properties })
    })
  },
  deleteArea({ state, commit }, features) {
    features.forEach(({ id }) => {
      const { area } = state.settings

    if (area.id === id) {
      return commit('deleteProjectArea')
    }

      commit('deleteArea', id)
    })
  },
}
