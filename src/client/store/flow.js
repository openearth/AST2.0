import get from 'lodash/get'
import isObject from 'lodash/isObject'
import getViewPath from '../lib/get-view-path'
import isValidNumber from '../lib/is-valid-number'
import log from '../lib/log'
import {
  LEVEL_NO_LEGAL,
  LEVEL_LEGAL,
  LEVEL_PROJECT_AREA,
  LEVEL_PROJECT_AREA_SETTINGS,
  LEVEL_SETTINGS,
} from '../lib/flow-levels';

export const state = () => ({
  fullPath: {},
  export: false,
  scenarios: false,
  pdfExport: false,
})

export const mutations = {
  setRoute(state, { fullPath }) {
    state.fullPath = fullPath
  },

  showExport(state) {
    state.export = true
  },

  hideExport(state) {
    state.export = false
  },

  showScenarios(state) {
    state.scenarios = true
  },

  showPdfExport(state) {
    state.pdfExport = true
  },

  hideScenarios(state) {
    state.scenarios = false
  },

  hidePdfExport(state) {
    state.pdfExport = false
  },
}

export const getters = {
  acceptedLegal(state, getters, rootState) {
    return rootState.project.legalAccepted
  },
  projectAreaSizeIsBelowThreshold(state, getters, rootState) {
    const area = get(rootState, 'project.settings.area.properties.area', 0)
    const threshold = 10000000

    return area < threshold
  },
  createdProjectArea(state, getters, rootState) {
    return !!rootState.project.settings.area.properties && getters.projectAreaSizeIsBelowThreshold
  },
  filledInRequiredProjectAreaSettings(state, getters, rootState) {
    const { A_p, Frac_RA } = rootState.project.settings.pluvfloodParam
    const projectArea = rootState.project.settings.projectArea

    const settingsFilledIn = !Object.keys(projectArea)
      .filter(setting => !isObject(projectArea[setting]))
      .map(key => projectArea[key])
      .filter(value => value === null)
      .length

    if ( (!A_p || !Frac_RA) && settingsFilledIn ) {
      setTimeout(() => {
          if (
            !rootState.project.settings.pluvfloodParam.A_p ||
            !rootState.project.settings.pluvfloodParam.Frac_RA
          ){
            log.info('Pluvflood parameters are not available yet. It seems to take a while')
          }
      }, 1000)
    }

    return A_p && Frac_RA && settingsFilledIn
  },
  filledInTargets(state, getters, rootState, rootGetters) {
    const { targets } = rootState.project.settings
    const filteredKpiKeys = rootGetters['project/filteredKpiKeys']
    const flatObject = Object.keys(targets).reduce((obj, key) => ({ ...obj, ...targets[key] }), {})
    return !filteredKpiKeys
      .map(key => flatObject[key])
      .map(obj => obj.value)
      .filter(value => value === null || value === '' || isNaN(parseFloat(value, 10)) || !isValidNumber(value))
      .length
  },
  filledInSettings(state, getters) {
    return getters.filledInRequiredProjectAreaSettings &&
           getters.filledInTargets
  },
  currentFilledInLevel(state, getters, rootState) {
    const { locale } = rootState.i18n

    if (!getters.acceptedLegal) {
      return { level: LEVEL_NO_LEGAL, uri: `/${locale}/` }
    }

    if (!getters.createdProjectArea) {
      return { level: LEVEL_LEGAL, uri: `/${locale}/new-project/` }
    }

    if (!getters.filledInRequiredProjectAreaSettings) {
      return { level: LEVEL_PROJECT_AREA, uri: `/${locale}/settings/project-area/` }
    }

    if(!getters.filledInTargets) {
      return { level: LEVEL_PROJECT_AREA_SETTINGS, uri: `/${locale}/settings/project-target/` }
    }

    return { level: LEVEL_SETTINGS, uri: `/${locale}/project/` }
  },
  isNewProjectView({ fullPath }) {
    const view = getViewPath({ fullPath })
    return !!view.path.find(part => part === 'new-project')
  },
  isSettingsView({ fullPath }) {
    const view = getViewPath({ fullPath })
    return !!view.path.find(part => part === 'settings')
  },
  isProjectView({ fullPath }) {
    const view = getViewPath({ fullPath })
    return !!view.path.find(part => part === 'project')
  },
}
