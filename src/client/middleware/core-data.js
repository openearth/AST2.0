import getData from "../lib/get-data";

const ItemsWithoutUnderscore = x => !/_/.test(x)

export default async function ({ store }) {
  if (
      store.state.devMode === true &&
      store.state.project.legalAccepted === false
  ) {
    store.commit('project/acceptLegal')
  }

  if (store.state.appMenu.show) {
    store.commit('appMenu/hideMenu')
  }

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

  if (!store.state.data.wmsLayers.length) {
    store.dispatch('data/wmsLayers/getWmsLayers', store.state.i18n.locale)
  }

  if (!Object.keys(store.state.data.workspaces).filter(ItemsWithoutUnderscore).length) {
    store.dispatch('data/workspaces/getWorkspaces')
  }
}
