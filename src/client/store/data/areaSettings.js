import getData from '../../lib/get-data'
export const state = () => []

export const mutations = {
  addSetting(state, setting) {
    state.push(setting)
  }
}

export const actions = {
  async getAreaSettings({ commit }, locale) {
    const data = await getData({ locale, slug: 'area-settings' })
    data.areaSettings.forEach(setting => commit('addSetting', setting))
  }
}
