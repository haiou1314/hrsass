import request from '@/utils/request'
/**
 * 登录请求
 * @param {*} data 请求对象
 * @returns promise
 */
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

/**
 * 获取用户信息
 * @returns promise
 */
export function userinfoApi() {
  return request({
    url: '/sys/profile',
    method: 'post',
  })
}
/**
 * 根据id获取用户详情
 * @param {*} id 
 * @returns promise
 */
export function userinfoDateil(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'GET',
  })
}

/** *
 *
 * 保存员工的基本信息
 * **/
 export function saveUserDetailById(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}
/** *
 *  更新用户详情的基础信息
 * **/
 export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data,
  })
}
