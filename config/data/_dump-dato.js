const { promisify } = require('util')
const path = require('path')
const readFile = promisify(require('fs').readFile)
const readDir = require('fs').readdirSync
const writeFile = require('fs').writeFileSync
const glob = promisify(require('glob'))
const mkdirp = promisify(require('mkdirp'))
const map = require('lodash/fp/map')
const identity = require('lodash/fp/identity')
const flatten = require('lodash/flatten')
const uniq = require('lodash/uniq')
const queryApi = require('../../src/client/lib/query-api')
const dotenv = require('dotenv-safe')
dotenv.config()

const availableLocales = ['en', 'nl']
const dataFolder = path.resolve(__dirname, '../../src/client/static/data')

const tap = input => { console.log(input); return input; }
const isQueryFile = file => /.graphql/.test(file)
const resolveTo = dir => file => path.resolve(dir, file)
const readFileFromPath = path => readFile(path, { encoding: 'utf8' })
const getFileUri = file => file.replace(__dirname, '').replace(/\.[\w\.]+$/, '')
const getTargetFilePath = (locale, file) => `${dataFolder}/${locale}${locale ? '/' : ''}${getFileUri(file)}.json`
const writeToFile = filePath => contents => writeFile(filePath, JSON.stringify(contents, null, 2))

const queryFilePaths = readDir(__dirname)
  .filter(isQueryFile)
  .map(resolveTo(__dirname))
  .reduce((obj, file) => {
    const [,fileName, localesStr] = /([\w-]+)(?:\.)([\w\.]+)*(?:\.)*graphql$/.exec(file)
    const locales = !localesStr
      ? ['none']
      : flatten(
          localesStr
            .split('.')
            .filter(identity)
            .map(locale => locale === 'all' ? availableLocales : locale)
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
    .then(queryApi(process.env.DATO_API_TOKEN, { locale }))
    .then(writeToFile(getTargetFilePath(locale, file)))
    .then(() => console.log(`Written ${locale}${getFileUri(file)}.json`))

const dumpByLocale = (locale, paths) => map(dumpByQueryFile(locale), paths)

Object.keys(queryFilePaths).forEach(locale => {
  const localePrefix = locale === 'none' ? '' : locale
  dumpByLocale(localePrefix, queryFilePaths[locale])
})

