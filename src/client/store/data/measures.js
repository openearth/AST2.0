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
