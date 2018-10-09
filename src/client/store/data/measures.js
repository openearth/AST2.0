import Vue from 'vue'
import getData from '../../lib/get-data'
export const state = () => []

export const mutations = {
  addMeasure(state, measure) {
    state.push(measure)
  },

  addMeasureProperty(state, { property, entry, idKey = 'ID' }) {
    state.forEach(measure => {
      if (measure.measureId === String(entry[idKey])) {
        measure[property] = entry
      }
    })
  },

  addMeasuresRanking(state, rankedMeasures) {
    const measures = state.filter(measure => measure.measureId !== '0')

    measures.forEach(measure => {
      const rankedMeasure = rankedMeasures.find(item => measure.measureId === String(item.id))

      Vue.set(measure, 'systemSuitability', rankedMeasure.systemSuitability)
    })
  },
}

export const actions = {
  async getMeasures({ commit }, locale) {
    const data = await getData({ locale, slug: 'measures' })
    data.measures.forEach(measure => commit('addMeasure', measure))
  },

  async getMeasureProperty({ commit }, property) {
    const data = await getData({ folder: 'tables', slug: `ast_measures_${property}` })
    data.forEach(entry => commit('addMeasureProperty', { property, entry }))
  },

  async getMeasureScores({ commit }) {
    const data = await getData({ folder: 'tables', slug: 'ast_selection_scores' })
    data.forEach(entry => commit('addMeasureProperty', { property: 'scores', idKey: 'AST_ID', entry }))
  },
}

export const getters = {
  orderedMeasures: state => {
    return [...state].sort((a, b) => {
      if (a.title < b.title) return -1
      if (a.title > b.title) return 1
      return 0
    })
  },
  measuresBySystemSuitability: (state, getters) => {
    return [...state].sort((a, b) => {
      if (a.systemSuitability > b.systemSuitability) return -1
      if (a.systemSuitability < b.systemSuitability) return 1
      return 0
    })
  },
  measureById: state => id => {
    return state.find(measure => measure.measureId === id)
  },
  measureDetails: state => slug => {
    return state.find(measure => measure.slug === slug)
  },
}
