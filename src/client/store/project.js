import Vue from 'vue'
import turf from '@turf/area'
import MapEventBus, { UPDATE_FEATURE_PROPERTY } from '../lib/map-event-bus'

export const state = () => ({
  areas: [],
  settings: {
    title: 'My project title',
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
    return state.settings.projectArea = value
  },
  updateProjectArea(state, value) {
    return state.settings.projectArea = value
  },
  updateProjectAreaProperty(state, properties) {
    const areaToUpdate = state.settings.projectArea
    const newProperties = { ...areaToUpdate.properties, ...properties }
    Vue.set(areaToUpdate, 'properties', newProperties)
    Object.keys(properties).forEach(key => {
      MapEventBus.$emit(UPDATE_FEATURE_PROPERTY, {
        featureId: areaToUpdate.id,
        key,
        value: properties[key],
      })
    })
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
  updateAreaProperty(state, { id, properties }) {
    const areaToUpdate = (state.areas.find(area => area.id === id))
    const newProperties = { ...areaToUpdate.properties, ...properties }
    Vue.set(areaToUpdate, 'properties', newProperties)
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
}

export const actions = {
  createArea({ state, commit }, features) {
    features.forEach(feature => {
      const { projectArea } = state.settings
      const area = turf(feature.geometry)

      if (!projectArea.id) {
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
      const { projectArea } = state.settings
      const area = turf(feature.geometry)

      if (projectArea.id === id) {
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
      const { projectArea } = state.settings

      if (projectArea.id === id) {
        return commit('deleteProjectArea')
      }

      commit('deleteArea', id)
    })
  },
}

export const getters = {
  areasByMeasure: (state, getters, rootState) => {
    return state.areas.reduce((obj, area) => {
      const measureId = area.properties.measure

      if (measureId) {
        if (!obj[measureId]) {
          obj[measureId] = {
            measure: rootState.data.measures.find(measure => measure.measureId === measureId),
            areas: [],
          }
        }

        obj[measureId].areas.push(area)
      }

      return obj
    }, {})
  },
}
