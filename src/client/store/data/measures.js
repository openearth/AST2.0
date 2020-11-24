import Vue from 'vue'
import getData from '../../lib/get-data'
import get from 'lodash/fp/get'
import log from '../../lib/log'

export const state = () => []

export const mutations = {
  addMeasure(state, { scenarios, ...measure }) {
    const scenarioNames = scenarios.map(({ value }) => value)
    state.push({ ...measure, scenarioNames })
  },

  addMeasuresRanking(state, rankedMeasures) {
    const measures = state.filter(measure => measure.measureId !== '0')

    measures.forEach(measure => {
      const rankedMeasure = rankedMeasures.find(item => measure.measureId === String(item.ast_id))
      if (rankedMeasure) {
        Vue.set(measure, 'systemSuitability', rankedMeasure.system_suitability)
      } else {
        log.error(`Can't set systemSuitability for measure ${measure.measureId}`, measure)
        throw new Error(measure.title)
      }
    })
  },
}

export const actions = {
  async getMeasures({ commit }, locale) {
    const data = await getData({ locale, slug: 'measures' })
    data.measures.forEach(measure => commit('addMeasure', measure))
  },
}

export const getters = {
  workspaceMeasures: (storedMeasures, getters, rootState, rootGetters) => {
    const activeWorkspace = rootGetters['data/workspaces/activeWorkspace']
    const settingsProjectArea = rootGetters['project/settingsProjectArea']
    const userMeasureOverrides = rootState.project.measureOverrides
    const workspaceMeasures = get('measures', activeWorkspace)
    const excludeAllMeasures = get('excludeAllMeasures', activeWorkspace)

    if (Boolean(workspaceMeasures) === false) return storedMeasures

    const resetToExcludeAllMeasuresSetting = measure => ({
      ...measure,
      workspaceInclude: excludeAllMeasures ? false : measure.workspaceInclude,
    })

    const applyOverrideMeasureData = measure => ({
      ...measure,
      ...workspaceMeasures[measure.measureId],
    })

    const applyUserOverrideMeasureData = measure => ({
      ...measure,
      ...userMeasureOverrides[measure.measureId],
    })

    const markMeasureAsFeatured = measure => ({
      ...measure,
      featured: (measure.scenarioNames || []).includes(settingsProjectArea.scenarioName),
    })

    const measureMarkedForInclusion = ({ workspaceInclude }) => workspaceInclude === true

    return storedMeasures
      .map(resetToExcludeAllMeasuresSetting)
      .map(applyOverrideMeasureData)
      .map(applyUserOverrideMeasureData)
      .map(markMeasureAsFeatured)
      .filter(measureMarkedForInclusion)
  },
  measureById: (state, { workspaceMeasures }) => id => {
    const measure = workspaceMeasures.find(measure => measure.measureId === id)

    if (id === '') {
      return undefined
    }

    if (measure) {
      return measure
    } else {
      log.error(`Could not find measure with id: ${id}`)
      return state.find(measure => measure.measureId === '0')
    }
  },
  measureDetails: (state, { workspaceMeasures }) => slug => {
    const measure = workspaceMeasures.find(measure => measure.slug === slug)
    if (measure) {
      return measure
    } else {
      return state.find(measure => measure.measureId === '0')
    }
  },
}
