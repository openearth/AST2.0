import getData from "../lib/get-data";

export default async function ({ store }) {
  if (!store.state.data.measures.length) {
    store.dispatch('data/measures/getMeasures', store.state.i18n.locale)
  }

  if (!store.state.data.areaSettings.length) {
    store.dispatch('data/areaSettings/getAreaSettings', store.state.i18n.locale)
  }

  if (!store.state.data.kpiGroups.length) {
    store.dispatch('data/kpiGroups/getKpiGroups', store.state.i18n.locale)
  }

  if (!store.state.data.units.length) {
    store.dispatch('data/units/getUnits')
  }
}
