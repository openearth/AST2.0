export const state = () => ({
  inputElement: null,
  value: '',
})

export const mutations = {
  updateFocusedInput(state, target) {
    state.inputElement = target
  },
  removeFocusedInput(state) {
    state.inputElement = null
  },
  updateInputValue(state, value) {
    state.value = value
  },
}

