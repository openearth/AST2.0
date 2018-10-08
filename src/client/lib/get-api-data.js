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
  const rankedMeasures = await getApiData('measure-ranking', requestBody)
  // return rankedMeasures

  const dummyData = {
    "subsurface_characteristic": "High",
    "surface":  "Flat_roofs",
    "multifunctionality":  0.7,
    "soil": "Sand",
    "slope": "Flat_area_on_high_ground",
    "scales": {
      "City": true,
      "Neighbourhood": true,
      "Street": false,
      "Building": true,
    },
    "climate_capacity": {
      "Heatstress_Threshold_Capacity": true,
      "Heatstress_Coping_Capacity": true,
      "Drought_Threshold_Capacity": true,
      "Drought_Coping_Capacity": true,
      "Flood_Threshold_Capacity": true,
      "Flood_Coping_Capacity": true,
    },
    "site_suitability": {
      "Red_space": true,
      "Grey_space":  true,
      "Green_space_-_private__gardens":  true,
      "Undeveloped_land_and_Green_space_-_no_recreational_use":  true,
      "Green_space_-_recreational_use_&_urban_farming":  true,
      "Grey_green_space_-_sports_playground":  true,
      "Blue_space":  true,
    },
  }
  // getting data from real api
  const data = await getScores()
  const scores = data.result['selection_scores']

  const realRankedMeasures = await getRealApiData('selection', { ...dummyData, scores })
  console.log(realRankedMeasures)
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
  return body
}