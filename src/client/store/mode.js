export const state = () => ({
  state: '',
})

export const mutations = {
  isModal(state) {
    state.state = 'modal'
  },

  isDrawProjectArea(state) {
    state.state = 'draw-project-area'
  },

  isInactive(state) {
    state.state = 'inactive'
  },

  isDefault(state) {
    state.state = 'default'
  },

  isAddOnly(state) {
    state.state = 'add-only'
  },
}
