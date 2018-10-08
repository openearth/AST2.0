import JsonSchema from 'jsonschema'
import projectSchema from '../../schemas/project-schema'
import areaSchemaFactory from '../../schemas/area-schema'
import settingsSchemaFactory from '../../schemas/settings-schema'
import mapSchema from "../../schemas/map-schema";

const validator = new JsonSchema.Validator()

export default function (project, { areaSettings, kpiGroups }) {
  const areaSchema = areaSchemaFactory(kpiGroups)
  const settingsSchema = settingsSchemaFactory(areaSettings, kpiGroups)

  validator.addSchema(areaSchema, '/area-feature')
  validator.addSchema(settingsSchema, '/settings-schema')
  validator.addSchema(mapSchema, '/map-schema')

  return validator.validate(project, projectSchema)
}
