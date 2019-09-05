import Vue from 'vue'
import getData from '../../lib/get-data'
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
  workspaceMeasures: (state, getters, rootState, rootGetters) => {
    const overrideData = get(
      'measures',
      rootGetters['data/workspaces/activeWorkspace'],
    )
    if (overrideData) {
      const measureIds = Object.keys(overrideData)
      return state
        .filter(({ measureId }) => measureIds.includes(measureId))
        .map(measure => ({ ...measure, ...overrideData[measure.measureId] }))
    } else {
      return state
    }
  },
      if (a.title < b.title) return -1
      if (a.title > b.title) return 1
      return 0
    })
  },
  measuresBySystemSuitability: (state, getters) => {
    return [...state].sort((a, b) => b.systemSuitability - a.systemSuitability)
  },
  measureById: state => id => {
    return state.find(measure => measure.measureId === id)
  },
  measureDetails: state => slug => {
    return state.find(measure => measure.slug === slug)
  },
}
