export default function ({ redirect, store, route }) {
  const currentLevel = store.getters['flow/currentFilledInLevel']
  if (currentLevel.level < 3) {
    redirect(currentLevel.uri)
  }
}
