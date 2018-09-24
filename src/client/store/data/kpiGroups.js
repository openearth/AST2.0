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
    dispatch('project/bootstrapSettingsTargets', data.kpiGroups, { root: true })
  },
}

export const getters = {
  kpiKeys: state => {
    let keys = []

    state.forEach(group => {
      group.kpis.forEach(kpi => {
        keys.push(kpi.key)
      })
    })

    return keys
  },
}
