import getData from '../../lib/get-data'

export const state = () => []

export const mutations = {
  addUnit(state, unit) {
    state.push(unit)
  },
}

export const actions = {
  async getUnits({ commit, dispatch }) {
    const data = await getData({ slug: 'units' })
    data.units.forEach(unit => commit('addUnit', unit))
  },
}

export const getters = {
  displayValue: (state, getters, rootState, rootGetters) => (key) => {
    switch(key) {
      case 'currency':
        return rootGetters['data/workspaces/activeWorkspace'].currencySymbol
      case 'currency_per_year':
        return `${rootGetters['data/workspaces/activeWorkspace'].currencySymbol}/${rootState.i18n.messages.year}`
      case 'years':
        return rootState.i18n.messages.years
      case 'Ratemmy':
        return `mm/${rootState.i18n.messages.year}`
      default:
        return state.find(unit => unit.key === key)['metric']
    }
  },
}
