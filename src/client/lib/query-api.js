const fetch = require('node-fetch')
const curry = require('lodash/fp/curry')

module.exports = curry(function query(token, variables, query) {
  return fetch(
    'https://graphql.datocms.com/',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables }),
    }
  )
    .then(res => {
      if (res.errors) {
        throw new Error(JSON.stringify(res.errors))
      }
      return res.json()
    })
    .then((res) => res.data)
})
