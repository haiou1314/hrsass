import router, { asyncRoutes, constantRoutes } from '@/router/index.js'

export default {
  namespaced: true,
  state: {
    routes: [],
    points: [],
  },
  mutations: {
    // 用户权限
    setRoutes(state, routes) {
      state.routes = [...constantRoutes, ...routes]
    },
    // 操作权限
    setPoints(state, points) {
      state.points = points
    },
  },
  actions: {
    // 用户权限
    filterRoutes(context, roles) {
      const routes = asyncRoutes.filter((item) => {
        return roles.menus.includes(item.meta.id)
      })
      context.commit('setRoutes', routes)
      router.addRoutes([
        ...routes,
        { path: '*', redirect: '/404', hidden: true },
      ])
    },
    // 操作权限
    setPoints(context, points) {
      context.commit('setPoints', points)
    },
  },
}
