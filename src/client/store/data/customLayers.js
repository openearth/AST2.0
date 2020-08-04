import randomColor from '../../lib/random-color';
import { getApiData } from "../../lib/get-api-data";
export const state = () => []

export const mutations = {
  addLayer(state, layer) {
    state.push(layer)
  },
}

export const actions = {
  // @REFACTOR :: Why is an action used as a API getter function?
  async getCustomMapLayers(ctx, parameters) {
    const body = {
      url: parameters.serverUrl,
      type: parameters.serverType,
    }
    const data = await getApiData('maplayers', body)
    return data
  },

  addCustomTilesToLayers({ commit, dispatch }, customLayers) {
    const newLayers = customLayers.map(source => {
      const id = source.id ? source.id : source.name.split(" ")[0]
      const mapLayer = {
        id: id,
        title: source.name,
        layerType: 'raster',
        url: source.tiles,
        showLegend: false,
        tilesize: 256,
        opacity: 1,
        visible: true,
        deleteLayer: true,
        backgroundColor: randomColor(),
      }
      commit('addLayer', mapLayer)
      return mapLayer
    })
    dispatch('project/bootstrapCustomLayers', newLayers, { root: true })
  },
}
