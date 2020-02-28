import getData from '../../lib/get-data'

export const state = () => []

export const mutations = {
  addScenario(state, { includeInAllWorkspaces, ...scenario }) {
    if (includeInAllWorkspaces) {
      state.push(scenario)
    }
  },
}

export const actions = {
  async getScenarios({ commit, dispatch }, locale) {
    const data = await getData({ locale, slug: 'scenarios' })
    data.scenarios.forEach(scenario => commit('addScenario', scenario))
  },
}
