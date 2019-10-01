import randomColor from '../../lib/random-color';
import { getRealApiData } from "../../lib/get-api-data";
export const state = () => []

export const mutations = {
  addLayer(state, layer) {
    state.push(layer)
  },
}

export const actions = {
  async getCustomMapLayers({ commit, dispatch }, parameters) {
    const body = {
      url: parameters.serverUrl,
      type: parameters.serverType,
    }
    const data = await getRealApiData('maplayers', body)
    return data
  },

  addCustomTilesToLayers({ state, commit, dispatch }, customLayers) {
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

export const getters = {
  constructed(state) {
    return state.map(layer => {
      const { baseurl, service, tilesize, bbox, format, srs, layers, version, transparent, styles, ...rest } = layer
        return {
          ...rest,
          tilesize,
          deleteLayer: layer.deleteLayer,
          backgroundColor: layer.backgroundColor,
        }
    })
  },
}
