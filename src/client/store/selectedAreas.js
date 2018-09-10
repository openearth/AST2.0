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
  changeSelection({ state, commit }, features) {
    const isInState = index => state.indexOf(index) !== -1
    const isNotInState = index => state.indexOf(index) === -1
    const getId = obj => obj['id']

    const idsToAdd = features.filter(isNotInState).map(getId)
    const idsToDelete = features.length === 0
      ? state.map(id => id)
      : features.filter(isInState).map(getId)

    idsToDelete.forEach(id => commit('removeAreaId', id))
    idsToAdd.forEach(id => commit('addAreaId', id))
  },
}
