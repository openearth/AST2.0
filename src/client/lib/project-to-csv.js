function value(input) {
  return input === 0 || !!input
    ? input
    : 0
}

export default function projectToCsv(areas, kpiKeys, measureById) {
  const header = ['id', 'measure', 'type', 'length', 'width', 'depth', 'area', 'inflow'].concat(kpiKeys)
  const results = areas
    .map(({ id, properties, geometry }) => {
      const { measure, area, length, areaDepth, defaultDepth, areaWidth, defaultWidth, areaInflow, defaultInflow, apiData } = properties
      const { type } = geometry
      const measureObj = measureById(measure) || {}
      return [
        id,
        value(measureObj.title),
        type,
        value(length),
        value(areaWidth || defaultWidth),
        value(areaDepth || defaultDepth),
        value(area),
        value(areaInflow || defaultInflow),
        ...kpiKeys.map(key => value(apiData && apiData[key])),
      ]
    })
    .map(record => record.join(','))
  return [header, ...results].join('\n')
}
