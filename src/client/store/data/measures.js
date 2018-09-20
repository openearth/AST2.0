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
  measureById: state => id => {
    return state.find(measure => measure.measureId === id)
  },
  visibleMeasures: (state, getters, rootState) => {
    const hiddenMeasures = rootState.project.hiddenMeasures
    return state.filter(measure => hiddenMeasures.indexOf(measure.measureId) === -1)
  },
}
