import Vue from 'vue'
import getData from '../../lib/get-data'
import kebabCase from 'lodash/kebabCase'
import unset from 'lodash/unset'

export const state = () => ({
  _active: undefined,
})

export const mutations = {
  addWorkspace(state, workspace) {
    state[workspace.name] = workspace
  },
  fillWorkspace(state, workspaceData) {
    Vue.set(state, workspaceData.name, workspaceData)
  },
  setActive(state, activeWorkspace) {
    state._active = activeWorkspace
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
        measures: _workspace.measuresOverride.reduce((obj, override) => {
          const { measure, ...rest } = override

          Object.keys(rest).forEach(key => {
            if (rest[key] !== true && rest[key] !== false) {
              if (Boolean(rest[key]) === false) {
                unset(rest, key)
              }
            }
          })

          return { ...obj, [override.measure.measureId]: rest }
        }, {}),
      }

      commit('fillWorkspace', workspace)
      commit('setActive', workspace.name)
    }
  },
}

export const getters = {
  activeWorkspace(state) {
    return state[state._active]
  },
}
