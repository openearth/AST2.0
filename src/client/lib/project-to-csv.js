function value(input) {
  return input === 0 || !!input
    ? input
    : 0
}

export default function projectToCsv(areas, kpiKeys, measureById) {
  const header = ['id', 'measure', 'type', 'length', 'width', 'depth', 'radius', 'area', 'inflow'].concat(kpiKeys)
  const results = areas
    .map(({ id, properties, geometry }) => {
      const { measure, area, length, radius, areaDepth, defaultDepth, areaWidth, defaultWidth, areaInflow, defaultInflow, apiData } = properties
      const { type } = geometry
      const measureObj = measureById(measure) || {}
      return [
        id,
        value(measureObj.title),
        type,
        value(length),
        value(areaWidth || defaultWidth),
        value(areaDepth || defaultDepth),
        value(radius),
        value(area),
        value(areaInflow || defaultInflow),
        ...kpiKeys.map(key => value(apiData && apiData[key])),
      ]
    })
  return [header, ...results]
    .map(record => record.join(';'))
    .join('\n')
}
