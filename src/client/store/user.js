import Vue from 'vue'
import get from 'lodash/fp/get'
import filter from 'lodash/fp/filter'
import head from 'lodash/fp/head'
import pipe from 'lodash/fp/pipe'
import map from 'lodash/fp/map'
import kebabCase from 'lodash/fp/kebabCase'

export const state = () => ({
  data: null,
  isRefreshing: false,
})

export const mutations = {
  setUser(state, user) {
    const userObj = user
      ? JSON.parse(JSON.stringify(user))
      : null
    Vue.set(state, 'data', userObj)
  },
  isRefreshing(state) {
    state.isRefreshing = true
  },
  clearUser(state) {
    Vue.set(state, 'data', null)
  },
}

export const getters = {
  isLoggedIn(state) {
    return Boolean(state.data)
  },
  workspace(state) {
    return pipe([
      get('data.app_metadata.roles'),
      map(kebabCase),
      filter(item => item !== 'developer'),
      head,
    ])(state)
  },
}
