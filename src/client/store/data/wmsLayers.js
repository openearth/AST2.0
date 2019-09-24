import getData from '../../lib/get-data'
import { getRealApiData } from "../../lib/get-api-data";
export const state = () => []

export const mutations = {
  addLayer(state, layer) {
    console.log('layer', layer)
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
      // TODO: id should be in the response from the backend!
      // TODO: source.tiles should be returned from the backend as url (String)
      const id = source.name.split(" ")[0]
      const mapLayer = {
        id: id,
        title: source.name,
        layerType: 'raster',
        url: source.tiles[0],
        tilesize: 256,
        showLegend: false,
        opacity: 1,
        visible: true,
      }
      commit('addLayer', mapLayer)
      return mapLayer
    })
    dispatch('project/bootstrapWmsLayers', newLayers, { root: true })
  },
}

export const getters = {
  constructed(state) {
    return state.map(layer => {
      const { baseurl, service, tilesize, bbox, format, srs, layers, version, transparent, styles, ...rest } = layer
      if (baseurl === 'mapbox://mapbox.satellite') {
        return {
          ...rest,
          url: baseurl,
          tilesize,
        }
      } else if (layer.url) {
        // If url already defined, return directly
        return {
          ...rest,
          imageUrl: layer.url,
          tilesize,
        }
      } else {
        return {
          ...rest,
          url: `${ baseurl }?service=${ service }&layers=${ layers }&request=GetMap&transparent=${ transparent }&version=${ version }&bbox=${ bbox }&srs=${ srs }&crs=${ srs }&format=${ format }&width=${ tilesize }&height=${ tilesize }&styles=${ styles }`,
          tilesize,
          legendUrl:`${ baseurl }?request=GetLegendGraphic&version=${ version }&format=${ format }&layer=${ layers }`,
          imageUrl:`${ baseurl }?service=${ service }&layers=${ layers }&request=GetMap&transparent=${ transparent }&version=${ version }&bbox=645740.01495317,6790054.096628778,665307.8941941746,6809621.975869782&srs=${ srs }&crs=${ srs }&format=${ format }&width=${ tilesize }&height=${ tilesize }&styles=${ styles }`,
        }
      }
    })
  },
}
