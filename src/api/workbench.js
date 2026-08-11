import request from '@/utils/request'

// 工作台（数据看板）统计
export function getWorkbenchStats() {
  return request({ url: '/workbench/stats', method: 'get' })
}
