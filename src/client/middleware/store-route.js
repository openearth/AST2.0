export default function ({ store, route }) {
  store.commit('flow/setRoute', route)
}
