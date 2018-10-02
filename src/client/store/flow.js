import isObject from 'lodash/isObject'
import getViewPath from '../lib/get-view-path'

export const state = () => ({
  fullPath: {},
})

export const mutations = {
  setRoute(state, { fullPath }) {
    state.fullPath = fullPath
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
    const { projectArea } = rootState.project.settings
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
      .filter(value => value === null || value === '' || isNaN(parseFloat(value, 10)))
      .length
  },
  currentFilledInLevel(state, getters, rootState) {
    const { locale } = rootState.i18n
    let level = 0;

    if (getters.acceptedLegal) {
      level = level + 1 // 1
    } else {
      return { level, uri: `/${locale}/` }
    }

    if (getters.createdProjectArea) {
      level = level + 1 // 2
    } else {
      return { level, uri: `/${locale}/new-project/` }
    }

    if (getters.filledInRequiredProjectAreaSettings) {
      level = level + 1 // 3
    } else {
      return { level, uri: `/${locale}/settings/project-area/` }
    }

    if (getters.filledInTargets) {
      level = level + 1 // 4
    } else {
      return { level, uri:  `/${locale}/settings/project-target` }
    }

    level = level + 1 // 5
    return { level, uri: '' }
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
