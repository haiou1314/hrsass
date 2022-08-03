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

