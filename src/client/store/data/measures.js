import Vue from 'vue'
import getData from '../../lib/get-data'
import get from 'lodash/fp/get'

export const state = () => []

export const mutations = {
  addMeasure(state, measure) {
    state.push(measure)
  },

  addMeasuresRanking(state, rankedMeasures) {
    const measures = state.filter(measure => measure.measureId !== '0')

    measures.forEach(measure => {
      const rankedMeasure = rankedMeasures.find(item => measure.measureId === String(item.ast_id))

      Vue.set(measure, 'systemSuitability', rankedMeasure.system_suitability)
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

    const markMeasureAsFeatured = measure => ({
      ...measure,
      featured: (measure.scenarioNames || []).includes(settingsProjectArea.scenarioName),
    })

    const measureMarkedForInclusion = ({ workspaceInclude }) => workspaceInclude === true

    return storedMeasures
      .map(resetToExcludeAllMeasuresSetting)
      .map(applyOverrideMeasureData)
      .map(markMeasureAsFeatured)
      .filter(measureMarkedForInclusion)
  },
  orderedMeasures: (state, { workspaceMeasures }) => {
    return [...workspaceMeasures].sort((a, b) => {
      if (a.title < b.title) return -1
      if (a.title > b.title) return 1
      return 0
    })
  },
  measuresBySystemSuitability: (state, { workspaceMeasures }) => {
    return [...workspaceMeasures].sort((a, b) => b.systemSuitability - a.systemSuitability)
  },
  measureById: (state, { workspaceMeasures }) => id => {
    return workspaceMeasures.find(measure => measure.measureId === id)
  },
  measureDetails: (state, { workspaceMeasures }) => slug => {
    return workspaceMeasures.find(measure => measure.slug === slug)
  },
}
