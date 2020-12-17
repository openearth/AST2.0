/**
 * @see https://nuxtjs.org/api/configuration-plugins
 */
module.exports = [
  { src: '~/plugins/install-prompt', ssr: false },
  { src: '~/plugins/locale-urls' },
  { src: '~/plugins/netlify-identity', ssr: false },
  { src: '~/plugins/vue-material' },
  { src: '~/plugins/vue-touch-keyboard', ssr: false },
  { src: '~/plugins/vue-carousel', ssr: false },
  { src: '~/plugins/portal-vue' },
  { src: '~/plugins/tracking.client', ssr: false },
  { src: '~/plugins/pluvflood-params', ssr: false },
  { src: '~/plugins/api-queue' },
]
