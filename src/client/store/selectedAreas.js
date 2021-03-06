export const state = () => []

export const mutations = {
  removeAreaId(state, id) {
    const index = state.indexOf(id)
    state.splice(index, 1)
  },
  addAreaId(state, id) {
    state.push(id)
  },
}

export const actions = {
  changeSelection({ state, commit, rootState, rootGetters }, features) {
    const { area } = rootState.project.settings
    const isInState = index => state.indexOf(index) !== -1
    const isNotInState = index => state.indexOf(index) === -1
    const getId = obj => obj['id']

    const idsToAdd = features.filter(isNotInState).map(getId)
    const idsToDelete = features.length === 0 || features.length === idsToAdd.length
      ? state.map(id => id)
      : features.filter(isInState).map(getId)

    idsToDelete.forEach(id => commit('removeAreaId', id))
    idsToAdd.forEach(id => commit('addAreaId', id))

    if (features.length && !features.find(({ id }) => id === area.id)) {
      this.$router.push({ path: `/${rootState.i18n.locale}/project/areas/` }).catch(() => {})
    }

    // Checking when ON the 'new project' view, but also when routing away from it,
    // in which case the view might already be passed on to the 'settings' route
    const isOnOrRoutingFromNewProjectView = rootGetters['flow/isNewProjectView'] || rootGetters['flow/isSettingsView']

    if (!features.length && !isOnOrRoutingFromNewProjectView) {
      this.$router.push({ path: `/${rootState.i18n.locale}/project/` }).catch(() => {})
    }
  },
}

export const getters = {
  features(state, getters, rootState) {
    return rootState.project.areas
      .filter(feature => state.indexOf(feature.id) !== -1)
  },
  selectedGeometryType(state, getters, rootState) {
    if(!state[0] || rootState.project.areas.length < 1) return 'all'
    const firstSelectedArea = rootState.project.areas.find(area => area.id === state[0])
    return firstSelectedArea.geometry.type
  },
}
