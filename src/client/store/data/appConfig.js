import Vue from 'vue'
import getData from '../../lib/get-data'

export const state = () => ({})

export const mutations = {
  setConfig(state, settings) {
    Object.entries(settings)
      .forEach(([key, value]) => {
        Vue.set(state, key, value)
      })
  },
}

export const actions = {
  async getAppConfig({ commit }) {
    const data = await getData({ slug: 'app' })
    commit('setConfig', data.app)
  },
}

export const getters = {
  title(state, getters, rootState, rootGetters) {
    const activeWorkspace = rootGetters['data/workspaces/activeWorkspace'] || {}
    const workspaceTitle = activeWorkspace.applicationTitle

    // Sometimes, the title element in the head is not created. If that is the
    // case, add it and set it manually to the workspace title.
    if (typeof window !== 'undefined') {
      let titleElement = document.querySelector('title')
      if (!titleElement) {
        titleElement = document.createElement('title')
        document.querySelector('head').appendChild(titleElement)
      }
      titleElement.innerHTML = workspaceTitle || ''
    }
    return workspaceTitle || ''
  },
}
