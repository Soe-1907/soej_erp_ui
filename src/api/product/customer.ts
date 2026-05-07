import request from '@/utils/request'
import type { CustomerDto, CustomerQuery } from '@/type/customer'

/**
 * 查询客户分页列表
 * 对应后端：GET /api/customer
 */
export const queryAllCustomersApi = (params: CustomerQuery) => {
  return request.get('/customer', { params })
}

/**
 * 新增客户
 * 对应后端：POST /api/customer
 */
export const addCustomerApi = (params: CustomerDto) => {
  return request.post('/customer', params)
}

/**
 * 修改客户信息
 * 对应后端：PUT /api/customer
 */
export const updateCustomerApi = (params: CustomerDto) => {
  return request.put('/customer', params)
}

/**
 * 查询单个客户信息（回显）
 * 对应后端：GET /api/customer/{customerId}
 */
export const getCustomerByIdApi = (customerId: number | string) => {
  return request.get(`/customer/${customerId}`)
}

export const enableCustomerApi = (customerId: number) => {
  return request.put(`/customer/${customerId}/enable`)
}

export const disableCustomerApi = (customerId: number) => {
  return request.put(`/customer/${customerId}/disable`)
}
