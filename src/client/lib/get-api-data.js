const camel = require('to-camel-case')

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

export function getScores() {
  return fetch(`https://tl-ng045.xtr.deltares.nl/api/scores`).then(res => res.json())
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
      // getApiData('heatstress-cost', { measureArea, measureId }),
      // getApiData('heatstress-temperature', { measureArea, measureId, projectArea }),
      // getApiData('heatstress-waterquality', { measureArea, measureId }),
      // getApiData('pluvflood', { measureArea, measureId, currentReturnTime, projectArea, inflowArea, measureDepth }),

      // getRealApiData('measures', { area, id }),
      getRealApiData('heatstress/cost', { area, id }),
      getRealApiData('heatstress/temperature', { area, id, projectArea }),
      getRealApiData('heatstress/waterquality', { area, id }),
      getRealApiData('pluvflood', { area, id, returnTime, inflow, depth, projectArea }),

      Promise.resolve({ data: { storageCapacity: measureArea * areaDepth } }),
    ])

    return apiData.reduce((obj, res) => ({ ...obj, ...res.data, ...res.result }), {})
  } else {
    return Promise.resolve({})
  }
}

export async function getRankedMeasures(projectArea, settings) {
  const requestBody = formatRequestBody(projectArea, settings)
  const { data } = await getApiData('measure-ranking', requestBody)
  const { rankedMeasures } = data

  // to get real data the 'subsurface_characteristics' and 'scale' keys have to be changed in dato
  // subsurface_characteristic => subsurface_characteristics, scales => scale

  // getting data from real api
  // const data = await getScores()
  // const scores = data.result['selection_scores']

  // const rankedMeasures = await getRealApiData('selection', { ...projectArea, scores })
  // console.log(rankedMeasures)
  return rankedMeasures
}


function toArray(obj) {
  const arr = Object.keys(obj).filter(key => obj[key] === true)
  return arr.map(item => capitalizeFirstLetter(item))
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function formatRequestBody(projectArea, settings) {
  let body = {}

  // only necessary when using our api
  settings.forEach(setting => {
    const { key, multiple } = setting
    const camelCaseKey = camel(key)

    if (multiple) {
      body[camelCaseKey] = toArray(projectArea[key])
    } else {
      body[camelCaseKey] = capitalizeFirstLetter(projectArea[key])
    }
  })

  const copingArray = body['climateCapacity'].map(item => {
    return item.replace('Threshold', 'Coping')
  })

  body['climateCapacity'] = [...body['climateCapacity'], ...copingArray]

  // only necessary when using real api
  // body['climate_capacity'] = { ...projectArea['climate_capacity'] }

  // Object.keys(projectArea['climate_capacity']).forEach(item => {
  //   console.log(item)
  //   const key = item.replace('Threshold', 'Coping')
  //   body['climate_capacity'][key] = projectArea['climate_capacity'][item]
  // })

  return body
}
