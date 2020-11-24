const propertiesSchema = kpiGroups => ({
  type: 'object',
  properties: {
    area: { type: ['number', 'string', 'null'] },
    length: { type: ['number', 'string', 'null'] },
    radius: { type: ['number', 'string', 'null'] },
    areaDepth: { type: ['number', 'string', 'null'] },
    areaInflow: { type: ['number', 'string', 'null'] },
    areaWidth: { type: ['number', 'string', 'null'] },
    areaRadius: { type: ['number', 'string', 'null'] },
    defaultDepth: { type: ['number', 'string', 'null'] },
    defaultInflow: { type: ['number', 'string', 'null'] },
    defaultWidth: { type: ['number', 'string', 'null'] },
    defaultRadius: { type: ['number', 'string', 'null'] },
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

export default kpiGroups => ({
  $id: '/area-feature',
  type: 'object',
  additionalProperties: false,
  properties: {
    id: { type: 'string' },
    type: { type: 'string', enum: ['Feature'] },
    properties: propertiesSchema(kpiGroups),
    geometry: {
      type: 'object',
      additionalProperties: false,
      required: [
        'coordinates',
        'type',
      ],
      properties: {
        coordinates: {
          type: ['array', 'number'],
          items: {
            type: ['array', 'number'],
            items: {
              type: ['array', 'number'],
              items: { type: 'number' },
            },
          },
        },
        type: { type: 'string', enum: ['Polygon', 'LineString', 'Point'] },
      },
    },
  },
})
