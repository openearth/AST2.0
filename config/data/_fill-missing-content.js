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

function convertEmptyStringsToUndefined(obj) {
  function convert(value) {
    if (value === '') return undefined
    return (Array.isArray(value) || isPlainObject(value))
      ? convertEmptyStringsToUndefined(value)
      : value
  }

  return Array.isArray(obj)
    ? obj.map(item => convert(item))
    : Object.entries(obj).reduce(
        (acc, [key, value]) => ({ ...acc, [key]: convert(value) }),
        {},
      )
}

// eslint-disable-next-line no-unused-vars
const log = data => {console.log(data); return data}
const files = sourceLocale => glob.sync(`${dataFolder}/${sourceLocale}/**/*.json`)
const getDefaultFile = (sourceLocale, baseLocale) => file => file.replace(sourceLocale, baseLocale)
const readFile = filePath => fs.readFileSync(filePath, { encoding: 'utf-8' })
const getFileContent = pipe(readFile, JSON.parse, convertEmptyStringsToUndefined)
const getDefaultFileContent = (sourceLocale, baseLocale) => filePath => pipe(getDefaultFile(sourceLocale, baseLocale), readFile, JSON.parse)(filePath)
const writeFileWithSuffix = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2), { encoding: 'utf-8' })
const getContentPairsFromFile = (sourceLocale, baseLocale ) => filePath => [
  getDefaultFileContent(sourceLocale, baseLocale)(filePath),
  getFileContent(filePath),
  filePath,
]
const mergeDefaultInSource = ([defaultContent, source, filePath]) => ({ content: defaultsDeep(defaultContent, source), filePath })
const writeResult = sourceLocale => ({ content, filePath }) => {
  fs.renameSync(filePath, filePath.replace(sourceLocale, `${sourceLocale}_BK`))
  writeFileWithSuffix(filePath, content)
}

const parse = (sourceLocale, baseLocale) => pipe(
  getContentPairsFromFile(sourceLocale, baseLocale),
  mergeDefaultInSource,
  writeResult(sourceLocale),
)

function execute(locales = []) {
  locales.forEach(({ source, baseLocale }) => {
    fs.mkdirSync(path.join(dataFolder, `${source}_BK`))
    fs.mkdirSync(path.join(dataFolder, `${source}_BK`, 'workspaces'))
    files(source).forEach(parse(source, baseLocale))
  })
}

execute(localesWithMissingContent)
