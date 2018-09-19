import Vue from 'vue'
import turf from '@turf/area'
import MapEventBus, { UPDATE_FEATURE_PROPERTY, HIDE_AREA_ON_MAP } from '../lib/map-event-bus'

export const state = () => ({
  areas: [],
  hiddenAreas: [],
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
    return state.settings.area = {}
  },
  addArea(state, value) {
    state.areas.push(value)
  },
  addHiddenArea(state, value) {
    state.hiddenAreas.push(value)
  },
  updateArea(state, value) {
    const updatedArea = (state.areas.find(area => area.id === value.id))
    Object.assign(updatedArea, value)
  },
  updateAreaProperty(state, { id, properties }) {
    console.log(properties)
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
  updateProjectAreaSettings(state, value) {
    state.settings.projectArea = value
  },
  setProjectAreaSetting(state, { key, value }) {
    state.settings.projectArea[key] = value
  },
  toggleProjectAreaNestedSetting(state, { key, option, value }) {
    state.settings.projectArea[key][option] = !state.settings.projectArea[key][option]
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

      const areaNumber = state.areas.length
      commit('updateAreaProperty', { id: feature.id, properties: { area, name: `Area-${areaNumber}` } })
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
  hideArea({ commit }, features) {
    features.forEach(feature => {
      commit('addHiddenArea', feature)
      MapEventBus.$emit(HIDE_AREA_ON_MAP, {
        featureId: feature.id,
      })
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
  bootstrapSettings({ state, commit }, settings) {
    settings.forEach(setting => {
      const value = !setting.multiple
        ? null
        : setting.options.reduce((obj, option) => ({
            ...obj,
            [option.value]: false,
          }), {})
      commit('setProjectAreaSetting', { key: setting.key, value })
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
  hiddenAreas: (state) => {
    return state.areas.filter(area => area.properties.hidden)
  },
  shownAreas: (state) => {
    return state.areas.filter(area => !area.properties.hidden)
  },
}
