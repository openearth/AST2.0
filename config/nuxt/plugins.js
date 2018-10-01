/**
 * @see https://nuxtjs.org/api/configuration-plugins
 */
module.exports = [
  { src: '~/plugins/install-prompt', ssr: false },
  { src: '~/plugins/locale-urls' },
  { src: '~/plugins/vue-material' },
  { src: '~/plugins/vue-touch-keyboard', ssr: false },
  { src: '~/plugins/vue-carousel', ssr: false },
]
