const path = require('path')
const { readFileSync, writeFileSync } = require('fs')
const { pipe, curry, get, map, reduce, assign } = require('lodash/fp')

const locales = ['en', 'nl']
const dataDir = path.join(__dirname, '../../src/client/static/data')
const sourceFilename = 'translations.json'
const targetFilename = 'messages.json'

const toObject = ({ key, value }) => ({ [key]: value })
const readFile = locale => readFileSync(path.join(dataDir, locale, sourceFilename), { encoding: 'utf8' })
const writeFile = curry(
  (locale, contents) => writeFileSync(path.join(dataDir, locale, targetFilename), contents, { encoding: 'utf8' })
)

const transformTranslations = locale =>
  pipe(
    readFile,
    JSON.parse,
    get('translations'),
    map(toObject),
    reduce(assign, {}),
    JSON.stringify,
    writeFile(locale)
  )(locale)

map(transformTranslations, locales)
