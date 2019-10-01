import validateProject from "../lib/validate-project";

export default function ({ store }) {
  const { data, project } = store.state
  const areaSettings = store.getters['data/areaSettings/overriddenAreaSettings']
  const result = validateProject(project, { ...data, areaSettings })
  if (!result.valid) {
    console.error(result.errors)
  }
}
