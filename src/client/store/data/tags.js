import getData from '../../lib/get-data'

export const state = () => []

export const mutations = {
  addTag(state, tag) {
    state.push(tag)
  },
}

export const actions = {
  async getTags({ commit }, locale) {
    const data = await getData({ locale, slug: 'tags' })
    data.tags.forEach(tag => commit('addTag', tag))
  },
}
