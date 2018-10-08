function addAreaProperty(obj, item) {
  const property = {}
  property.type = item.multiple ? 'object' : ['string', 'null']

  if (item.multiple) {
    property.required = item.options.map(option => option.value)
    property.properties = item.options.reduce(
      (propObj, option) => ({
        ...propObj,
        [option.value]: { type: Boolean },
      }), {})
  } else {
    property.enum = item.options
      .map(option => option.value)
      .concat(null)
  }

  obj[item.key] = property
  return obj
}

function addKpiProperty(obj, item) {
  obj[item.key] = {
    type: 'object',
    additionalProperties: false,
    required: item.kpis.map(kpi => kpi.key),
    properties: item.kpis.reduce((propObj, kpi) => ({
      ...propObj,
      [kpi.key]: {
        type: 'object',
        additionalProperties: false,
        required: ['include', 'value'],
        properties: {
          include: { type: 'boolean' },
          value: { type: 'string' },
        },
      },
    }), {}),
  }

  return obj
}

export default (areaSettings, kpiGroups) => ({
    $id: "/settings-schema",
    type: "object",
    additionalProperties: false,
    required: ['area', 'general', 'projectArea', 'targets'],
    properties: {
      area: { $ref: '/area-feature' },
      general: {
        type: 'object',
        additionalProperties: false,
        required: ['title'],
        properties: {
          title: { type: 'string' },
        },
      },
      projectArea: {
        type: 'object',
        additionalProperties: false,
        required: areaSettings.map(item => item.key),
        properties: areaSettings.reduce(addAreaProperty, {}),
      },
      targets: {
        type: 'object',
        additionalProperties: false,
        required: kpiGroups.map(item => item.key),
        properties: kpiGroups.reduce(addKpiProperty, {}),
      },
    },
  })
