export default store => level => {
  return store.getters['flow/currentFilledInLevel'].level >= level
}
