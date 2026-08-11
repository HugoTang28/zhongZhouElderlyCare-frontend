import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getToken } from '@/utils/auth'
import useUserStore from '@/store/modules/user'
import router from '@/router'

// 创建 axios 实例
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 30000
})

// 请求拦截器：携带 token
service.interceptors.request.use(
  (config) => {
    if (getToken()) {
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器：统一错误处理
service.interceptors.response.use(
  (response) => {
    const res = response.data
    // 二进制流直接返回
    if (response.config.responseType === 'blob' || response.config.responseType === 'arraybuffer') {
      return res
    }
    if (res.code === 200) {
      return res
    }
    // 未登录或登录过期
    if (res.code === 401) {
      handleRelogin()
      return Promise.reject(new Error(res.msg || '登录状态已过期'))
    }
    ElMessage.error(res.msg || '系统错误')
    return Promise.reject(new Error(res.msg || '系统错误'))
  },
  (error) => {
    const { response } = error
    if (response && response.status === 401) {
      handleRelogin()
    } else {
      ElMessage.error(response?.data?.msg || error.message || '网络异常')
    }
    return Promise.reject(error)
  }
)

let relogining = false
function handleRelogin() {
  if (relogining) return
  relogining = true
  ElMessageBox.confirm('登录状态已过期，请重新登录', '系统提示', {
    confirmButtonText: '重新登录',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const userStore = useUserStore()
    userStore.resetState()
    router.push('/login')
  }).finally(() => {
    relogining = false
  })
}

export default service
