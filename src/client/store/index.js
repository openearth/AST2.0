import  MapEventBus, { REPOSITION } from '../lib/map-event-bus';

export const state = () => ({})

export const plugins = [ (store) => {
  store.watch(
    (state, getters) => getters['user/workspace'],
    (newValue, oldValue) => {
      if (newValue) {
        store.dispatch('data/workspaces/storeWorkspaceData', newValue)
        store.commit('data/workspaces/setUserWorkspace', newValue)
      }
    }
  )
  store.watch(
    (state, getters) => getters['data/workspaces/activeWorkspace'],
    (newValue, oldValue) => {
      const { zoomLevel, startLocation } = newValue
      store.dispatch('project/applyDefaultValuesToAreaSettings')
      if (zoomLevel && startLocation) {
        store.dispatch('project/setMapPosition', {
            zoom: zoomLevel,
            center: {
              lat: startLocation.latitude,
              lng: startLocation.longitude,
            },
          }
        )
        setTimeout(() => {
          MapEventBus.$emit(REPOSITION, {
            instant: true,
            zoom: zoomLevel,
            center: {
              lat: startLocation.latitude,
              lng: startLocation.longitude,
            },
          })
        }, 10)
      }
    }
  )
  store.subscribe(({ type, payload }, state) => {
    if (type === 'data/workspaces/setDomain') {
      const domain = state.data.workspaces._domain
      const locale = state.i18n.locale
      store.dispatch('data/workspaces/storeWorkspaceData', { domain, locale })
    }
  })
}]
