const appConfig = require('../../../src/client/static/data/app.json')

module.exports = {
  appConfig: { title: appConfig.app.title },
  locales: ['en', 'nl', 'zh_CN'],
}
