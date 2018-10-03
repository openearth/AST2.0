export default function ({ redirect, store, route }) {
  const currentLevel = store.getters['flow/currentFilledInLevel']
  if (currentLevel.level < 2) {
    redirect(currentLevel.uri)
  }
}
