export const state = () => ({})

export const plugins = [ (store) => {
  store.watch(
    (state, getters) => getters['user/workspace'],
    (newValue, oldValue) => {
      if (newValue) {
        store.dispatch('data/workspaces/storeWorkspaceData', newValue)
      }
    }
  )
}]
