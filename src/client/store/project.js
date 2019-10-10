import Vue from 'vue'
import turfArea from '@turf/area'
import turfLength from '@turf/length'
import merge from 'lodash/merge'
import get from 'lodash/get'
import round from 'lodash/round'
import MapEventBus, { UPDATE_FEATURE_PROPERTY, REPOSITION, RELOAD_LAYERS, SELECT, REPAINT, DELETE_LAYER } from '../lib/map-event-bus'
import { getApiDataForFeature, getRankedMeasures } from "../lib/get-api-data";
import FileSaver from 'file-saver'
import getLoadedFileContents from '../lib/get-loaded-file-contents'
import validateProject from '../lib/validate-project'
import projectToGeoJson from '../lib/project-to-geojson'
import projectToCsv from '../lib/project-to-csv'

const initialState = () => ({
  legalAccepted: false,
  areas: [],
  settings: {
    area: {},
    general: {
      title: '',
    },
    projectArea: {},
    targets: {},
  },
  map: {
    zoom: 16.5,
    center: {
      lat: 52.36599335162853,
      lng: 4.916535879906178,
    },
    wmsLayers: [],
    customLayers: [],
  },
})

export const state = () => (initialState())

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
  setProjectAreaSetting(state, { key, value }) {
    state.settings.projectArea[key] = value
  },
  setTargets(state, { key, value }) {
    state.settings.targets[key] = value
  },
  setTarget(state, { group, key, value }) {
    state.settings.targets[group][key] = { ...state.settings.targets[group][key], ...value }
  },
  setWmsLayer(state, layer) {
    state.map.wmsLayers.push(layer)
  },
  setCustomLayer(state, layer) {
    if (state.map.customLayers === undefined) {
      Vue.set(state.map, 'customLayers', [])
    }
    state.map.customLayers.push(layer)
  },
  deleteCustomLayer(state, id) {
    state.map.customLayers = state.map.customLayers.filter(layer => layer.id !== id)
    MapEventBus.$emit(DELETE_LAYER, id)
  },
  toggleProjectAreaNestedSetting(state, { key, option, value }) {
    state.settings.projectArea[key][option] = !state.settings.projectArea[key][option]
  },
  acceptLegal(state) {
    state.legalAccepted = true
  },
  setLayerOpacity(state, { id, value }) {
    const layers = [ ...state.map.wmsLayers, ...state.map.customLayers ]
    layers.forEach(layer => {
      if (id === layer.id) {
        layer.opacity = value
      }
    })
  },
  setLayerVisibility(state, { id, value }) {
    const layers = [ ...state.map.wmsLayers, ...state.map.customLayers ]
    layers.forEach(layer => {
      if (id === layer.id) {
        layer.visible = value
        layer.showLegend = value
      }
    })
  },
  setLegendVisibility(state, { id, value }) {
    const layers = [ ...state.map.wmsLayers, ...state.map.customLayers ]
    layers.forEach(layer => {
      if (id === layer.id && layer.legendUrl) {
        layer.showLegend = value
      }
    })
  },
  clearProjectArea(state) {
    state.settings.general.title = ''
    state.settings.area = {}
  },
  clearAreas(state) {
    while (state.areas.length) {
      state.areas.pop()
    }
  },
}

export const actions = {
  setMapPosition({ commit }, { zoom, center }) {
    zoom && commit('setMapZoom', zoom)
    center && commit('setMapCenter', center)
  },
  createArea({ state, commit, dispatch }, features) {
    const promises = features.map(feature => {
      return new Promise((resolve, reject) => {
        const area = turfArea(feature.geometry)

        if (!state.settings.area.id) {
          commit('addProjectArea', feature)
          commit('updateProjectAreaProperty', { area, isProjectArea: true })
          resolve()
          return
        }

        commit('addArea', feature)

        const areaNumber = state.areas.length
        dispatch('fetchAreaApiData', [feature])
        commit('updateAreaProperty', { id: feature.id, properties: { name: `Area-${areaNumber}`, hidden: false } })

        setTimeout(() => {
          MapEventBus.$emit(SELECT, feature.id)
        }, 0)
        resolve()
      })
    })
    return Promise.all(promises)
  },
  updateArea({ state, commit, dispatch, getters }, features) {
    features.forEach(feature => {
      const { id } = feature
      const area = turfArea(feature.geometry)

      if (state.settings.area.id === id) {
        commit('updateProjectArea', feature)
        commit('updateProjectAreaProperty', { area })
        dispatch('fetchAreaApiData', getters.areas)
        return
      }

      commit('updateArea', feature)
      dispatch('fetchAreaApiData', getters.areas.filter(area => area.id === feature.id))
    })
  },
  updateAreaProperties({ state, commit, dispatch, getters }, { features, properties }) {
    features.forEach(feature => {
      commit('updateAreaProperty', { id: feature.id, properties })
      const updatedFeature = getters.areas.filter(area => area.id === feature.id)

      if (properties.measure || properties.hasOwnProperty('hidden') ) {
        MapEventBus.$emit(REPAINT, updatedFeature)
      }

      dispatch('fetchAreaApiData', updatedFeature)
    })
  },
  setAreaMeasure({ dispatch }, { features, measure }) {
    const getDefaultValueProperty = property =>  key => {
      const values = measure.defaultValues.find(values => values.key.toLowerCase() === key)
      return values[property]
    }

    const cappedValue = key => input => {
      const defaultMax = getDefaultMax(key)
      const defaultMin = getDefaultMin(key)
      const inputNumber = parseFloat(input)
      if (input === null) {
        return input
      } else if (inputNumber < defaultMin) {
        return defaultMin
      } else if (inputNumber > defaultMax) {
        return defaultMax
      } else {
        return inputNumber
      }
    }

    const getDefaultValue = getDefaultValueProperty('value')
    const getDefaultMin = getDefaultValueProperty('min')
    const getDefaultMax = getDefaultValueProperty('max')

    const cappedInflow = cappedValue('inflow')
    const cappedDepth = cappedValue('depth')
    const cappedWidth = cappedValue('width')
    const cappedRadius = cappedValue('radius')

    features.forEach(feature => {
      const featureProps = feature.properties
      const properties = {
        measure: measure.measureId,
        color: measure.color.hex,
        defaultInflow: getDefaultValue('inflow'),
        defaultDepth: getDefaultValue('depth'),
        defaultWidth: getDefaultValue('width'),
        defaultRadius: getDefaultValue('radius'),
        areaInflow: featureProps.hasOwnProperty('areaInflow') ? cappedInflow(featureProps.areaInflow) : null,
        areaDepth: featureProps.hasOwnProperty('areaDepth') ? cappedDepth(featureProps.areaDepth) : null,
        areaWidth: featureProps.hasOwnProperty('areaWidth') ? cappedWidth(featureProps.areaWidth) : null,
        areaRadius: featureProps.hasOwnProperty('areaRadius') ? cappedRadius(featureProps.areaRadius) : null,
      }
      dispatch('updateAreaProperties', { features: [feature], properties })
    })
  },
  fetchAreaApiData({ state, commit }, features) {
    features.forEach(async (feature) => {
      const projectArea = state.settings.area.properties.area
      const { scenarioName } = state.settings.projectArea
      const apiData = await getApiDataForFeature(feature, projectArea, scenarioName)
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
      let value = null

      if (setting.multiple) {
        value = setting.options.reduce((obj, option) => ({
            ...obj,
            [option.value]: option.value === (setting.defaultValue && setting.defaultValue.value),
          }), {})
      }

      if (setting.isSelect) {
        value = setting.defaultValue.value
      }

      commit('setProjectAreaSetting', { key: setting.key, value })
    })
  },
  bootstrapSettingsTargets({ state, commit }, targets) {
    targets.forEach(({ key, kpis }) => {
      const value = kpis.reduce((obj, kpi) => ({ ...obj, [kpi.key]: { include: true, value: "0" } }), {})
      commit('setTargets', { key, value })
    })
  },
  bootstrapWmsLayers({ state, commit }, layers) {
    layers.forEach(layer => {
      commit('setWmsLayer', { id: layer.id, visible: false, showLegend: false, opacity: 1 })
    })
  },
  bootstrapCustomLayers({ state, commit }, layers) {
    layers.forEach(layer => {
      commit('setCustomLayer', {
        ...layer,
        visible: false,
        showLegend: false,
        opacity: 1,
      })
    })
  },
  async updateProjectAreaSetting({ state, commit, rootGetters, getters, dispatch }, payload ) {
    const { type } = payload

    if (type === 'checkbox') {
      const { key, option, value } = payload
      commit('toggleProjectAreaNestedSetting', { key, option, value })
    }

    if ((type === 'radio') || (type === 'select')) {
      const { key, value } = payload
      commit('setProjectAreaSetting', { key, value })
    }

    if (payload.key === 'scenarioName') {
      dispatch('fetchAreaApiData', getters.areas)
    }

    dispatch('updateMeasuresRanking')
  },
  async updateMeasuresRanking({ state, commit, rootGetters }) {
    const filledInRequiredProjectAreaSettings = rootGetters['flow/filledInRequiredProjectAreaSettings']

    if (filledInRequiredProjectAreaSettings) {
      const { projectArea } = state.settings
      const rankedMeasures = await getRankedMeasures(projectArea)

      commit('data/measures/addMeasuresRanking', rankedMeasures, { root: true })
    }
  },
  async importProject({ state, commit, dispatch, rootGetters, rootState }, event) {
    const { name } = event.target.files[0]
    const loadedProject = await getLoadedFileContents(event)
    const validProject = validateProject(loadedProject, rootState.data)
    const { map } = loadedProject

    loadedProject.settings.general.title = name.replace('.json', '')

    if (validProject.valid) {
      commit('import', loadedProject)
      dispatch('updateMeasuresRanking')

      MapEventBus.$emit(RELOAD_LAYERS)
      MapEventBus.$emit(REPOSITION, { zoom: map.zoom, center: map.center })
    } else {
      console.error(validProject.errors)
    }

    commit('appMenu/hideMenu', null, { root: true })

    if (!validProject.valid) {
      throw new Error('New error')
    }
  },
  saveProject({ state, commit }) {
    const { title } = state.settings.general
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    commit('appMenu/hideMenu', null, { root: true })
    return FileSaver.saveAs(blob, `${title || 'ast_project'}.json`)
  },
  exportProject({ state, getters, rootState, rootGetters }, format) {
    const { title } = state.settings.general
    const data = format === 'csv'
      ? projectToCsv(getters.areas, Object.keys(getters.kpiValues), rootGetters['data/measures/measureById'])
      : projectToGeoJson(getters.areas)
    const type = format === 'csv' ? 'text/csv' : 'application/json';
    const blob = new Blob([data], { type })
    return FileSaver.saveAs(blob, `${title || 'ast_project'}.${format}`)
  },
  clearState({ commit, dispatch, rootState }) {
    const areaSettings = rootState.data.areaSettings
    const kpiGroups = rootState.data.kpiGroups

    commit('clearProjectArea')
    commit('clearAreas')
    MapEventBus.$emit(RELOAD_LAYERS)

    dispatch('bootstrapSettingsProjectArea', areaSettings)
    dispatch('bootstrapSettingsTargets', kpiGroups)
  },
  applyDefaultValuesToAreaSettings({ state, dispatch, rootState, rootGetters }) {
    const activeWorkspace = rootGetters['data/workspaces/activeWorkspace']
    const filledInSettings = rootGetters['flow/fillesInSettings']
    const areaSettings = rootState.data.areaSettings
    const foo = areaSettings.map(item => {
      const { defaultValue, ...itemRest } = item
      const { key } = itemRest

      const overriddenDefaultValue = activeWorkspace[key] && activeWorkspace[key].defaultValue
        ? activeWorkspace[key].defaultValue
        : defaultValue

      return {
        ...itemRest,
        defaultValue: overriddenDefaultValue,
      }
    })

    dispatch('bootstrapSettingsProjectArea', foo)
  },
}

export const getters = {
  tableClimateAndCosts: (state, getters, rootState, rootGetters) => {
    if (state.areas.length) {
      const measureIds = getters.areas.map(area => get(area, 'properties.measure'))
      const measureById = rootGetters['data/measures/measureById']
      const kpiKeys = ['storageCapacity', 'returnTime', 'groundwater_recharge', 'evapotranspiration', 'tempReduction', 'coolSpot', 'constructionCost', 'maintenanceCost']
      const kpiKeysTitleMap = rootGetters['data/kpiGroups/kpiKeysTitleMap']
      const kpiKeysUnitMap = rootGetters['data/kpiGroups/kpiKeysUnitMap']
      const toTwoDecimals = value => round(value, 2)
      const measueTitleForId = id => get(measureById(id), 'title')
      const kpiTitleByKey = key => `${kpiKeysTitleMap[key]}${kpiKeysUnitMap[key] ? ` (${kpiKeysUnitMap[key]})` : ''}`

      const measureValueMap = getters.areas
        .map(area => {
          const values = kpiKeys.map(key => get(area, `properties.apiData[${key}]`))
          return [area.properties.measure, area.properties.area, ...values]
        })
        .reduce((obj, row) => {
          const [measureId, ...values] = row
          if (obj[measureId] === undefined) {
            obj[measureId] = values
          } else {
            values.forEach((value, index) => obj[measureId][index] += value)
          }
          return obj
        }, {})

      return {
        "title": rootState.i18n.messages.climate_and_costs,
        "header": [
          rootState.i18n.messages.measure,
          rootState.i18n.messages.surface,
          ...kpiKeys.map(kpiTitleByKey),
        ],
        rows: Object.entries(measureValueMap)
          .map(([id, values]) => [measueTitleForId(id), ...values.map(toTwoDecimals)]),
      }
    }
  },

  tableCoBenefits: (state, getters, rootState, rootGetters) => {
    if (state.areas.length) {
      const measureIds = getters.areas.map(area => get(area, 'properties.measure'))
      const measureById = rootGetters['data/measures/measureById']
      const kpiKeys = ['filteringUnit', 'captureUnit', 'settlingUnit']
      const kpiKeysTitleMap = rootGetters['data/kpiGroups/kpiKeysTitleMap']
      const kpiKeysUnitMap = rootGetters['data/kpiGroups/kpiKeysUnitMap']
      const toTwoDecimals = value => round(value, 2)
      const measueTitleForId = id => get(measureById(id), 'title')
      const kpiTitleByKey = key => `${kpiKeysTitleMap[key]}${kpiKeysUnitMap[key] ? ` (${kpiKeysUnitMap[key]})` : ''}`

      const measureValueMap = getters.areas
        .map(area => {
          const values = kpiKeys.map(key => get(area, `properties.apiData[${key}]`))
          return [area.properties.measure, area.properties.area, ...values]
        })
        .reduce((obj, row) => {
          const [measureId, ...values] = row
          if (obj[measureId] === undefined) {
            obj[measureId] = values
          } else {
            values.forEach((value, index) => obj[measureId][index] += value)
          }
          return obj
        }, {})

      return {
        "title": rootState.i18n.messages.co_benefits,
        "header": [
          rootState.i18n.messages.measure,
          rootState.i18n.messages.surface,
          ...kpiKeys.map(kpiTitleByKey),
        ],
        rows: Object.entries(measureValueMap)
          .map(([id, values]) => [measueTitleForId(id), ...values.map(toTwoDecimals)]),
      }
    }
  },

  areas: (state) => {
    return state.areas.map(feature => {
      let area;
      let length;
      let radius;
      switch (feature.geometry.type) {
        case 'LineString':
          const width = feature.properties.areaWidth || feature.properties.defaultWidth
          length = turfLength(feature.geometry) * 1000
          area = length * parseFloat(width)
          break;
        case 'Point':
          radius = feature.properties.areaRadius || feature.properties.defaultRadius
          area = Math.PI * (radius * radius)
          break;
        case 'Polygon':
          area = turfArea(feature.geometry)
          break;
        default:
          area = 0
      }

      return merge(
        {},
        feature,
        { properties: { area, length, radius } }
      )
    })
  },
  areasByMeasure: (state, getters, rootState, rootGetters) => {
    return getters.areas.reduce((obj, area) => {
      const measureId = area.properties.measure

      if (measureId) {
        if (!obj[measureId]) {
          obj[measureId] = {
            measure: rootGetters['data/measures/workspaceMeasures'].find(measure => measure.measureId === measureId),
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
  kpiPercentageValues: (state, getters) => {
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
  wmsLayers: (state, getters, rootState, rootGetters) => {
    return state.map.wmsLayers
    .filter(layer => rootState.data.wmsLayers.some(rootLayer => rootLayer.id === layer.id))
    .map(({ id, visible, opacity, showLegend }) => ({
      ...rootGetters['data/wmsLayers/constructed'].find(layer => layer.id === id),
      visible,
      showLegend,
      opacity,
    }))
  },
  customLayers: (state, getters, rootState, rootGetters) => {
    return state.map.customLayers
  },
  settingsProjectArea: (state) => {
    return state.settings.projectArea
  },
}
