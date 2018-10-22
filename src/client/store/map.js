import MapEventBus, { MODE } from "../lib/map-event-bus";

export const state = () => ({
  mode: '',
})

export const mutations = {
  mode(state, mode) {
    state.mode = mode
  },
}

export const actions = {
  setMode({ commit }, mode) {
    commit('mode', mode)
    MapEventBus.$emit(MODE, mode)
  },
}

export const getters = {
  isProject(state, getters, rootState) {
    const mode = rootState.mode.state

    switch (mode) {
      case 'default':
        return true
      default:
        return false
    }
  },

  point(state, getters, rootState) {
    const mode = rootState.mode.state

    switch (mode) {
      case 'draw-project-area':
        return false
      default:
        return true
    }
  },

  line(state, getters, rootState) {
    const mode = rootState.mode.state

    switch (mode) {
      case 'draw-project-area':
        return false
      default:
        return true
    }
  },

  polygon(state, getters, rootState, rootGetters) {
    const mode = rootState.mode.state

    switch (mode) {
      case 'draw-project-area':
        return !rootGetters['flow/createdProjectArea']
      default:
        return true
    }
  },
}
