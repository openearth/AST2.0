import Vue from 'vue'
import turf from '@turf/area'
import FileSaver from 'file-saver'
import MapEventBus, { UPDATE_FEATURE_PROPERTY, REPOSITION, RELOAD_LAYERS } from '../lib/map-event-bus'
import { getApiDataForFeature } from "../lib/get-api-data";
import getLoadedFileContents from '../lib/get-loaded-file-contents'
import validateProject from '../lib/validate-project'

export const state = () => ({
  legalAccepted: false,
  areas: [],
  settings: {
    area: {},
    general: {
      title: 'My project title',
    },
    projectArea: {},
    targets: {},
  },
  map: {
    baseLayers: [
      { key: 'default', label: 'Default' },
      { key: 'satellite', label: 'Satellite' },
    ],
    activeBaseLayer: 'default',
    zoom: 16.5,
    center: {
      lat: 52.36599335162853,
      lng: 4.916535879906178,
    },
  },
})

export const mutations = {
  import(state, file) {
    Object.keys(file).forEach(key => Vue.set(state, key, file[key]))
  },
  setMapZoom(state, value) {
    state.map.zoom = value
  },
  setMapCenter(state, value) {
    state.map.center.lat = value.lat
    state.map.center.lng = value.lng
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
  updateProjectAreaSettings(state, value) {
    state.settings.projectArea = value
  },
  setProjectAreaSetting(state, { key, value }) {
    state.settings.projectArea[key] = value
  },
  setTargets(state, { key, value }) {
    state.settings.targets[key] = value
  },
  setTarget(state, { group, key, value }) {
    state.settings.targets[group][key] = { ...state.settings.targets[group][key], ...value }
  },
  toggleProjectAreaNestedSetting(state, { key, option, value }) {
    state.settings.projectArea[key][option] = !state.settings.projectArea[key][option]
  },
  acceptLegal(state) {
    state.legalAccepted = true
  },
}

export const actions = {
  setMapPosition({ commit }, { zoom, center }) {
    zoom && commit('setMapZoom', zoom)
    center && commit('setMapCenter', center)
  },
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
      commit('updateAreaProperty', { id: feature.id, properties: { area, name: `Area-${areaNumber}`, hidden: false } })
    })
  },
  updateArea({ state, commit, dispatch }, features) {
    features.forEach(feature => {
      const { id } = feature
      const area = turf(feature.geometry)

      if (state.settings.area.id === id) {
        commit('updateProjectArea', feature)
        commit('updateProjectAreaProperty', { area })
        dispatch('fetchAreaApiData', state.areas)
        return
      }

      commit('updateArea', feature)
      commit('updateAreaProperty', { id, properties: { area } })
      dispatch('fetchAreaApiData', [feature])
    })
  },
  updateAreaProperties({ state, commit, dispatch }, { features, properties }) {
    features.forEach(feature => commit('updateAreaProperty', { id: feature.id, properties }))
    dispatch('fetchAreaApiData', features)
  },
  fetchAreaApiData({ state, commit }, features) {
    features.forEach(async (feature) => {
      const apiData = await getApiDataForFeature(feature, state.settings.area.properties.area)
      commit('updateAreaProperty', { id: feature.id, properties: { apiData } })
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
  bootstrapSettingsProjectArea({ state, commit }, settings) {
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
  bootstrapSettingsTargets({ state, commit }, targets) {
    targets.forEach(({ key, kpis }) => {
      const value = kpis.reduce((obj, kpi) => ({ ...obj, [kpi.key]: { include: true, value: "0" } }), {})
      commit('setTargets', { key, value })
    })
  },
  async importProject({ state, commit, rootGetters, rootState }, event) {
    const loadedProject = await getLoadedFileContents(event)
    const validProject = validateProject(loadedProject, rootState.data)
    const levelBefore = rootGetters['flow/currentFilledInLevel'].level
    const { map } = loadedProject

    if (validProject.valid) {
      commit('import', loadedProject)
      const levelAfter = rootGetters['flow/currentFilledInLevel'].level

      MapEventBus.$emit(RELOAD_LAYERS)

      // This check exist because we have different map instances. If the level
      // is not the same, we switch of layout and thus do not need to fly
      if (levelBefore === levelAfter) {
        MapEventBus.$emit(REPOSITION, { zoom: map.zoom, center: map.center })
      }
    } else {
      console.error(validProject.errors)
    }

    commit('appMenu/hideMenu', null, { root: true })
  },
  saveProject({ state }) {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    return FileSaver.saveAs(blob, 'ast_project.json')
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
        obj[measureId].someAreasAreShown = obj[measureId].areas.some(area => !area.properties.hidden)
      }

      return obj
    }, {})
  },
  measureCollection: (state, getters) => {
    return Object.keys(getters.areasByMeasure).map(key => getters.areasByMeasure[key])
  },
  filteredKpiGroups: (state, getters, rootState) => {
    const filteredKpiKeys = getters.filteredKpiKeys
    return rootState.data.kpiGroups
      .map(group => {
        const kpis = group.kpis
          .filter(kpi => filteredKpiKeys.indexOf(kpi.key) !== -1)
        return { ...group, kpis }
      })
    .filter(group => group.kpis.length)
  },
  filteredKpiKeys: state => {
    const groups = state.settings.targets
    const groupsKeys = Object.keys(state.settings.targets)
    const flatKpiObj = groupsKeys.map(key => groups[key]).reduce((obj, group) => ({ ...obj, ...group }), {})
    const filteredKpiObj = Object.keys(flatKpiObj).filter(key => flatKpiObj[key].include)
    return filteredKpiObj
  },
  filteredKpiValues: (state, getters) => {
    const filteredKpiKeys = getters.filteredKpiKeys
    const kpiValues = getters.kpiValues
    return filteredKpiKeys.reduce((obj, key) => {
      return { ...obj, [key]: kpiValues[key] }
    }, {})
  },
  filteredKpiPercentageValues: (state, getters) => {
    const filteredKpiKeys = getters.filteredKpiKeys
    const kpiValues = getters.kpiPercentageValues
    return filteredKpiKeys.reduce((obj, key) => {
      return { ...obj, [key]: kpiValues[key] }
    }, {})
  },
  kpiValues: (state, getters, rootState, rootgetters) => {
    const areas = state.areas.filter(area => !area.properties.hidden)
    const kpiKeys = rootgetters['data/kpiGroups/kpiKeys']

    if (areas.length) {
      return areas
        .map(area => area.properties.apiData)
        .reduce((obj, item) => {
          if (item) {
            kpiKeys.forEach(key => {
              if (!obj[key]) { obj[key] = 0 }
              obj[key] = obj[key] + (item[key] || 0)
            })
          }
          return obj
        }, {})
    } else {
      return kpiKeys.reduce((obj, key) => ({ ...obj, [key]: 0 }), {})
    }
  },
  kpiTargetValues: (state, getters) => {
    const targets = state.settings.targets
    const filteredKeys = getters.kpiValues
    return Object.keys(targets)
      .map(group =>
        Object.keys(targets[group])
          .reduce((obj, key) => ({ ...obj, [key]: parseFloat(targets[group][key].value, 10) || 0 }), {}))
      .reduce((obj, item) => ({ ...obj, ...item }), {})
  },
  kpiPercentageValues:  (state, getters) => {
    const kpiValues = getters.kpiValues
    const kpiTargetValues = getters.kpiTargetValues
    const keys = Object.keys(kpiValues)
    return keys.reduce((obj, key) => {
      const value = (kpiValues[key] || 0) / (kpiTargetValues[key] || 1)
      return {
        ...obj,
        [key]: isNaN(value) ? 0 : parseFloat(value * 100, 10),
      }
    }, {})
  },
}
