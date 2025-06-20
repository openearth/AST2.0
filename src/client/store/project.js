import Vue from 'vue'
import turfArea from '@turf/area'
import turfLength from '@turf/length'
import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'
import get from 'lodash/get'
import round from 'lodash/round'
import unset from 'lodash/unset'
import flatten from 'lodash/flatten'
import MapEventBus, { UPDATE_FEATURE_PROPERTY, REPOSITION, RELOAD_LAYERS, SELECT, REPAINT, DELETE_LAYER } from '../lib/map-event-bus'
import { getApiData, getApiDataForFeature, getRankedMeasures, getPluvfloodParam, getDefaultValueForProjectSetting } from '../lib/get-api-data';
import FileSaver from 'file-saver'
import { DEFAULT_ACTOR } from '../lib/area-actors'
import getLoadedFileContents from '../lib/get-loaded-file-contents'
import validateProject from '../lib/validate-project'
import projectToGeoJson from '../lib/project-to-geojson'
import projectToCsv from '../lib/project-to-csv'
import delay from '../lib/delay'
import exportToPdf from '../lib/export-to-pdf'
import log from '../lib/log';
import calculateFmeasArea from '../lib/calculate-fmeas-area'
import formattedValue from '../lib/formatted-value'
import fetchCoBenefitsFromRivm from '../lib/fetch-rivm-co-benefits'
import convertToImperial from '~/components/unit-output/convert-to-imperial'

const initialState = () => ({
  areas: [],
  legalAccepted: false,
  map: {
    center: {
      lat: 51.9856484,
      lng: 4.380215599999929,
    },
    customLayers: [],
    heatstressLayers: [],
    layers: [],
    zoom: 16.5,
  },
  displayMap: false,
  settings: {
    area: {},
    general: {
      title: '',
    },
    projectArea: {},
    targets: {},
    userViewedProjectSettings: false,
    pluvfloodParam: {},
  },
  measureOverrides: {},
  savedInWorkspace: undefined,
})

function applyKpiOperation(operator, source, item) {
  switch (operator) {
    case 'add':
      return source + (item || 0)
    case 'subtract':
      return source - (item || 0)
    case 'multiply':
      return source * (item || 1)
    case 'divide':
      return (source || 1) / (item || 1)
    case 'to_array':
      return [...(source || []), item]
    default:
      return source + (item || 0)
  }
}

export const state = () => initialState()

export const mutations = {
  import(state, file){
    const newState = merge({}, state, file)

    // Explicitly use stored mapbox features. Since they are object, their
    // values are merged when using `merge()`
    newState.settings.area = file.settings.area
    newState.areas = file.areas

    // We want to test if the user has seen the project area settings. If not,
    // we should try to autofill some values.
    // We test this by checking if some required values are filled in. When the
    // user did filled some in, there will be strings in the settings.
    // If a string is found, the user has seen the settings before
    const someRequiredProjectAreaOptionsAreFilledIn = Object
      .entries(file.settings.projectArea)
      .some(([key, value]) => {
        // The scenarioName is always filled in, ignore this key
        if (key === 'scenarioName') return false

        return typeof value === 'string'
      })

    if (someRequiredProjectAreaOptionsAreFilledIn) {
      newState.settings.userViewedProjectSettings = true
    }

    Object.keys(newState).forEach(key => Vue.set(state, key, newState[key]))
  },
  showMap(state) {
    state.displayMap = true
  },
  setMapZoom(state, value) {
    state.map.zoom = value
  },
  setMapCenter(state, value) {
    state.map.center.lat = value.lat
    state.map.center.lng = value.lng
  },
  setUserViewedProjectSettings(state) {
    state.settings.userViewedProjectSettings = true
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
    const updatedArea = state.areas.find(area => area.id === value.id)
    Object.assign(updatedArea, value)
  },
  updateAreaProperty(state, { id, properties }) {
    const areaToUpdate = state.areas.find(area => area.id === id)
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
  removeAreaProperties(state, { id, propertyPaths = [] }) {
    const areaToUpdate = state.areas.find(area => area.id === id)
    const properties = { ...areaToUpdate.properties }
    propertyPaths.forEach(path => unset(properties, path))
    Vue.set(areaToUpdate, 'properties', properties)
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
  setHeatstressLayers(state, layer) {
    state.map.heatstressLayers.push(layer)
  },
  setHeatstressResults(state, data) {
    Vue.set(state, 'heatstressResults', Object.freeze(data))
  },
  clearHeatstressLayers(state) {
    state.map.heatstressLayers = []
  },
  updateHeatstressLayers(state, value) {
    const layers = state.map.heatstressLayers.find(
      layer => layer.id === value.id,
    )
    Object.assign(layers, value)
  },
  setCustomLayer(state, layer) {
    if (state.map.customLayers === undefined) {
      Vue.set(state.map, 'customLayers', [])
    }
    state.map.customLayers.push(layer)
  },
  setLayer(state, layer) {
    if (state.map.layers === undefined) {
      Vue.set(state.map, 'layers', [])
    }
    state.map.layers.push(layer)
  },
  deleteCustomLayer(state, id) {
    state.map.customLayers = state.map.customLayers.filter(layer => layer.id !== id)
    MapEventBus.$emit(DELETE_LAYER, id)
  },
  toggleProjectAreaNestedSetting(state, { key, option }) {
    state.settings.projectArea[key][option] = !state.settings.projectArea[key][option]
  },
  acceptLegal(state) {
    state.legalAccepted = true
  },
  setLayerOpacity(state, { id, value }) {
    const layers = [ ...state.map.customLayers, ...state.map.layers ]
    layers.forEach(layer => {
      if (id === layer.id) {
        layer.opacity = value
      }
    })
  },
  setLayerVisibility(state, { id, value }) {
    const layers = [ ...state.map.customLayers, ...state.map.layers ]
    layers.forEach(layer => {
      if (id === layer.id) {
        layer.visible = value
        layer.showLegend = value
      }
    })
  },
  setLegendVisibility(state, { id, value }) {
    const layers = [ ...state.map.customLayers, ...state.map.layers ]
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
  setRivmCoBenefits(state, data) {
    Vue.set(state, 'rivmCoBenefits', Object.freeze(data))
  },
  applyOverrideMeasureSetting(state, { measureId, value }) {
    const existingOverride = state.measureOverrides[measureId]
    Vue.set(state.measureOverrides, measureId, merge({}, existingOverride, value))
  },
  setPluvfloodParam(state, payload) {
    state.settings.pluvfloodParam = payload.result
  },
}

export const actions = {
  fetchPluvfloodParam({ commit }, { projectArea, scenarioName }) {
    if (projectArea && scenarioName) {
      return getPluvfloodParam({ projectArea, scenarioName })
        .then(payload => commit('setPluvfloodParam', payload))
    }
  },
  setMapPosition({ commit }, { zoom, center }) {
    zoom && commit('setMapZoom', zoom)
    center && commit('setMapCenter', center)
  },
  createArea({ state, commit, dispatch }, features) {
    const promises = features.map(feature => {
      return new Promise(resolve => {
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
  updateAreaProperties({ commit, dispatch, getters }, { features, properties }) {
    features.forEach(feature => {
      commit('updateAreaProperty', { id: feature.id, properties })
      const updatedFeature = getters.areas.filter(area => area.id === feature.id)

      if (properties.measure || properties.hasOwnProperty('hidden')) {
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
  removeAreaMeasure({ commit }, features) {
    features.forEach(feature => {
      commit('updateAreaProperty', { id: feature.id, properties: { apiData: {} } })
      commit('removeAreaProperties', {
        id: feature.id,
        propertyPaths: [
          'measure',
          'color',
          'defaultInflow',
          'defaultDepth',
          'defaultWidth',
          'defaultRadius',
          'areaInflow',
          'areaDepth',
          'areaWidth',
          'areaRadius',
        ],
      })
    })
    delay(10)
    MapEventBus.$emit(RELOAD_LAYERS)
  },
  async fetchAreaApiData({ state, commit, dispatch }, features) {
    features.forEach(async feature => {
      const projectArea = state.settings.area.properties.area
      const { scenarioName } = state.settings.projectArea

      getApiDataForFeature(feature, projectArea, scenarioName)
        .then(apiData => commit('updateAreaProperty', { id: feature.id, properties: { apiData } }))
        .catch(() => {
          dispatch('removeAreaMeasure', [feature])
          dispatch(
            'notifications/showError',
            { message: `Could not calculate data for ${feature.properties.name}!`, duration: 0 },
            { root: true },
          )
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
  fetchHeatstressData({ state, commit, getters, dispatch, rootGetters }) {
    commit('clearHeatstressLayers')
    const {
      PETCurrentLayerName,
      PETPotentialLayerName,
    } = rootGetters['data/workspaces/heatstressSettings'];

    let features = cloneDeep(getters.areas)

    // Only use the areas that are not hidden
    features = features.filter(feat => !feat.properties.hidden)

    // If the properties are not set use the defaults
    features.forEach(area => {
      area.properties.areaInflow = area.properties.areaInflow ||  area.properties.defaultInflow
      area.properties.areaDepth = area.properties.areaDepth ||  area.properties.defaultDepth
      area.properties.areaWidth = area.properties.areaWidth ||  area.properties.defaultWidth
      area.properties.areaRadius = area.properties.areaRadius ||  area.properties.defaultRadius
    })
    features.push(state.settings.area)

    getApiData('heatstress/reduction', {
      data: {
        type: 'FeatureCollection',
        features,
      },
      PETCurrentLayerName,
      PETPotentialLayerName,
    })
      .then(apiData => {
        const tileSize = 512
        const receivedAt = Date.now()
        const heatstressResults = { entries: {}, receivedAt }
        heatstressResults.entries.heatstressNewTemperature = apiData.newStats.mean
        heatstressResults.entries.heatstressTemperatureDifference = apiData.newStats.mean - apiData.oldStats.mean
        commit('setHeatstressResults', heatstressResults)
        apiData.layers.forEach(layer => {
          const baseUrlLegend = layer.baseUrl.replace('ows', 'wms')
          const heatstressLayer = {
            id: layer.layerName,
            key: layer.id,
            title: layer.title,
            url: `${layer.baseUrl}bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.3.0&request=GetMap&crs=EPSG:3857&srs=EPSG:28992&transparent=True&width=${tileSize}&height=${tileSize}&layers=${layer.layerName}`,
            legendUrl: `${baseUrlLegend}request=GetLegendGraphic&version=1.1.1&format=image/png&layer=${layer.layerName}`,
            visible: false,
            showLegend: false,
            opacity: 1,
            layerType: 'raster',
            tilesize: tileSize,
            layerName: layer.layerName,
          }
          commit('setHeatstressLayers', heatstressLayer)
        })
      })
      .catch(error => {
        dispatch(
          'notifications/showError',
          { message: 'Could not calculate heatstress layers!', duration: 0 },
          { root: true },
        )
        log.error('Problems fetching heatstress layers', error)
        const receivedAt = Date.now()
        commit('setHeatstressResults', { receivedAt })
      })
  },
  bootstrapSettingsProjectArea({ commit }, settings) {
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
  bootstrapSettingsTargets({ commit }, targets) {
    targets.forEach(({ key, kpis }) => {
      const getDefaultValue = value => value !== null ? String(value) : '0'
      const value = kpis.reduce((obj, kpi) => ({
        ...obj,
        [kpi.key]: {
          include: true,
          value: getDefaultValue(kpi.defaultTargetValue),
        },
      }), {})
      commit('setTargets', { key, value })
    })
  },
  bootstrapCustomLayers({ commit }, layers) {
    layers.forEach(layer => {
      commit('setCustomLayer', {
        ...layer,
        visible: false,
        showLegend: false,
        opacity: 1,
      })
    })
  },
  bootstrapLayers({ commit }, layers) {
    layers.forEach(layer => {
      commit('setLayer', { id: layer.id, visible: false, showLegend: false, opacity: 1 })
    })
  },
  setSmartDefaultsForProjectSettings({ commit, state, rootState, dispatch }) {
    const { properties, id,...area } = state.settings.area

    rootState.data.areaSettings
      .filter(({ defaultValueEndpoint }) => defaultValueEndpoint)
      .forEach(async setting => {
        const { defaultValueEndpoint, key } = setting
        const payload = { ...defaultValueEndpoint, area }
        commit( 'loading-default-value-area-settings/isLoading', key, { root: true })
        await getDefaultValueForProjectSetting(payload)
          .then(({ errors, value }) => {
            if (errors) throw errors
            const { isSelect, multiple } = setting
            let type;

            switch (true) {
              case  multiple && !isSelect: { type = 'checkbox'; break; }
              case !multiple && !isSelect: { type = 'radio';    break; }
              case !multiple &&  isSelect: { type = 'select';   break; }
            }

            dispatch('updateProjectAreaSetting', { type, key, value })
          })
          .catch(error => {
            log.error(
              `Could not get default value for "${key}"`,
              { payload },
              error,
            )
          })
          commit( 'loading-default-value-area-settings/isDoneLoading', key, { root: true })
      })
  },
  async updateProjectAreaSetting({ commit, getters, dispatch }, payload ) {
    const { type } = payload

    if (type === 'checkbox') {
      const { key, option, value } = payload
      commit('toggleProjectAreaNestedSetting', { key, option, value })
    }

    if (type === 'radio' || type === 'select') {
      const { key, value } = payload
      commit('setProjectAreaSetting', { key, value })
    }

    if (payload.key === 'scenarioName') {
      dispatch('fetchAreaApiData', getters.areas)
    }

    dispatch('updateMeasuresRanking')
  },
  async updateMeasuresRanking({ state, commit, rootGetters, dispatch }) {
    const filledInRequiredProjectAreaSettings = rootGetters['flow/filledInRequiredProjectAreaSettings']
    const skipAreaSettings = rootGetters['data/workspaces/skipAreaSettings']
    const { projectArea } = state.settings;

    if (!skipAreaSettings && filledInRequiredProjectAreaSettings) {
      getRankedMeasures(projectArea)
        .then(rankedMeasures =>
          commit('data/measures/addMeasuresRanking', rankedMeasures, { root: true }),
        )
        .catch(({ message: title }) => {
          dispatch(
            'notifications/showError',
            { message: `Could not get ranking data for measure: ${title}!`, duration: 0 },
            { root: true },
          )
        })
    }
  },
  async importProject({ state, getters, commit, dispatch, rootGetters, rootState }, event) {

    // Workspaces can have custom scenario names. We need to augment the
    // rootState.data object, which contains the scenarioNames, with the scenarios
    // from the activeWorkspace
    const rootData = cloneDeep(rootState.data)
    const activeWorkspace = rootGetters['data/workspaces/activeWorkspace']
    const workspaceScenarios = cloneDeep(activeWorkspace.scenarios) || []
    const scenarioNames = get(rootData, 'areaSettings').find(({ key }) => key == 'scenarioName')
    scenarioNames.options = [...scenarioNames.options, ...workspaceScenarios]
    const loadedProject = await getLoadedFileContents(event)

    const { name } = event.target.files[0]
    const validProject = validateProject(loadedProject, rootData)
    const { map } = loadedProject
    let reloadAreaApiData = false

    loadedProject.settings.general.title = name.replace('.json', '')

    commit('appMenu/hideMenu', null, { root: true })
    let projectErrors = validProject.errors.filter(error => {

      // Provided scenario name is not available.
      // Remove user-provided and notify user
      if (error.property === 'instance.settings.projectArea.scenarioName' && /is\snot\sone\sof\senum\svalues/.test(error.message)) {
        loadedProject.settings.projectArea.scenarioName = null
        log.warning(
          'The provided scenario name is not known in the workspace',
          'It was reset, the user has been asked to choose a different one',
          { error },
        )
        dispatch(
          'notifications/showWarning',
          { message: this.app.i18n.t('error_scenario_name_reset'), duration: 0, closable: false },
          { root: true },
        )
          .then(notificationId => {
            const unwatch = this.watch(
              () => state.settings.projectArea.scenarioName,
              name => {
                if (name) {
                  unwatch()
                  commit('notifications/remove', notificationId, { root: true })
                }
              },
            )
          })

        return false
      }

      // The server has a different set of kpi's than project. This happens
      // mostly when kpis change server side (adding for instance). The rest of
      // the code should deal with these inconsistencies.
      // There for, we only notify on the console instead of using a notification
      if (/instance\.settings\.targets\.(climate|cost|waterquality)\srequires\sproperty/.test(error.stack)) {
        log.warning(
          'Loaded project kpi\'s did not match with server expectations',
          'Result of the calculations might not be reliable!',
          { error },
        )
        return false
      }

      // The loaded project still has returnTime in its apiData object of the areas.
      // returnTime has been refactored and this property is obsolete.
      // the property should be deleted and the api data should be refetched
      // for the area
      if (error.argument === 'returnTime' && error.name === 'additionalProperties' && /apiData/.test(error.property)) {
        log.info(error)
        const apiData = get(loadedProject, error.property.replace('instance.', ''))
        delete apiData.returnTime
        reloadAreaApiData = true
        return false
      }

      return true
    })

    if (projectErrors.length > 0) {
      log.error('Invalid project', projectErrors)
      throw new Error('Invalid project')
    } else {
      const projectArea = get(loadedProject, 'settings.area.properties.area')
      const scenarioName = get(loadedProject, 'settings.projectArea.scenarioName')
      await dispatch('fetchPluvfloodParam', { projectArea, scenarioName })

      commit('import', loadedProject)
      dispatch('updateMeasuresRanking')

      if (reloadAreaApiData && scenarioName) {
        dispatch('fetchAreaApiData', getters.areas)
      }

      MapEventBus.$emit(RELOAD_LAYERS)
      MapEventBus.$emit(REPOSITION, { zoom: map.zoom, center: map.center })

      if (loadedProject.savedInWorkspace !== undefined && loadedProject.savedInWorkspace !== activeWorkspace.name) {
        log.warning('Loaded project has been saved under different workspace!', {
          currentWorkspace: activeWorkspace.name,
          projectsWorkspace: loadedProject.savedInWorkspace,
        })
        const datoMessage = this.app.i18n.t('saved_in_different_workspace')
        const message = `${ datoMessage } "${ loadedProject.savedInWorkspace.replace('-', '.') }"`
        dispatch(
          'notifications/showWarning',
          { message, duration: 10000 },
          { root: true },
        )
      }
    }
  },
  saveProject({ state, rootGetters, commit }) {
    const { title } = state.settings.general
    const workspace = rootGetters['data/workspaces/activeWorkspace'].name
    let savedState = cloneDeep(state)
    savedState.savedInWorkspace = workspace
    // Reset heatstresslayers while exporting, because the layers in the geoserver
    // are removed every day.
    delete savedState.map.heatstressLayers
    const blob = new Blob([JSON.stringify(savedState, null, 2)], { type: 'application/json' })
    commit('appMenu/hideMenu', null, { root: true })
    return FileSaver.saveAs(blob, `${title || 'ast_project'}.json`)
  },
  async exportProject({ state, getters, rootState, rootGetters, commit, dispatch }, format) {
    const A_tot = state.settings.area.properties.area
    const A_p = state.settings.pluvfloodParam.A_p
    const Frac_RA = state.settings.pluvfloodParam.Frac_RA
    const { title } = state.settings.general
    const kpiKeysUnitMap = rootGetters['data/kpiGroups/kpiKeysUnitMap']
    const isImperial = rootGetters['data/workspaces/activeWorkspace'].unitSystem === 'imperial'
    let data
    let type
    switch (format) {
      case 'csv':
        data = projectToCsv(
          getters.areas,
          Object.keys(getters.kpiValues),
          kpiKeysUnitMap,
          rootGetters['data/measures/measureById'],
          { A_tot, A_p, Frac_RA },
          isImperial,
        )
        type = 'text/csv'
        break;
      case 'geojson':
        data = projectToGeoJson(getters.areas)
        type = 'application/json'
        break;
      case 'pdf':
        commit('flow/showPdfExport', null, { root: true })
        /*
          exportToPdf triggers print dialog box, which does not return a data blob.
          Therefore, we return early here.
        */
        await exportToPdf({ locale: rootState.i18n.locale, project: state, title: state.settings.general.title })
        commit('flow/hidePdfExport', null, { root: true })
        return
      default:
        return
    }

    const blob = new Blob([data], { type })
    if (data) {
      return FileSaver.saveAs(blob, `${title || 'ast_project'}.${format}`)
    } else {
      dispatch(
        'notifications/showError',
        { message: 'Could not save data' },
        { root: true },
      )
    }
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
  applyDefaultValuesToAreaSettings({ dispatch, rootState, rootGetters }) {
    const activeWorkspace = rootGetters['data/workspaces/activeWorkspace']
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
  async fetchRivmCoBenefits({ state, commit, dispatch }) {
    // We clone to get rid of the Vue Observer properties
    const areas = cloneDeep(state.areas)
    const projectArea = cloneDeep(state.settings.area)
    const receivedAt = Date.now()

    try {
      const data = await fetchCoBenefitsFromRivm({ areas, projectArea })

      const entries = flatten((data.assessmentResults || []).map(item => get(item, 'entries', [])))
      commit('setRivmCoBenefits', { receivedAt, entries })
    }
    catch(error) {
      log.error('Problem fetching RIVM data', error)
      dispatch(
        'notifications/showError',
        { message: 'There was a problem fetching your green benefits data' },
        { root: true },
      )
      commit('setRivmCoBenefits', { receivedAt })
    }
  },
  async updateMeasureColor({ state, commit }, { measureId, hex }) {
    commit('applyOverrideMeasureSetting', { measureId, value: { color: { hex } } })

    state.areas
      .filter(area => area.properties.measure === measureId)
      .forEach(area => {
        commit('updateAreaProperty', { id: area.id, properties: { color: hex } })
        MapEventBus.$emit(REPAINT, area)
      })
  },
}

export const getters = {
  tableClimateAndCosts: (state, getters, rootState, rootGetters) => {
    if (state.areas.length) {
      const measureById = rootGetters['data/measures/measureById']
      const kpiKeys = ['storageCapacity', 'Fmeas_area', 'groundwater_recharge', 'evapotranspiration', 'tempReduction', 'coolSpot', 'constructionCost', 'maintenanceCost']
      const kpiKeysTitleMap = rootGetters['data/kpiGroups/kpiKeysTitleMap']
      const kpiKeysUnitMap = rootGetters['data/kpiGroups/kpiKeysUnitMap']
      const kpiKeysDecimalScaleMap = rootGetters['data/kpiGroups/kpiKeysDecimalScaleMap']
      const activeWorkspace = rootGetters['data/workspaces/activeWorkspace']

      const toDecimalPricision = (value, precision = 2) => round(value, precision)
      const measueTitleForId = id => get(measureById(id), 'title')
      const kpiTitleByKey = key => `${kpiKeysTitleMap[key]}`
      const convertToCorrectUnit = (value, unit) => activeWorkspace.unitSystem === 'imperial'
        ? convertToImperial(value, unit)
        : value

      const measureValueMap = getters.areas
        .reduce((obj, area) => {
          if (!area.properties.hasOwnProperty('measure')) return obj

          const measureId = area.properties.measure
          const actor = area.properties.actor || DEFAULT_ACTOR
          const values = [
            area.properties.area,
            ...kpiKeys.map(key => get(area, `properties.apiData[${key}]`)),
          ]

          obj[actor] = obj[actor] || {}
          if (obj[actor][measureId] === undefined) {
            obj[actor][measureId] = values
          } else {
            values.forEach((value, index) => {
              if (index === 2) {
                return Array.isArray(obj[actor][measureId][index])
                ? obj[actor][measureId][index].push(value)
                : obj[actor][measureId][index] = [obj[actor][measureId][index], value]
              }
              obj[actor][measureId][index] += value
            })
          }

          const A_tot = state.settings.area.properties.area
          const A_p = state.settings.pluvfloodParam.A_p
          const Frac_RA = state.settings.pluvfloodParam.Frac_RA
          const Fmeas_area = calculateFmeasArea(A_tot, A_p, Frac_RA, obj[actor][measureId][2])
          obj[actor][measureId][2] = Fmeas_area

          return obj
        }, {})

      const rowSetHeaders = Object.keys(measureValueMap).sort().reverse();
      return {
        title: rootState.i18n.messages.climate_and_costs,
        header: [
          rootState.i18n.messages.measure,
          rootState.i18n.messages.surface,
          ...kpiKeys.map(kpiTitleByKey),
        ],
        rowSetHeaders: rowSetHeaders,
        units: [
          '',
          'surface',
          ...kpiKeys.map(key => kpiKeysUnitMap[key]),
        ],
        rowSets: rowSetHeaders.map(key => Object.entries(measureValueMap[key])
          .map(([id, values]) => {
            const [surface, ...kpiValues] = values
            return [
              measueTitleForId(id),
                formattedValue(toDecimalPricision(convertToCorrectUnit(surface, 'surface'), 2), activeWorkspace.thousandSeparator, activeWorkspace.decimalSeparator),
              ...kpiValues.map((val, index) => {
                const kpiKey = kpiKeys[index]
                const decimalScale =
                  kpiKeysDecimalScaleMap && kpiKeysDecimalScaleMap[kpiKey]
                const scale = decimalScale ? decimalScale : 0
                const convertedValue = convertToCorrectUnit(val, kpiKeysUnitMap[kpiKey])
                const value = toDecimalPricision(convertedValue, scale)
                return isNaN(value) ? '-' : formattedValue(value, activeWorkspace.thousandSeparator, activeWorkspace.decimalSeparator)
              }),
            ]
          })),
      }
    }
  },

  tableCoBenefits: (state, getters, rootState, rootGetters) => {
    if (state.areas.length) {
      const measureById = rootGetters['data/measures/measureById']
      const kpiKeys = ['filteringUnit', 'captureUnit', 'settlingUnit']
      const kpiKeysTitleMap = rootGetters['data/kpiGroups/kpiKeysTitleMap']
      const kpiKeysUnitMap = rootGetters['data/kpiGroups/kpiKeysUnitMap']
      const kpiKeysDecimalScaleMap = rootGetters['data/kpiGroups/kpiKeysDecimalScaleMap']
      const activeWorkspace = rootGetters['data/workspaces/activeWorkspace']

      const toDecimalPricision = (value, precision = 2) => round(value, precision)
      const measueTitleForId = id => get(measureById(id), 'title')
      const kpiTitleByKey = key => `${kpiKeysTitleMap[key]}`
      const convertToCorrectUnit = (value, unit) => activeWorkspace.unitSystem === 'imperial'
        ? convertToImperial(value, unit)
        : value

      const measureValueMap = getters.areas
        .reduce((obj, area) => {
          if (!area.properties.hasOwnProperty('measure')) return obj

          const measureId = area.properties.measure
          const actor = area.properties.actor || DEFAULT_ACTOR
          const values = [
            area.properties.area,
            ...kpiKeys.map(key => get(area, `properties.apiData[${key}]`)),
          ]

          obj[actor] = obj[actor] || {}

          if (obj[actor][measureId] === undefined) {
            obj[actor][measureId] = values
          } else {
            values.forEach((value, index) => (obj[actor][measureId][index] += value))
          }

          return obj
        }, {})

      const rowSetHeaders = Object.keys(measureValueMap).sort().reverse();

      return {
        title: rootState.i18n.messages.co_benefits,
        header: [
          rootState.i18n.messages.measure,
          rootState.i18n.messages.surface,
          ...kpiKeys.map(kpiTitleByKey),
        ],
        rowSetHeaders: rowSetHeaders,
        units: [
          '',
          'surface',
          ...kpiKeys.map(key => kpiKeysUnitMap[key]),
        ],
        rowSets: rowSetHeaders.map(key => Object.entries(measureValueMap[key])
          .map(([id, values]) => {
            const [surface, ...kpiValues] = values
            return [
              measueTitleForId(id),
              formattedValue(toDecimalPricision(convertToCorrectUnit(surface, 'surface'), 2), activeWorkspace.thousandSeparator, activeWorkspace.decimalSeparator),
              ...kpiValues.map((val, index) => {
                const kpiKey = kpiKeys[index]
                const decimalScale = kpiKeysDecimalScaleMap && kpiKeysDecimalScaleMap[kpiKey]
                const scale = decimalScale ? decimalScale : 0;
                const convertedValue = convertToCorrectUnit(val, kpiKeysUnitMap[kpiKey])
                const value = toDecimalPricision(convertedValue, scale)
                return isNaN(value) ? '-' : formattedValue(value, activeWorkspace.thousandSeparator, activeWorkspace.decimalSeparator)
              }),
            ]
          })),
      }
    }
  },

  areas: state => {
    return state.areas.map(feature => {
      let area;
      let length;
      let radius;
      let width;
      switch (feature.geometry.type) {
        case 'LineString':
          width = feature.properties.areaWidth || feature.properties.defaultWidth
          length = turfLength(feature.geometry) * 1000
          area = length * parseFloat(width)
          break
        case 'Point':
          radius = feature.properties.areaRadius || feature.properties.defaultRadius
          area = Math.PI * (radius * radius)
          break
        case 'Polygon':
          area = turfArea(feature.geometry)
          break
        default:
          area = 0
      }

      return merge({}, feature, { properties: { area, length, radius } })
    })
  },
  areasByMeasure: (state, getters, rootState, rootGetters) => {
    const measureById = rootGetters['data/measures/measureById']
    return getters.areas.reduce((obj, area) => {
      const measureId = area.properties.measure

      if (measureId) {
        if (!obj[measureId]) {
          obj[measureId] = {
            measure: measureById(measureId),
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
    const kpiKeysOperatorMap = rootgetters['data/kpiGroups/kpiKeysOperatorMap']

    if (areas.length) {
      const AllKpiValues = areas
        .map(area => area.properties.apiData)
        .reduce((obj, item) => {
          if (item) {
            kpiKeys.forEach(key => {
              if (!obj[key]) { obj[key] = 0 }
              obj[key] = applyKpiOperation(
                  kpiKeysOperatorMap[key],
                  obj[key],
                  item[key],
                )
            })
          }
          return obj
        }, {})

      const A_tot = state.settings.area.properties.area
      const A_p = state.settings.pluvfloodParam.A_p
      const Frac_RA = state.settings.pluvfloodParam.Frac_RA
      const { Fmeas_area: Fmeas_area_list, ...kpiValues } = AllKpiValues
      const Fmeas_area = calculateFmeasArea(A_tot, A_p, Frac_RA, Fmeas_area_list)
      return { ...kpiValues, Fmeas_area }
    } else {
      return kpiKeys.reduce((obj, key) => ({ ...obj, [key]: 0 }), {})
    }
  },
  kpiTargetValues: state => {
    const targets = state.settings.targets
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
  heatstressLayers: state => {
    return state.map.heatstressLayers
  },
  customLayers: state => {
    return state.map.customLayers
  },
  layers: (state, getters, rootState, rootGetters) => {
    const { layers: rootLayers = [] } = rootGetters['data/workspaces/activeWorkspace'] || {}
    return state.map.layers
      .filter(layer => rootLayers.some(rootLayer => rootLayer.id === layer.id))
      .map(({ id, visible, opacity, showLegend }) => ({
        ...rootGetters['data/layers/constructed'].find(layer => layer.id === id),
        visible,
        showLegend,
        opacity,
      }))
  },
  settingsProjectArea: state => {
    return state.settings.projectArea
  },
}
