export const state = () => ({
  messages: [],
})

export const mutations = {
  add(state, { message, duration, type, id, closable = true }) {
    state.messages.push({
      id,
      message,
      duration,
      type,
      closable,
    })
  },

  remove(state, id) {
    const notification = state.messages.find(item => item.id === id)
    const index = state.messages.indexOf(notification)
    if (index !== -1) {
      state.messages.splice(index, 1)
    }
  },
}

export const actions = {
  showNotification({ commit }, { message, duration, type, closable }) {
    const id = Date.now().toString()
    commit('add', { message, duration, type, id, closable })

    if (duration > 0) {
      setTimeout(() => { commit('remove', id) }, duration)
    }
    return id
  },

  async showWarning({ dispatch }, { message, closable, duration = 4000 }) {
    return await dispatch('showNotification', { message, duration, closable, type: 'warning' })
  },

  async showError({ dispatch }, { message, closable, duration = 4000 }) {
    return await dispatch('showNotification', { message, duration, closable, type: 'error' })
  },
}
