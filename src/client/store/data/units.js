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
  displayValue: (state, getters, rootState) => (key) => {
    switch(key) {
      case 'currency':
        return '€'
      case 'currency_per_year':
        return `€/${rootState.i18n.messages.year}`
      case 'years':
        return rootState.i18n.messages.years
      default:
        return state.find(unit => unit.key === key)['metric']
    }
  },
}
