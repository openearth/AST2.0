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
      store.dispatch('project/applyDefaultValuesToAreaSettings')
    }
  )
  store.subscribe(({ type, payload }, state) => {
    if (type === 'data/workspaces/setDomain') {
      const domain = state.data.workspaces._domain
      store.dispatch('data/workspaces/storeWorkspaceData', domain)
    }
  })
}]
