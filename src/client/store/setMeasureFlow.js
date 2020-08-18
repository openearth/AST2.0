export const state = () => ({
  id: undefined,
  inFlow: false,
  steps: [
    {
      id: 0,
      label: 'select_a_measure',
      slug: 'set-measure',
      isWide: true,
    },
    {
      id: 1,
      label: 'draw_an_area',
      slug: 'set-measure/draw-an-area',
    },
  ],
  currentStep: 0,
  drawnAreas: undefined,
})

export const mutations = {
  setInFlow(state, isInFlow) {
    state.inFlow = isInFlow
  },
  setMeasureId (state, id) {
    state.id = id
  },
  setDrawnAreas(state, areas) {
    state.drawnAreas = areas
  },
  updateCurrentStep(state, newStepId) {
    state.currentStep = newStepId
  },
  clearMeasureId (state) {
    state.id = null
  },
}

export const actions = {
  startFlow({ commit }) {
    commit('setInFlow', true)
    commit('mode/isInactive', null, { root: true })
  },
  chooseMeasure({ commit, getters, rootState }, id) {
    const { slug: nextSlug } = getters.nextStep
    const locale = rootState.i18n.locale
    const path = `/${locale}/${nextSlug}/`
    commit('setMeasureId', id)
    commit('updateCurrentStep', 1)
    commit('mode/isAddOnly', null, { root: true })
    this.$router.push({ path }).catch(() => {})
  },
  duplicateMeasure({ commit, getters, rootState }, measure) {
    commit('setMeasureId', measure.measureId)
  },
  async connectMeasureToArea({ commit, state, rootGetters, dispatch }, features) {
    const measure = rootGetters['data/measures/measureById'](state.id)
    await dispatch('project/setAreaMeasure', { features, measure }, { root: true })
    commit('setDrawnAreas', features)
  },
  resetFlow({ commit, rootState }, { relocate = true }) {
    commit('setDrawnAreas', undefined)
    commit('setMeasureId', undefined)
    commit('updateCurrentStep', 0)
    commit('setInFlow', false)
    commit('mode/isDefault', null, { root:true })
    if (relocate) {
      this.$router.push(`/${rootState.i18n.locale}/project/`).catch(() => {})
    }
  },
  toStep({ commit, rootState }, step) {
    commit('updateCurrentStep', step.id)
    const locale = rootState.i18n.locale
    const path = `/${locale}/${step.slug}/`
    this.$router.push({ path }).catch(() => {})
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
