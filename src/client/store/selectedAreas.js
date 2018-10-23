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
      this.$router.push({ path: `/${rootState.i18n.locale}/project/areas/` })
    }

    if (!features.length && !rootGetters['flow/isNewProjectView']) {
      this.$router.push({ path: `/${rootState.i18n.locale}/project/` })
    }
  },
}

export const getters = {
  features(state, getters, rootState) {
    return rootState.project.areas
      .filter(feature => state.indexOf(feature.id) !== -1)
  },
}
