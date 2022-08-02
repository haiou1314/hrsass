import { login } from '@/api/user.js'
export default {
  namespaced: true,
  state: {
    token: '',
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload
    },
  },
  actions: {
    async getToken({ commit }, payload) {
      const res = await login(payload)             
      commit('setToken', res)
    },
  },
  getters: {},        
}
