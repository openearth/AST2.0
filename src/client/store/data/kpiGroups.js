import getData from '../../lib/get-data'

export const state = () => []

export const mutations = {
  addKpiGroup(state, group) {
    const kpis = group.kpis.map(kpi => ({
      ...kpi,
      unit: kpi.unit.key,
    }))
    state.push({ ...group, kpis })
  },
}

export const actions = {
  async getKpiGroups({ commit, dispatch }, locale) {
    const data = await getData({ locale, slug: 'kpi-groups' })
    data.kpiGroups.forEach(setting => commit('addKpiGroup', setting))
  },
}

export const getters = {
  getKpis: (state) => {
    let kpis = {}
    state.map(group => {
      group.kpis.map(kpi => kpis[kpi.key] = 0)
    })

    return kpis
  },
}
