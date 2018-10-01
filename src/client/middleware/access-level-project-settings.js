export default function ({ redirect, store, route }) {
  const currentLevel = store.getters['flow/currentFilledInLevel']
  if (currentLevel.level < 4) {
    redirect(currentLevel.uri)
  }
}
