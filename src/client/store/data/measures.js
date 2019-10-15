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
      if (rankedMeasure) {
        Vue.set(measure, 'systemSuitability', rankedMeasure.system_suitability)
      } else {
        console.groupCollapsed(
          `%c Error %c Can't set systemSuitability for measure ${measure.measureId} `,
          'background: #F44336; color: #fff; border-radius: 3px 0 0 3px;',
          'background: #263238; color: #eeffff; border-radius: 0 3px 3px 0; font-weight: 400;',
        )
        console.log(measure)
        console.groupEnd()
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
  measureById: (state, { workspaceMeasures }) => id => {
    const measure = workspaceMeasures.find(measure => measure.measureId === id)
    if (measure) {
      return measure
    } else {
      console.groupCollapsed(
        `%c Error %c Could not find measure with id: ${id} `,
        'background: #F44336; color: #fff; border-radius: 3px 0 0 3px;',
        'background: #263238; color: #eeffff; border-radius: 0 3px 3px 0; font-weight: 400;',
      )
      console.trace()
      console.groupEnd()
      return workspaceMeasures.find(measure => measure.measureId === '0')
    }
  },
  measureDetails: (state, { workspaceMeasures }) => slug => {
    const measure = workspaceMeasures.find(measure => measure.slug === slug)
    if (measure) {
      return measure
    } else {
      return workspaceMeasures.find(measure => measure.measureId === '0')
    }
  },
}
