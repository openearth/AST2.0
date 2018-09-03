const fs = require('fs')
const path = require('path')
const pipe = require('lodash/fp/pipe')
const get = require('lodash/fp/get')
const map = require('lodash/fp/map')
const tap = require('lodash/fp/tap')
const curry = require('lodash/fp/curry')
const join = require('lodash/fp/join')

const staticDir = path.join(__dirname, '../../src/client/static')
const sourceFile = path.join(staticDir, 'data/redirects.json')
const targetFile = path.join(staticDir, '_redirects')

const readFile = filePath => fs.readFileSync(filePath, { encoding: 'utf8' })
const writeFile = curry((filePath, contents) => fs.writeFileSync(filePath, contents, { encoding: 'utf8' }))

pipe(
  readFile,
  JSON.parse,
  get(['redirects']),
  map(redirect => `${redirect.from} ${redirect.to} ${redirect.statusCode}`),
  join('\n'),
  writeFile(targetFile)
)(sourceFile)
