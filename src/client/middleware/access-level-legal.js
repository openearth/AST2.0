export default function ({ redirect, store, route }) {
  const currentLevel = store.getters['flow/currentFilledInLevel']
  if (currentLevel.level < 1) {
    redirect(currentLevel.uri)
  }
}
