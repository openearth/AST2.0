import getData from "../lib/get-data";

export default async function ({ store }) {
  if (store.state.appMenu.show) {
    store.commit('appMenu/hideMenu')
  }

  if (!store.state.data.measures.length) {
    store.dispatch('data/measures/getMeasures', store.state.i18n.locale)
      .then(() => {
        store.dispatch('data/measures/getMeasureProperty', 'cost')
        store.dispatch('data/measures/getMeasureProperty', 'pluvflood')
        store.dispatch('data/measures/getMeasureProperty', 'temperature')
        store.dispatch('data/measures/getMeasureProperty', 'wq')
        store.dispatch('data/measures/getMeasureProperty', 'properties')
        store.dispatch('data/measures/getMeasureScores')
      })
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
