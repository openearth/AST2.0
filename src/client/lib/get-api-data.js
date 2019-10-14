import cloneDeep from 'lodash/cloneDeep'

async function handleApiResponse(response) {
  if (response.ok === true) {
    return response.json()
  }

  console.groupCollapsed(
    `%c API Request failed. %c Status code: ${response.status} `,
    'background: #F44336; color: #fff; border-radius: 3px 0 0 3px;',
    'background: #263238; color: #eeffff; border-radius: 0 3px 3px 0; font-weight: 400;',
  )

  const error = response.status >= 500
    ? { result: { name: 'Internal Server Error', code: response.status } }
    : await response.json()

  console.group(
    '%c The Error ',
    'background: #F44336; color: #eeffff; border-radius: 3px; font-weight: 400;'
  )
  console.log(error.result)
  console.groupEnd()

  console.group(
    '%c The Response ',
    'background: #263238; color: #eeffff; border-radius: 3px; font-weight: 400;'
  )
  console.log(response)
  console.groupEnd()

  console.groupEnd()
  throw new Error(error)
}

async function getRealApiData(uri, body) {
  const url = `${process.env.API_BASE}/api/${uri}`
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }

  const response = await fetch(url, options)
  return handleApiResponse(response)
}

export function getApiData(uri, body) {
  return getRealApiData(uri, body)
}

export async function getApiDataForFeature(feature, projectArea, scenarioName, currentReturnTime = 1) {
  const {
    measure,
    area,
    areaInflow,
    areaDepth,
    defaultInflow,
    defaultDepth,
  } = feature.properties

  const measureArea = area
  const measureId = parseFloat(measure, 10)
  const inflow = area * parseFloat(areaInflow || defaultInflow, 10)
  const depth = parseFloat(areaDepth || defaultDepth, 10)

  const id = measureId
  const returnTime = currentReturnTime

  if (measureId) {
    return Promise.all([
        getRealApiData('heatstress/cost', { scenarioName, area, id }),
        getRealApiData('heatstress/temperature', { scenarioName, area, id, projectArea }),
        getRealApiData('heatstress/waterquality', { scenarioName, area, id, projectArea }),
        getRealApiData('pluvflood', { scenarioName, area, id, returnTime, inflow, depth, projectArea }),
        getRealApiData('groundwater_recharge', { scenarioName, area, id, returnTime, inflow, depth, projectArea }),
        getRealApiData('evapotranspiration', { scenarioName, area, id, returnTime, inflow, depth, projectArea }),

        Promise.resolve({ data: { storageCapacity: measureArea * depth } }),
      ])
      .then(apiData => apiData.reduce((obj, res) => ({ ...obj, ...res.data, ...res.result }), {}))

  } else {
    return Promise.resolve({})
  }
}

export async function getRankedMeasures(projectArea) {
  const requestBody = formatRequestBody(projectArea)

  return getRealApiData('selection', requestBody)
    .then(({ result }) => result)
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
