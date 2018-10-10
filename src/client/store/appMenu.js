export const state = () => ({
  show: false,
})

export const mutations = {
  showMenu(state) {
    state.show = true
  },
  hideMenu(state) {
    state.show = false
  },
  toggle(state) {
    state.show = !state.show
  },
}
