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
  changeSelection({ state, commit }, ids) {
    const idsToDelete = ids.filter(id => state.indexOf(id) !== -1)
    const idsToAdd = ids.filter(id => state.indexOf(id) === -1)
    idsToDelete.forEach(id => commit('removeAreaId', id))
    idsToAdd.forEach(id => commit('addAreaId', id))
  },
}
