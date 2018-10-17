import cloneDeep from 'lodash/cloneDeep'

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
  )
  .then(res => res.json())
}

export async function getApiDataForFeature(feature, projectArea, scenarioName, currentReturnTime = 1) {
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
      getRealApiData('heatstress/cost', { scenarioName, area, id }),
      getRealApiData('heatstress/temperature', { scenarioName, area, id, projectArea }),
      getRealApiData('heatstress/waterquality', { scenarioName, area, id }),
      getRealApiData('pluvflood', { scenarioName, area, id, returnTime, inflow, depth, projectArea }),
      getRealApiData('groundwater_recharge', { scenarioName, area, id, returnTime, inflow, depth, projectArea }),
      getRealApiData('evapotranspiration', { scenarioName, area, id, returnTime, inflow, depth, projectArea }),

      Promise.resolve({ data: { storageCapacity: measureArea * areaDepth } }),
    ])

    return apiData.reduce((obj, res) => ({ ...obj, ...res.data, ...res.result }), {})
  } else {
    return Promise.resolve({})
  }
}

export async function getRankedMeasures(projectArea) {
  const requestBody = formatRequestBody(projectArea)
  const { result } = await getRealApiData('selection', requestBody)

  return result
}

function formatRequestBody(projectArea) {
  let body = cloneDeep(projectArea)

  Object.keys(body['capacity']).forEach(key => {
    const newKey = key.replace('Coping', 'Prevention')
    body['capacity'][newKey] = body['capacity'][key]
  })

  delete body['scenarioName']

  return body
}
