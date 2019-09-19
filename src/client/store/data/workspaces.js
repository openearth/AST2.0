import Vue from 'vue'
import getData from '../../lib/get-data'
import kebabCase from 'lodash/kebabCase'
import unset from 'lodash/unset'

const defaultDomain = 'kbstoolbox-nl'

export const state = () => ({
  _domain: undefined,
  _user: undefined,
})

export const mutations = {
  addWorkspace(state, workspace) {
    state[workspace.name] = workspace
  },
  fillWorkspace(state, workspaceData) {
    Vue.set(state, workspaceData.name, workspaceData)
  },
  setUserWorkspace(state, workspaceName) {
    state._user = workspaceName
  },
  setDomain(state, _domain) {
    const [domain] = /\w+-\w+$/.exec(_domain) || []
    const availableWorkspaces = Object.keys(state)

    state._domain = availableWorkspaces.indexOf(domain) === -1
      ? defaultDomain
      : domain
  },
}

export const actions = {
  async getWorkspaces({ commit }) {
    const { workspaces } = await getData({ slug: 'workspaces' })
    workspaces
      .map(workspace => ({ ...workspace, name: kebabCase(workspace.name) }))
      .forEach(workspace => commit('addWorkspace', workspace))
  },

  async storeWorkspaceData({ commit }, name) {
    const _workspace = await getData({ folder: 'data/workspaces', slug: name })
    if (_workspace) {
      const workspace = {
        ..._workspace,
        name: kebabCase(_workspace.name),
        measures: (_workspace.measureOverrides || []).reduce((obj, override) => {

          Object.keys(override).forEach(key => {
            if (override[key] !== true && override[key] !== false) {
              if (Boolean(override[key]) === false) {
                unset(override, key)
              }
            }
          })

          return { ...obj, [override.measureId]: override }
        }, {}),
      }

      commit('fillWorkspace', workspace)
    }
  },
}

export const getters = {
  activeWorkspace(state) {
    const activeName = state._user || state._domain
    return state[activeName]
  },
}
