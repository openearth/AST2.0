export default function stateIsDefault({ store }) {

  // If we are in the flow of choosing a measure, the map should stay inactive.
  // Even if we navigate to a measure detail page.
  if (store.state.setMeasureFlow.inFlow === false) {
    store.commit('mode/isDefault')
  }
}
