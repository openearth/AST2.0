import netlifyIdentity from 'netlify-identity-widget'
import delay from '../lib/delay'
import kebabCase from 'lodash/kebabCase'

export default ({ store }) => {
  const storeUser = async user => {
    store.commit('user/setUser', user || null)
    store.commit('data/workspaces/setDomain', kebabCase(window.location.hostname))
  }

  const logoutUser = async () => {
    store.commit('user/isRefreshing')
    await delay(10)
    window.location.reload(true)
  }

  netlifyIdentity.on('init', storeUser)
  netlifyIdentity.on('login', storeUser)
  netlifyIdentity.on('logout', logoutUser)

  window.netlifyIdentity = netlifyIdentity

  setTimeout(() => {
    netlifyIdentity.init({ APIUrl: 'https://kbstoolbox.nl/.netlify/identity' })
  }, 10)
}
