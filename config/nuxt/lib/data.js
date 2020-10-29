const locales = require('../../available-locales')
const appConfig = require('../../../src/client/static/data/app.json')

module.exports = {
  locales,
  appConfig: { title: appConfig.app.title },
}
