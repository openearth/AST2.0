import log from '../lib/log'
import validateProject from "../lib/validate-project";

export default function ({ store }) {
  const { data, project } = store.state
  const areaSettings = store.getters['data/areaSettings/overriddenAreaSettings']
  const result = validateProject(project, { ...data, areaSettings })
  if (!result.valid) {
    const firstError = result.errors[0]
    const stack = (firstError && firstError.stack) ? `: ${firstError.stack}` : ''
    log.error(`Loaded project is invalid${stack}`, result.errors)
  }
}
