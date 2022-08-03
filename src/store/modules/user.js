import { login, userinfoApi, userinfoDateil } from '@/api/user.js'
import { setTokenTime } from '@/utils/auth'
export default {
  namespaced: true,
  state: {
    token: '',
    userinfo: {},
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload
    },
    setuserinfo(state, payload) {
      state.userinfo = payload
    },
  },
  actions: {
    // token
    async getToken({ commit }, payload) {
      const res = await login(payload)
      commit('setToken', res)
      setTokenTime()
    },
    //用户信息
    async getuserinfo({ commit }) {
      const userBaseinfo = await userinfoApi()
      const userinfo = await userinfoDateil(userBaseinfo.userId)
      commit('setuserinfo', { ...userBaseinfo, ...userinfo })
    },
    //登出
    logout({commit}){
      commit('setToken','')
      commit('setuserinfo',{})
    }
  },
  getters: {},
}
