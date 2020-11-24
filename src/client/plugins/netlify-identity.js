import netlifyIdentity from 'netlify-identity-widget'
import delay from '../lib/delay'
import kebabCase from 'lodash/kebabCase'

export default ({ store }) => {
  console.log(
    `%c AST 2.0 %c commit: ${process.env.GIT_COMMIT} `,
    'background: #008fc5; color: #fff; border-radius: 3px 0 0 3px;',
    'background: #263238; color: #eeffff; border-radius: 0 3px 3px 0; font-weight: 400;',
  )

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
