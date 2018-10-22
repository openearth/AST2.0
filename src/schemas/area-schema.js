const propertiesSchema = (kpiGroups) => ({
  type: 'object',
  additionalProperties: false,
  properties: {
    area: { type: 'number' },
    areaDepth: { type: ['number', 'string'] },
    areaInflow: { type: ['number', 'string'] },
    areaWidth: { type: ['number', 'string'] },
    areaRadius: { type: ['number', 'string'] },
    color: { type: 'string', pattern: '^#?([0-9a-fA-F]{3}){1,2}$' },
    hidden: { type: 'boolean' },
    measure: { type: 'string' },
    name: { type: 'string' },
    isProjectArea: { type: 'boolean' },
    apiData: {
      type: 'object',
      additionalProperties: false,
      properties: Object.keys(kpiGroups)
      .map(groupKey => kpiGroups[groupKey].kpis.map(kpi => kpi.key))
      .reduce((groupObject, keys) => ({
        ...groupObject,
        ...keys.reduce((object, key) => ({
          ...object,
          [key]: { type: 'number' },
        }), {}),
      }), {}),
    },
  },
})

export default (kpiGroups) => ({
  $id: "/area-feature",
  type: "object",
  additionalProperties: false,
  properties: {
    id: { type: "string" },
    type: { type: "string", enum: ['Feature'] },
    properties: propertiesSchema(kpiGroups),
    geometry: {
      type: "object",
      additionalProperties: false,
      required: [
        "coordinates",
        "type",
      ],
      properties: {
        coordinates: {
          type: ["array", "number"],
          items: {
            type: ["array", "number"],
            items: {
              type: ["array", "number"],
              items: { type: "number" },
            },
          },
        },
        type: { type: "string", enum: ['Polygon', 'LineString', 'Point'] },
      },
    },
  },
})
