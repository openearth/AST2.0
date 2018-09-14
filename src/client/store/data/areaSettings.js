import getData from '../../lib/get-data'
export const state = () => []

export const mutations = {
  addSetting(state, setting) {
    state.push(setting)
  },
}

export const actions = {
  async getAreaSettings(ctx, locale) {
    const data = await getData({ locale, slug: 'area-settings' })
    data.areaSettings.forEach(setting => ctx.commit('addSetting', setting))
    ctx.dispatch('project/bootstrapSettings', data.areaSettings, { root: true })
  },
}
