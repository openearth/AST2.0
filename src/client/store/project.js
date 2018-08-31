import Vue from 'vue'

export const state = () => ({
  settings: {
    title: 'My project title'
  }
})

export const mutations = {
  import(state, file) {
    Vue.set(state, 'settings', file.settings)
  },
  setTitle(state, value) {
    state.settings.title = value
  }
}
