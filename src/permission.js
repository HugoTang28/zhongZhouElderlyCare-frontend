import router from './router'
import NProgress from 'nprogress'
import { getToken } from '@/utils/auth'
import useUserStore from '@/store/modules/user'
import usePermissionStore from '@/store/modules/permission'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/404']

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      return
    }
    const userStore = useUserStore()
    const permissionStore = usePermissionStore()
    if (userStore.roles.length === 0) {
      try {
        // 拉取用户信息
        await userStore.getInfo()
        // 生成动态路由
        const accessRoutes = await permissionStore.generateRoutes()
        accessRoutes.forEach((route) => router.addRoute(route))
        // 兜底 404
        router.addRoute({ path: '/:pathMatch(.*)*', redirect: '/404', hidden: true })
        next({ ...to, replace: true })
      } catch (e) {
        userStore.resetState()
        next(`/login?redirect=${to.path}`)
      }
    } else {
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
