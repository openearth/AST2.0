const utils = {
  queryData(query) {
    return fetch(
      'https://graphql.datocms.com/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${plugin.parameters.global.datoCmsApiToken}`,
        },
        body: JSON.stringify({ query }),
      }
    )
    .then(res => res.json())
  },
}
