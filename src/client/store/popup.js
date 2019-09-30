export const state = () => ({
  open: false,
})

export const getters = {
  openState: state => state.open,
}

export const mutations = {
  openPopup(state) {
    state.open = true
  },
  closePopup(state) {
    state.open = false
  },
  togglePopup(state) {
    state.open = !state.open
  },
}
