import router, { asyncRoutes } from '@/router/index.js'
import store from '@/store/index.js'

const whiteList = ['/login', '/404']
router.beforeEach(async (to, from, next) => {
  const token = store.state.user.token
  if (token) {
    if (!store.state.user.userinfo.userId) {
      const { roles } = await store.dispatch('user/getuserinfo')
      await store.dispatch('permission/filterRoutes', roles)
      await store.dispatch('permission/setPoints', roles.points)
      next(to.path)
    }
    // store.dispatch('user/getuserinfo')
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    const isCludes = whiteList.includes(to.path)
    if (isCludes) {
      next()
    } else {
      next('/login')
    }
  }
})
