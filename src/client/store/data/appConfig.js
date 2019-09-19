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
