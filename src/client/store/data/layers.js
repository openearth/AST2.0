import randomColor from '../../lib/random-color';

function WMSLayer(layer) {
  const { baseurl, service, tilesize, bbox, format, srs, layers, version, transparent, styles, ...rest } = layer
    if (baseurl === 'mapbox://mapbox.satellite') {
      return {
        ...rest,
        url: baseurl,
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
}

function MapLayer(layer) {
  return {
    id: layer.id,
    title: layer.title,
    layerType: 'raster',
    url: layer.url,
    showLegend: false,
    tilesize: 256,
    opacity: 1,
    visible: false,
    backgroundColor: randomColor(),
  }
}

// This state is not used directly. layers are loaded from the workspace.
// This file exists to let the `constructed` have a place to live.
// The `state` const need to be exported in order for the getter to be available
export const state = () => undefined

export const getters = {
  constructed(state, getters, rootState, rootGetters) {
    const { layers = [] } = rootGetters['data/workspaces/activeWorkspace'] || {}

    return layers.map(layer => {
      switch (layer._modelApiKey) {
        case 'wms_layer':
          return WMSLayer(layer)
        case 'map_layer':
          return MapLayer(layer)
      }
    })
  },
}
