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
  displayValue: state => (key) => {
    switch(key) {
      case 'currency':
        return '€'
      case 'currency_per_year':
        return '€/Year'
      default:
        return state.find(unit => unit.key === key)['metric']
    }
  },
}
