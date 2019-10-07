import getData from '../../lib/get-data'
import randomColor from '../../lib/random-color';
import { getRealApiData } from "../../lib/get-api-data";
export const state = () => []

export const mutations = {
  addLayer(state, layer) {
    state.push(layer)
  },
}

export const actions = {
  async getMapLayers({ commit, dispatch }, locale) {
    const data = await getData({ locale, slug: 'map-layers' })
    data.mapLayers.forEach(layer => {
      commit('addLayer', layer)
    })
    dispatch('project/bootstrapMapLayers', data.mapLayers, { root: true })
  },
}

export const getters = {
  constructed(state) {
    return state.map(layer => {
      return {
       id: layer.id,
       title: layer.title,
       layerType: 'raster',
       url: layer.url,
       showLegend: false,
       tilesize: 256,
       opacity: 1,
       visible: true,
       backgroundColor: randomColor(),
     }
    })
  },
}
