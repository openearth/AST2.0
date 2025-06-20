const fetch = require('node-fetch')
const curry = require('lodash/fp/curry')
const times = require('lodash/fp/times')
const camelCase = require('lodash/camelCase')

const defaultFirst = 100;

function executeFetch(token, variables, query) {
  return fetch(
    'https://graphql.datocms.com/',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Environment': 'heatstress-layers',
      },
      body: JSON.stringify({ query, variables }),
    },
  )
    .then(res => {
      if (res.errors) {
        throw new Error(JSON.stringify(res.errors))
      }
      return res.json()
    })
}

function getPaginatedData(token, variables, query) {
  return async function(response) {
    const keyRegex = /_all(.+)Meta/
    let allKey

    try {
      allKey = Object.keys(response.data).find(key => keyRegex.test(key))
    } catch (error) {
      console.log({ query, variables })
      console.error(error)
    }

    if (allKey) {
      const { count } = response.data[allKey]
      const [, originalKey] = allKey.match(keyRegex).map(camelCase)
      const itemsInResponse = response.data[originalKey]
      const remainingAmount = count - itemsInResponse.length
      const totalRemainingRequests = Math.ceil(remainingAmount / itemsInResponse.length)
      const promises = times(iteration => {
          const skip = (iteration * variables.first) + itemsInResponse.length
          return executeFetch(token, { ...variables, skip }, query)
        }, totalRemainingRequests)

      await Promise.all(promises)
        .then(responses =>
          responses.forEach(res => {
            response.data[originalKey] = [...response.data[originalKey], ...res.data[originalKey]]
          }),
        )

      delete response.data[allKey]
    }
    return response
  }
}

function returnData(response) {
  return response.data
}

module.exports = curry(function query(token, variables, query) {
  const args = [token, { first: defaultFirst, ...variables }, query]
  return executeFetch(...args)
    .then(getPaginatedData(...args))
    .then(returnData)
})
