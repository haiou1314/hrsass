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

/**
 * 根据id获取部门详情
 * @param {*} id
 * @returns promise
 */
export function editDepartmentsApi(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'GET',
  })
}

/**
 * 根据id编辑部门详情
 * @param {*} id
 * @returns promise
 */
export function updateDepartmentsApi(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'PUT',
    data,
  })
}
