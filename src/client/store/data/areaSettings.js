import getData from '../../lib/get-data'
export const state = () => []

export const mutations = {
  addSetting(state, setting) {
    state.push(setting)
  },
}

export const actions = {
  async getAreaSettings({ commit, dispatch }, locale) {
    const data = await getData({ locale, slug: 'area-settings' })
    data.areaSettings.forEach(setting => {
      commit('addSetting', setting)
    })
    dispatch('project/bootstrapSettingsProjectArea', data.areaSettings, { root: true })
  },
}

export const getters = {
  overriddenAreaSettings(state, getters, rootState, rootGetters) {
    const activeWorkspace = rootGetters['data/workspaces/activeWorkspace']
    return state.map(item => {
      const { options, defaultValue, ...itemRest } = item
      const { key } = itemRest

      const overriddenOptions = activeWorkspace[key] && activeWorkspace[key].options
        ? activeWorkspace[key].options
        : options

      const overriddenDefaultValue = activeWorkspace[key] && activeWorkspace[key].defaultValue
        ? activeWorkspace[key].defaultValue
        : defaultValue

      return {
        ...itemRest,
        options: overriddenOptions,
        defaultValue: overriddenDefaultValue,
      }
    })
  },
}
