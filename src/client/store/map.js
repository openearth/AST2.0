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
