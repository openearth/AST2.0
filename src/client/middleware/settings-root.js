export default function ({ redirect, store, route }) {
  const { locale } = store.state.i18n
  if (route.fullPath === `/${locale}/settings/` || route.fullPath === `/${locale}/settings`) {
    redirect(`/${locale}/settings/project-area`)
  }
}
