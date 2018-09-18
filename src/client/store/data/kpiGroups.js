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
  kpiValues: state => {
    let values = {}

    state.forEach(group => {
      group.kpis.forEach(kpi => {
        const randomNum = Math.random() * 10
        const num = Math.round(randomNum)

        values[kpi.key] = num
      })
    })

    return values
  },
}
