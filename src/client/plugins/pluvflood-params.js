import get from 'lodash/get'

export default ({ store }) => {
  store.watch(
    state => ({
      projectArea: get(state, 'project.settings.area.properties.area'),
      scenarioName: get(state, 'project.settings.projectArea.scenarioName'),
    }),
    ({ projectArea, scenarioName }) => {
      store.dispatch('project/fetchPluvfloodParam', { projectArea, scenarioName })
    },
  )
}
