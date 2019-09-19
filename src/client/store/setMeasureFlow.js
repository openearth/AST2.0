export const state = () => ({
  id: null,
  steps: [
    {
      id: 0,
      title: 'Select a measure',
      slug: '/en/set-measure',
      isWide: true,
    },
    {
      id: 1,
      title: 'Draw an area on the map to connect with the selected measure',
      slug: '/en/set-measure/draw-an-area',
    },
    {
      id: 2,
      title: 'Adjust measure settings',
      slug: '/en/set-measure/adjust-measure-settings',
    },
  ],
  currentStep: 0,
})

export const mutations = {
  setMeasureId (state, id) {
    state.id = id
  },
  updateCurrentStep(newStepId) {
    state.currentStep = newStepId
  },
  clearMeasureId (state) {
    state.id = null
  },
}

export const actions = {
  chooseMeasure({ commit, getters }, id) {
    const { slug: nextSlug } = getters.nextStep
    commit('setMeasureId', id)
    commit('updateCurrentStep', 1)
    this.$router.push({ path: `${nextSlug}` })
  },
}

export const getters = {
  activeStep(state) {
    return state.steps[state.currentStep]
  },
  nextStep(state) {
    return state.steps[state.currentStep + 1]
  },
}
