import getData from "../lib/get-data";

export default async function ({ store }) {
  if (!store.state.data.measures.length) {
    store.dispatch('data/measures/getMeasures', 'en')
  }

  if (!store.state.data.areaSettings.length) {
    store.dispatch('data/areaSettings/getAreaSettings', 'en')
  }
}
