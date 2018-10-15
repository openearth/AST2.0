import getData from '../../lib/get-data'
export const state = () => []

export const mutations = {
  addLayer(state, layer) {
    state.push(layer)
  },
}

export const actions = {
  async getWmsLayers({ commit, dispatch }, locale) {
    const data = await getData({ locale, slug: 'wms-layers' })
    data.wmsLayers.forEach(layer => {
      commit('addLayer', layer)
    })
    dispatch('project/bootstrapWmsLayers', data.wmsLayers, { root: true })
  },
}
