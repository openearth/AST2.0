export const state = () => ({})

export const mutations = {
  setSelectedMeasureId (state, id) {
    state.selectedMeasureId = id
  },
}

export const getters = {
  getSelectedMeasureId: state => {
    console.log('state.selectedMeasureId', state.selectedMeasureId);
    return state.selectedMeasureId
  },
}
