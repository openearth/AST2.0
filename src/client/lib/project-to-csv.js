import calculateFmeasArea from './calculate-fmeas-area';
import convertToImperial from '../components/unit-output/convert-to-imperial'

function value(input) {
  return input === 0 || !!input
    ? input
    : 0
}

function toUnitSystem(imperial) {
  return function execute(unit, value) {
    return imperial ? convertToImperial(value, unit) : value
  }
}

export default function projectToCsv(areas, kpiKeys, kpiKeysUnitMap, measureById, pluvfloodParam, imperial = false) {
  const convertToUnitSystem = toUnitSystem(imperial)

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
        convertToUnitSystem('distance', value(length)),
        convertToUnitSystem('distance', value(areaWidth || defaultWidth)),
        convertToUnitSystem('distance', value(areaDepth || defaultDepth)),
        convertToUnitSystem('surface', value(radius)),
        convertToUnitSystem('surface', value(area)),
        value(areaInflow || defaultInflow),
        ...kpiKeys.map(key => {
          const val = key !== 'Fmeas_area'
            ? value(apiData && apiData[key])
            : value(
              apiData &&
              apiData[key] &&
              calculateFmeasArea(pluvfloodParam.A_tot, pluvfloodParam.A_p, pluvfloodParam.Frac_RA, apiData[key]),
            )
          return convertToUnitSystem(kpiKeysUnitMap[key], val)
        }),
      ]
    })
  return [header, ...results]
    .map(record => record.join(';'))
    .join('\n')
}
