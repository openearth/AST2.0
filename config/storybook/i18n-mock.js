import VueI18n from 'vue-i18n'

export const mockLocales = locales => {
  return locales.map(locale => ({
    code: locale,
    iso: locale,
    name: locale,
  }))
}

export const i18n = () => {
  return new VueI18n({
    locale: 'en',
    messages: {
    },
  })
}
