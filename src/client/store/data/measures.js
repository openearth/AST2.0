import getData from '../../lib/get-data'
export const state = () => []

export const mutations = {
  addMeasure(state, measure) {
    state.push(measure)
  },
}

export const actions = {
  async getMeasures({ commit }, locale) {
    const data = await getData({ locale, slug: 'measures' })
    data.measures.forEach(measure => commit('addMeasure', measure))
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
}
