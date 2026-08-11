import { defineStore } from 'pinia'
import { login, logout, getInfo } from '@/api/auth'
import { getToken, setToken, removeToken } from '@/utils/auth'

const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    id: null,
    name: '',
    avatar: '',
    roles: [],
    permissions: []
  }),
  actions: {
    // 登录
    login(loginForm) {
      return new Promise((resolve, reject) => {
        login({ username: loginForm.username.trim(), password: loginForm.password })
          .then((res) => {
            setToken(res.data.token)
            this.token = res.data.token
            resolve()
          })
          .catch(reject)
      })
    },
    // 获取用户信息
    getInfo() {
      return new Promise((resolve, reject) => {
        getInfo()
          .then((res) => {
            const { user, roles, permissions } = res.data
            this.id = user.id
            this.name = user.nickName || user.username
            this.avatar = user.avatar || ''
            this.roles = roles && roles.length ? roles : ['ROLE_DEFAULT']
            this.permissions = permissions || []
            resolve(res)
          })
          .catch(reject)
      })
    },
    // 退出登录
    logout() {
      return new Promise((resolve) => {
        logout().finally(() => {
          this.resetState()
          resolve()
        })
      })
    },
    // 重置状态
    resetState() {
      this.token = null
      this.id = null
      this.name = ''
      this.avatar = ''
      this.roles = []
      this.permissions = []
      removeToken()
    }
  }
})

export default useUserStore
