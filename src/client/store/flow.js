import isObject from 'lodash/isObject'
import getViewPath from '../lib/get-view-path'
import isValidNumber from '../lib/is-valid-number'
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
}

export const getters = {
  acceptedLegal(state, getters, rootState) {
    return rootState.project.legalAccepted
  },
  createdProjectArea(state, getters, rootState) {
    return !!rootState.project.settings.area.properties
  },
  filledInRequiredProjectAreaSettings(state, getters, rootState) {
    const projectArea = rootState.project.settings.projectArea
    return !Object.keys(projectArea)
      .filter(setting => !isObject(projectArea[setting]))
      .map(key => projectArea[key])
      .filter(value => value === null)
      .length
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
