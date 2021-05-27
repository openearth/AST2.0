const fs = require('fs')
const path = require('path')
const { pipe, get, map, curry, join } = require('lodash/fp')

const staticDir = path.join(__dirname, '../../src/client/static')
const sourceFile = path.join(staticDir, 'data/redirects.json')
const targetFile = path.join(staticDir, '_redirects')

const redirectToLine = redirect => `${redirect.from} ${redirect.to} ${redirect.statusCode}`
const readFile = filePath => fs.readFileSync(filePath, { encoding: 'utf8' })
const writeFile = curry((filePath, contents) => {
  fs.writeFileSync(
    filePath,
    `/ /en_US 301 Country=us\n${contents}`,
    { encoding: 'utf8' },
  )
})

pipe(
  readFile,
  JSON.parse,
  get(['redirects']),
  map(redirectToLine),
  join('\n'),
  writeFile(targetFile),
)(sourceFile)
