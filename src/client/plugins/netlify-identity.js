import netlifyIdentity from 'netlify-identity-widget'
import delay from '../lib/delay'

export default ({ store }) => {
  const storeUser = user => {
    store.commit('user/setUser', user || null)
    if (user) {
      store.commit('project/acceptLegal')
    }
  }

  const logoutUser = async () => {
    store.commit('user/isRefreshing')
    await delay(10)
    window.location.reload(true)
  }

  netlifyIdentity.on('init', storeUser)
  netlifyIdentity.on('login', storeUser)
  netlifyIdentity.on('logout', logoutUser)
}

setTimeout(() => {
  netlifyIdentity.init()
}, 10)
