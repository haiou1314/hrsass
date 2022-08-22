import request from '@/utils/request'

/**
 * 获取用户列表
 * @param {Object} params
 * @returns promise
 */
export function getRoleApi(params) {
  return request({
    url: '/sys/role',
    params,
  })
}

/**
 * 添加角色
 * @param {Object} data
 * @returns promise
 */
export function addRoleApi(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data,
  })
}

/** **
 *  删除角色
 *
 * ****/
export function deleteRoleApi(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete',
  })
}

// 获取权限点
export function getRolesInfo(id) {
  return request({
    url: `/sys/role/${id}`,
  })
}


// 给角色分配权限
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}

