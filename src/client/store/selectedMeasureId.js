export const state = () => ({
  id: null,
})

export const mutations = {
  setSelectedMeasureId (state, id) {
    state.id = id
  },
}

export const getters = {
  getSelectedMeasureId(state) {
    console.log('state.selectedMeasureId', state.id);
    return state.id
  },
}
