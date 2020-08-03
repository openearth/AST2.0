require('dotenv-safe').config() // load env variables from .env file into process.env

const rev = require('fs').readFileSync('.git/HEAD').toString();
let branch;
let commit;
if (rev.indexOf(':') === -1) {
  commit = rev.substring(0, 7).trim();
} else {
  const file = require('path').join(__dirname, '../..', '.git/' + rev.substring(5).trim())
  commit = require('fs').readFileSync(file).toString().substring(0, 7).trim();
}

/**
 * Use Netlify's URL variable:
 * @see https://www.netlify.com/docs/continuous-deployment/#build-environment-variables
 *
 * We take variables from the Node process.env context
 * and make them available on Nuxt's process.env context.
 * For example `process.env.URL` from the Node context
 * becomes `process.env.baseUrl` in the Nuxt context.
 */
module.exports = {
  baseUrl: process.env.URL,
  branch: process.env.BRANCH,
  MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
  API_BASE: process.env.API_BASE,
  API_GBP: process.env.API_GBP,
  GIT_COMMIT: commit,
}
