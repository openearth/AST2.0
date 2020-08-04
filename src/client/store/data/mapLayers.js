import randomColor from '../../lib/random-color';

// This state is not used directly. mapLayers are loaded from the workspace.
// This file exists to let the `constructed` have a place to live.
// The `state` const need to be exported in order for the getter to be available
export const state = () => []

export const getters = {
  constructed(state, getters, rootState, rootGetters) {
    const { mapLayers = [] } = rootGetters['data/workspaces/activeWorkspace'] || {}
    return mapLayers.map(layer => {
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
    })
  },
}
