export const state = () => []

export const mutations = {
  expand(state, measureId) {
    if (state.indexOf(measureId) === -1) {
      state.push(measureId)
    }
  },

  collapse(state, measureId) {
    const index = state.indexOf(measureId)
    if (index !== -1) {
      state.splice(index, 1)
    }
  },
}

export const actions = {
  toggle({ state, commit }, measureId) {
    state.indexOf(measureId) !== -1
      ? commit('collapse', measureId)
      : commit('expand', measureId)
  },
}
