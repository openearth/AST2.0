/**
 * For each empty value in the US language, this file should fill in the EN
 * language counterpart so that US becomes complete.
 * TODO:
 * - check that empty string values are being overwritten. especially in messages.json
 * - Now this file only handles en_US, make it so that is can handle multiple files
 */

const fs = require('fs')
const path = require('path')
const glob = require('glob')
const localesWithMissingContent = require('../locales-with-missing-content')
const { pipe, defaultsDeep, isPlainObject } = require('lodash/fp')
const dataFolder = path.join(__dirname, '../../src/client/static/data')

const keepBackups = true

function convertEmptyStringsToUndefined(obj) {
  function convert(value, changeNullToUndefined = false) {
    if (value === '') {
      return undefined
    }

    if (value === null && changeNullToUndefined) {
      return undefined
    }

    return (Array.isArray(value) || isPlainObject(value))
      ? convertEmptyStringsToUndefined(value)
      : value
  }

  const nullValuesForKeysToBeConverted = ['slug']

  return Array.isArray(obj)
    ? obj.map(item => convert(item))
    : Object.entries(obj).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: convert(value, nullValuesForKeysToBeConverted.includes(key)) }),
        {},
      )
}

// eslint-disable-next-line no-unused-vars
const log = data => {console.log(data); return data}
const files = sourceLocale => glob.sync(`${dataFolder}/${sourceLocale}/**/*.json`)
const getDefaultFile = (sourceLocale, baseLocale) => file => file.replace(`data/${sourceLocale}`, `data/${baseLocale}`)
const readFile = filePath => fs.readFileSync(filePath, { encoding: 'utf-8' })
const getFileContent = pipe(readFile, JSON.parse, convertEmptyStringsToUndefined)
const getDefaultFileContent = (sourceLocale, baseLocale) => filePath => pipe(getDefaultFile(sourceLocale, baseLocale), readFile, JSON.parse)(filePath)
  const getContentPairsFromFile = (sourceLocale, baseLocale ) => filePath => [
  getDefaultFileContent(sourceLocale, baseLocale)(filePath),
  getFileContent(filePath),
  filePath,
]
const mergeDefaultInSource = ([defaultContent, source, filePath]) => ({ content: defaultsDeep(defaultContent, source), filePath })
const writeResult = sourceLocale => ({ content, filePath }) => {
  keepBackups && fs.renameSync(filePath, filePath.replace(`data/${sourceLocale}`, `data/${sourceLocale}_BK`))
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), { encoding: 'utf-8' })
}

const parse = (sourceLocale, baseLocale) => pipe(
  getContentPairsFromFile(sourceLocale, baseLocale),
  mergeDefaultInSource,
  writeResult(sourceLocale),
)

function execute(locales = []) {
  locales.forEach(({ sourceLocale, baseLocale }) => {
    keepBackups && fs.mkdirSync(path.join(dataFolder, `${sourceLocale}_BK`))
    keepBackups && fs.mkdirSync(path.join(dataFolder, `${sourceLocale}_BK`, 'workspaces'))
    files(sourceLocale).forEach(parse(sourceLocale, baseLocale))
  })
}

execute(localesWithMissingContent)
