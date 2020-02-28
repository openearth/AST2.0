import Vue from 'vue'
import getData from '../../lib/get-data'
import kebabCase from 'lodash/kebabCase'
import unset from 'lodash/unset'

const defaultDomain = process.env.NODE_ENV === 'development'
  ? 'toolboxks-nl'
  : 'kbstoolbox-nl'

export const state = () => ({
  _domain: undefined,
  _user: undefined,
})

export const mutations = {
  addWorkspace(state, workspace) {
    Vue.set(state, workspace.name, workspace)
  },
  fillWorkspace(state, workspaceData) {
    Vue.set(state, workspaceData.name, workspaceData)
  },
  setUserWorkspace(state, workspaceName) {
    Vue.set(state, '_user', workspaceName)
  },
  setDomain(state, _domain) {
    const [domain] = /(\w+-)+\w+$/.exec(_domain) || []
    const availableWorkspaces = Object.keys(state)
    const domainName = availableWorkspaces.indexOf(domain) === -1
      ? defaultDomain
      : domain

    Vue.set(state, '_domain', domainName)
  },
}

export const actions = {
  async getWorkspaces({ commit }) {
    const { workspaces } = await getData({ slug: 'workspaces' })
    workspaces
      .map(workspace => ({ ...workspace, name: kebabCase(workspace.name) }))
      .forEach(workspace => commit('addWorkspace', workspace))
  },

  async storeWorkspaceData({ commit, dispatch }, { domain: slug, locale }) {
    const _workspace = await getData({ slug: `workspaces/${slug}`, locale })
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
      dispatch('project/bootstrapWmsLayers', workspace.wmsLayers, { root: true })
      dispatch('project/bootstrapMapLayers', workspace.mapLayers, { root: true })
      dispatch('project/bootstrapLayers', workspace.layers, { root: true })
    }
  },
}

export const getters = {
  activeWorkspace(state, getters, rootState) {
    const activeDomain = state._domain;
    const activeUser = state._user;
    const activeName = activeUser || activeDomain;
    const workspace = state[activeName]
    let scenarioName
    if (workspace && rootState.data.scenarios) {
      const options = (workspace.scenarios || []).length ? workspace.scenarios : rootState.data.scenarios
      scenarioName = {
        defaultValue: options[0],
        options,
      }
    }
    return workspace ? { ...workspace, scenarioName  } : workspace
  },
}
