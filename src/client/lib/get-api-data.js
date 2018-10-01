export function getApiData(uri, body) {
  return fetch(
    `https://ast-measure-api.now.sh/v2/${uri}/measure-model`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  ).then(res => res.json())
}

export function getRealApiData(uri, body) {
  return fetch(
    `https://tl-ng045.xtr.deltares.nl/api/${uri}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  ).then(res => res.json())
}

export async function getApiDataForFeature(feature, projectArea, currentReturnTime = 1) {
  const {
    measure,
    area,
    areaInflow,
    areaDepth,
  } = feature.properties

  const measureArea = area
  const measureId = parseFloat(measure, 10)
  const inflowArea = area *  parseFloat(areaInflow, 10)
  const inflow = area * parseFloat(areaInflow, 10)

  const measureDepth = parseFloat(areaDepth, 10)
  const depth = parseFloat(areaDepth, 10)

  const id = measureId
  const returnTime = currentReturnTime

  if (measureId) {
    const apiData = await Promise.all([
      getApiData('heatstress-cost', { measureArea, measureId }),
      getApiData('heatstress-temperature', { measureArea, measureId, projectArea }),
      getApiData('heatstress-waterquality', { measureArea, measureId }),
      getApiData('pluvflood', { measureArea, measureId, currentReturnTime, projectArea, inflowArea, measureDepth }),

      // getRealApiData('measures', { area, id }),
      // getRealApiData('heatstress/cost', { area, id }),
      // getRealApiData('heatstress/temperature', { area, id, projectArea }),
      // getRealApiData('heatstress/waterquality', { area, id }),
      // getRealApiData('pluvflood', { area, id, returnTime, inflow, depth, projectArea }),

      Promise.resolve({ data: { storageCapacity: measureArea * areaDepth } }),
    ])

    return apiData.reduce((obj, res) => ({ ...obj, ...res.data, ...res.result }), {})
  } else {
    return Promise.resolve({})
  }
}
