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

  if (!Object.keys(store.state.data.workspaces).filter(ItemsWithoutUnderscore).length) {
    store.dispatch('data/workspaces/getWorkspaces')
  }

  if (!store.state.data.appConfig.title) {
    store.dispatch('data/appConfig/getAppConfig')
  }

  if (!store.state.data.scenarios.length) {
    store.dispatch('data/scenarios/getScenarios', store.state.i18n.locale)
  }
  if (!store.state.data.tags.length) {
    store.dispatch('data/tags/getTags', store.state.i18n.locale)
  }
}
