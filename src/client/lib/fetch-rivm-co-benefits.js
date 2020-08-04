import omit from 'lodash/omit'
import turfBbox from '@turf/bbox'

function prepareArea(area) {
  const properties = omit(area.properties, ['color', 'hidden', 'apiData'])

  properties.measureId = properties.measure
  properties.areaDepth = properties.areaDepth || properties.defaultDepth
  properties.areaWidth = properties.areaWidth || properties.defaultWidth
  properties.areaInflow = properties.areaInflow || properties.defaultInflow
  properties.areaRadius = properties.areaRadius || properties.defaultRadius

  delete properties.measure
  delete properties.defaultDepth
  delete properties.defaultWidth
  delete properties.defaultInflow
  delete properties.defaultRadius

  return { ...area, properties }
}

function prepareProjectArea(area) {
  const properties = {
    ...area.properties,
    measureId: null,
    measure: 'PROJECT',
  }

  return { ...area, properties }
}

function addBoundingBox(geoJson) {
  const bbox = turfBbox(geoJson)
  return { ...geoJson, bbox }
}

export default async function fetchRivmCoBenefits({ areas, projectArea } = {}) {
  const preparedAreas = areas
    .filter(area => !area.properties.hidden)
    .map(prepareArea)

  const preparedProjectArea = prepareProjectArea(projectArea)

  const geoJson = {
    type: 'FeatureCollection',
    crs: {
      'type': 'EPSG',
      'properties': {
        'code': 3857,
      },
    },
    features: [preparedProjectArea, ...preparedAreas],
  }

  const payload = addBoundingBox(geoJson)
  console.info(payload) // @TODO :: Remove after discussion with John Verberne

  const response = await fetch(process.env.API_GBP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  // @TODO :: Try successful !== true, errors, etc.

  return response.json();
}
