/* eslint-disable no-useless-escape */
const { promisify } = require('util')
const path = require('path')
const readFile = promisify(require('fs').readFile)
const readFileSync = require('fs').readFileSync
const readDir = require('fs').readdirSync
const writeFile = require('fs').writeFileSync
const mkdirp = promisify(require('mkdirp'))
const map = require('lodash/fp/map')
const identity = require('lodash/fp/identity')
const flatten = require('lodash/flatten')
const get = require('lodash/fp/get')
const set = require('lodash/fp/set')
const kebabCase = require('lodash/fp/kebabCase')
const queryApi = require('../../src/client/lib/query-api')
const dotenv = require('dotenv-safe')
dotenv.config()

const DATO_API_TOKEN = process.env.DATO_API_TOKEN

const availableLocales = ['en', 'nl', 'zh_CN']

const dataFolder = path.resolve(__dirname, '../../src/client/static/data')

const isQueryFile = file => /.graphql/.test(file) && !/^_/.test(file)
const resolveTo = dir => file => path.resolve(dir, file)
const readFileFromPath = path => readFile(path, { encoding: 'utf8' })
const getFileUri = file => file.replace(__dirname, '').replace(/\.[\w\.]+$/, '')
const getTargetFilePath = (locale, file) => `${dataFolder}/${locale}${locale ? '/' : ''}${getFileUri(file)}.json`
const writeToFile = filePath => contents => writeFile(filePath, JSON.stringify(contents, null, 2))

const queryFilePaths = readDir(__dirname)
  .filter(isQueryFile)
  .map(resolveTo(__dirname))
  .reduce((obj, file) => {
    const [, , localesStr] = /([\w-]+)(?:\.)([\w\.]+)*(?:\.)*graphql$/.exec(file)
    const locales = !localesStr
      ? ['none']
      : flatten(
          localesStr
            .split('.')
            .filter(identity)
            .map(locale => locale === 'all' ? availableLocales : locale),
        )

    locales.forEach(locale => {
      obj[locale] = obj[locale] || []
      obj[locale].push(file)
    })

    return obj
  }, {})

const dumpByQueryFile = locale => file =>
  mkdirp(`${dataFolder}/${locale}`)
    .then(() => readFileFromPath(file))
    .then(queryApi(DATO_API_TOKEN, { locale }))
    .then(writeToFile(getTargetFilePath(locale, file)))
    .then(() => console.log(`Written ${locale}${getFileUri(file)}.json`))

const dumpByLocale = (locale, paths) => map(dumpByQueryFile(locale), paths)

const queryFilesPerLocale = Object.keys(queryFilePaths).map(locale => {
  const localePrefix = locale === 'none' ? '' : locale
  return dumpByLocale(localePrefix, queryFilePaths[locale])
})

const workspaceQuery = readFileSync(path.join(__dirname, '_workspace.graphql'),  { encoding: 'utf8' })

const addFilePathToObject = locale => item => {
  const slug = kebabCase(item.workspace.name)
  const filePath = path.join(locale, 'workspaces', `${slug}.json`)
  return set('filePath', filePath, item)
}

Promise.all(flatten(queryFilesPerLocale))
  .then(() => readFileFromPath(path.join(dataFolder, 'workspaces.json')))
  .then(JSON.parse)
  .then(get('workspaces'))
  .then(map(({ id }) => {
    availableLocales.forEach(locale => {
      mkdirp(path.join(dataFolder, locale, 'workspaces'))
      queryApi(DATO_API_TOKEN, { id, locale }, workspaceQuery)
        .then(addFilePathToObject(locale))
        .then(({ workspace, filePath }) => {
          writeToFile(path.join(dataFolder, filePath))(workspace)
          console.log(`Written workspacefile: ${filePath}`)
        })
    })
  }))
