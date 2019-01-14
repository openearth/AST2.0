const { appConfig } = require('./lib/data')
/**
 * @see https://nuxtjs.org/api/configuration-head
 */
module.exports = {
  title: appConfig.title,
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { 'http-equiv': 'Accept-CH', content: 'DPR, Width, Viewport-Width, Save-Data' },
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon.png' },
    // all other app icons are generated and added by the @nuxt/pwa module
    { rel: 'dns-prefetch', href: 'https://www.datocms-assets.com/' },
    { rel: 'stylesheet', href: 'https://api.tiles.mapbox.com/mapbox-gl-js/v0.48.0/mapbox-gl.css' },
    { rel: 'stylesheet', href: 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.0.4/mapbox-gl-draw.css' },
  ],
}
