export const state = () => []

export const mutations = {
  isLoading(state, key) {
    if (state.includes(key) === false) {
      state.push(key)
    }
  },
  isDoneLoading(state, key) {
    const index = state.indexOf(key)
    if (index !== -1) {
      state.splice(index, 1)
    }
  },
}
