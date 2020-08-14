import MapEventBus, { MODE } from '../lib/map-event-bus';

export const state = () => ({
  mode: '',
  polygon: true,
  line: true,
  point: true,
})

export const mutations = {
  mode(state, mode) {
    state.mode = mode
  },
  polygonActive(state) {
    state.polygon = true
  },
  polygonInactive(state) {
    state.polygon = false
  },
  lineActive(state) {
    state.line = true
  },
  lineInactive(state) {
    state.line = false
  },
  pointActive(state) {
    state.point = true
  },
  pointInactive(state) {
    state.point = false
  },
}

export const actions = {
  setMode({ commit }, mode) {
    commit('mode', mode)
    MapEventBus.$emit(MODE, mode)
  },
  setModeDefault({ dispatch }) {
    dispatch('setMode', 'simple_select')
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
      case 'inactive':
      case 'modal':
        return false
      default:
        return state.point
    }
  },

  line(state, getters, rootState) {
    const mode = rootState.mode.state

    switch (mode) {
      case 'draw-project-area':
      case 'inactive':
      case 'modal':
        return false
      default:
        return state.line
    }
  },

  polygon(state, getters, rootState, rootGetters) {
    const mode = rootState.mode.state

    switch (mode) {
      case 'draw-project-area':
        return !rootGetters['flow/createdProjectArea']
      case 'inactive':
      case 'modal':
        return false
      default:
        return state.polygon
    }
  },

  interactive(state, getters, rootState) {
    const mode = rootState.mode.state

    switch (mode) {
      case 'inactive':
      case 'modal':
        return false
      default:
        return true
    }
  },

  addOnly(state, getters, rootState) {
    const mode = rootState.mode.state

    switch (mode) {
      case 'add-only':
        return true
      default:
        return false
    }
  },

  search(state, getters, rootState) {
    const mode = rootState.mode.state

    switch (mode) {
      case 'draw-project-area':
        return true
      default:
        return false
    }
  },
}
