import request from '@/utils/request'

// 通用业务 CRUD 接口（对接后端 BizController /biz/{module}/...）

export function listBiz(module, params) {
  return request({ url: `/biz/${module}/list`, method: 'get', params })
}

export function getBiz(module, id) {
  return request({ url: `/biz/${module}/${id}`, method: 'get' })
}

export function addBiz(module, data) {
  return request({ url: `/biz/${module}`, method: 'post', data })
}

export function editBiz(module, data) {
  return request({ url: `/biz/${module}`, method: 'put', data })
}

export function delBiz(module, id) {
  return request({ url: `/biz/${module}/${id}`, method: 'delete' })
}
