import request from '@/utils/request'
/**
 * 
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
