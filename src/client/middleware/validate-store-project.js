import validateProject from "../lib/validate-project";

export default function ({ store }) {
  const { data, project } = store.state
  const result = validateProject(project, data)
  if (!result.valid) {
    console.error(result.errors)
  }
}
