import { defineStore } from 'pinia'
import { getRouters } from '@/api/auth'
import Layout from '@/layout/index.vue'

// 匹配 src/views 下所有页面组件
const modules = import.meta.glob('@/views/**/*.vue')

// 后端路由 -> 前端路由结构
function filterAsyncRouter(routes) {
  return routes.map((route) => {
    const r = { ...route }
    if (r.component === 'Layout') {
      r.component = Layout
    } else if (typeof r.component === 'string') {
      r.component = loadView(r.component)
    }
    if (r.children && r.children.length) {
      r.children = filterAsyncRouter(r.children)
    }
    return r
  })
}

function loadView(view) {
  const key = `/src/views/${view}.vue`
  if (modules[key]) {
    return modules[key]
  }
  // 页面未开发时 fallback 到占位页，保证菜单可点击
  return modules['/src/views/placeholder/index.vue']
}

const usePermissionStore = defineStore('permission', {
  state: () => ({
    routes: [], // 完整路由（静态 + 动态）
    sidebarRouters: [] // 侧边栏菜单
  }),
  actions: {
    generateRoutes() {
      return new Promise((resolve, reject) => {
        getRouters()
          .then((res) => {
            const asyncRoutes = filterAsyncRouter(res.data)
            this.sidebarRouters = asyncRoutes
            this.routes = asyncRoutes
            resolve(asyncRoutes)
          })
          .catch(reject)
      })
    }
  }
})

export default usePermissionStore
