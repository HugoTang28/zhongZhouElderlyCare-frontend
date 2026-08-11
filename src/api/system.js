import request from '@/utils/request'

// ===================== 用户管理 =====================
// 分页查询
export function listUser(query) {
  return request({ url: '/system/user/list', method: 'get', params: query })
}
// 详情（含已分配角色）
export function getUser(userId) {
  return request({ url: '/system/user/' + userId, method: 'get' })
}
// 新增
export function addUser(data) {
  return request({ url: '/system/user', method: 'post', data })
}
// 修改
export function updateUser(data) {
  return request({ url: '/system/user', method: 'put', data })
}
// 删除（ids 逗号拼接）
export function delUser(userIds) {
  return request({ url: '/system/user/' + userIds, method: 'delete' })
}
// 重置密码
export function resetUserPwd(userId, password) {
  return request({ url: '/system/user/resetPwd', method: 'put', params: { userId, password } })
}
// 状态修改
export function changeUserStatus(userId, status) {
  return request({ url: '/system/user/changeStatus', method: 'put', params: { userId, status } })
}
// 角色下拉选项
export function roleOptions() {
  return request({ url: '/system/user/roleOptions', method: 'get' })
}

// ===================== 角色管理 =====================
export function listRole(query) {
  return request({ url: '/system/role/list', method: 'get', params: query })
}
export function getRole(roleId) {
  return request({ url: '/system/role/' + roleId, method: 'get' })
}
export function addRole(data) {
  return request({ url: '/system/role', method: 'post', data })
}
export function updateRole(data) {
  return request({ url: '/system/role', method: 'put', data })
}
export function delRole(roleIds) {
  return request({ url: '/system/role/' + roleIds, method: 'delete' })
}
// 菜单下拉树
export function menuTree() {
  return request({ url: '/system/role/menuTree', method: 'get' })
}
// 分配菜单权限
export function authRoleMenu(roleId, menuIds) {
  return request({ url: '/system/role/authMenu', method: 'put', params: { roleId, menuIds } })
}

// ===================== 菜单管理 =====================
export function listMenu(query) {
  return request({ url: '/system/menu/list', method: 'get', params: query })
}
export function getMenu(menuId) {
  return request({ url: '/system/menu/' + menuId, method: 'get' })
}
export function addMenu(data) {
  return request({ url: '/system/menu', method: 'post', data })
}
export function updateMenu(data) {
  return request({ url: '/system/menu', method: 'put', data })
}
export function delMenu(menuId) {
  return request({ url: '/system/menu/' + menuId, method: 'delete' })
}
// 菜单下拉树（用于父菜单选择）
export function menuTreeselect() {
  return request({ url: '/system/menu/treeselect', method: 'get' })
}

// ===================== 部门管理 =====================
export function listDept() {
  return request({ url: '/system/dept/list', method: 'get' })
}
export function getDept(deptId) {
  return request({ url: '/system/dept/' + deptId, method: 'get' })
}
export function addDept(data) {
  return request({ url: '/system/dept', method: 'post', data })
}
export function updateDept(data) {
  return request({ url: '/system/dept', method: 'put', data })
}
export function delDept(deptId) {
  return request({ url: '/system/dept/' + deptId, method: 'delete' })
}
