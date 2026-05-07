import request from '@/utils/request'
import type { SupplierDto, SupplierQuery } from '@/type/supplier'

/**
 * 查询供应商分页列表
 * 对应后端：GET /api/supplier
 */
export const queryAllSuppliersApi = (params: SupplierQuery) => {
  return request.get('/supplier', { params })
}

/**
 * 新增供应商
 * 对应后端：POST /api/supplier
 */
export const addSupplierApi = (params: SupplierDto) => {
  return request.post('/supplier', params)
}

/**
 * 修改供应商
 * 对应后端：PUT /api/supplier
 */
export const updateSupplierApi = (params: SupplierDto) => {
  return request.put('/supplier', params)
}

/**
 * 查询供应商详情（回显）
 * 对应后端：GET /api/supplier/{supplierId}
 */
export const getSupplierByIdApi = (supplierId: number | string) => {
  return request.get(`/supplier/${supplierId}`)
}

export const enableSupplierApi = (supplierId: number) => {
  return request.put(`/supplier/${supplierId}/enable`)
}

export const disableSupplierApi = (supplierId: number) => {
  return request.put(`/supplier/${supplierId}/disable`)
}
