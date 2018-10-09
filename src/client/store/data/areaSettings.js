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
      if (setting.key === 'multifunctionality') {
        // necessary because api request is invalid if value is not a number
        setting.options.forEach(option => option.value = parseFloat(option.value))
      }
      commit('addSetting', setting)
    })
    dispatch('project/bootstrapSettingsProjectArea', data.areaSettings, { root: true })
  },
}
