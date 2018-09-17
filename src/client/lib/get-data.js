export default function ({ folder = 'data', locale, slug }) {
  const url = [folder, locale, slug]
        .filter(value => value)
        .join('/')
        .concat('.json')
        .replace(/(.+)/, '/$1')

  if (process.client) {
    // On client load over http
    return fetch(url).then(res => res.json())
  } else {
    // On server load from file system
    const data = JSON.parse(require('fs').readFileSync(`src/client/static${url}`, 'utf8'))
    return Promise.resolve(data)
  }
}
