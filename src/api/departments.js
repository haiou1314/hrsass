import request from '@/utils/request'
/**
 * 获取组织架构的数据
 * @returns promise
 */
export function getDepartments() {
  return request({
    url: '/company/department',
  })
}

/**
 * 删除部门
 * @param {*} id 
 * @returns 
 */
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete',
  })
}

/**
 * 添加部门
 * @param {*} data 
 * @returns promise
 */
export function addDepartmentsApi(data) {
  return request({
    url: `/company/department`,
    method: 'POST',
    data,
  })
}