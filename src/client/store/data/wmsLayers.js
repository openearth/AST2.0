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

export const getters = {
  constructed(state) {
    return state.map(layer => {
      const { baseurl, service, tilesize, bbox, format, srs, layers, version, transparent, styles, ...rest } = layer
      return {
        ...rest,
        url: `${ baseurl }?service=${ service }&layers=${ layers }&request=GetMap&transparent=${ transparent }&version=${ version }&bbox=${ bbox }&srs=${ srs }&crs=${ srs }&format=${ format }&width=${ tilesize }&height=${ tilesize }&styles=${ styles }`,
        tilesize,
        legendUrl:`${ baseurl }?request=GetLegendGraphic&version=${ version }&format=${ format }&layer=${ layers }`,
        imageUrl:`${ baseurl }?service=${ service }&layers=${ layers }&request=GetMap&transparent=${ transparent }&version=${ version }&bbox=645740.01495317,6790054.096628778,665307.8941941746,6809621.975869782&srs=${ srs }&crs=${ srs }&format=${ format }&width=${ tilesize }&height=${ tilesize }&styles=${ styles }`,
      }
    })
  },
}
