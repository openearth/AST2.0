import Vue from 'vue'

const baseState = {
  inputElement: null,
  onChange: () => {},
  label: '',
}

export const state = () => ({
  inputElement: null,
  onChange: () => {},
  label: '',
})

export const mutations = {
  setFocusedInput(state, { inputElementId, onChange, label }) {
    Vue.set(state, 'inputElement', inputElementId)
    Vue.set(state, 'onChange', onChange)
    Vue.set(state, 'label', label)
  },
  removeFocusedInput(state) {
    Vue.set(state, 'inputElement', baseState.inputElement)
    Vue.set(state, 'onChange', baseState.onChange)
    Vue.set(state, 'label', baseState.label)
  },
}

export const getters = {
  inputtedValue(state) {
    return document.querySelector(state.inputElement)
      ? document.querySelector(state.inputElement).value
      : ''
  },
}
