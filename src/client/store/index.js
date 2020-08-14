import  MapEventBus, { REPOSITION } from '../lib/map-event-bus';

export const state = () => ({})

export const plugins = [ store => {
  store.watch(
    (state, getters) => getters['user/workspace'],
    newValue => {
      if (newValue) {
        store.dispatch('data/workspaces/storeWorkspaceData', newValue)
        store.commit('data/workspaces/setUserWorkspace', newValue)
      }
    },
  )
  store.watch(
    (state, getters) => getters['data/workspaces/activeWorkspace'],
    async newValue => {
      const { zoomLevel, startLocation } = newValue
      await store.dispatch('project/applyDefaultValuesToAreaSettings')
      if (zoomLevel && startLocation) {
        await store.dispatch('project/setMapPosition', {
            zoom: zoomLevel,
            center: {
              lat: startLocation.latitude,
              lng: startLocation.longitude,
            },
          },
        )
        store.commit('project/showMap')
      }
    },
  )
  store.subscribe(({ type }, state) => {
    if (type === 'data/workspaces/setDomain') {
      const domain = state.data.workspaces._domain
      const locale = state.i18n.locale
      store.dispatch('data/workspaces/storeWorkspaceData', { domain, locale })
    }
  })
}]
