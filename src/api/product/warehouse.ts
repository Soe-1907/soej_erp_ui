import request from '@/utils/request'
import type { WarehouseDto, WarehouseQuery, UserOptionVO } from '@/type/warehouse'

/**
 * 查询仓库分页列表
 * 对应后端：GET /api/warehouse
 */
export const queryAllWarehousesApi = (params: WarehouseQuery) => {
  return request.get('/warehouse', { params })
}

/**
 * 新增仓库
 * 对应后端：POST /api/warehouse
 */
export const addWarehouseApi = (params: WarehouseDto) => {
  return request.post('/warehouse', params)
}

/**
 * 修改仓库信息
 * 对应后端：PUT /api/warehouse
 */
export const updateWarehouseApi = (params: WarehouseDto) => {
  return request.put('/warehouse', params)
}

/**
 * 查询单个仓库信息（回显）
 * 对应后端：GET /api/warehouse/{warehouseCode}
 */
export const getWarehouseByCodeApi = (warehouseCode: string) => {
  return request.get(`/warehouse/${warehouseCode}`)
}

/** GET /api/warehouse/specialists/available */
export const listAvailableWarehouseSpecialistsApi = (excludeWarehouseId?: number) => {
  return request.get<UserOptionVO[]>('/warehouse/specialists/available', {
    params: excludeWarehouseId != null ? { excludeWarehouseId } : {},
  })
}

/** PUT /api/warehouse/{warehouseCode}/enable */
export const enableWarehouseApi = (warehouseCode: string) => {
  return request.put(`/warehouse/${warehouseCode}/enable`)
}

/** PUT /api/warehouse/{warehouseCode}/disable */
export const disableWarehouseApi = (warehouseCode: string) => {
  return request.put(`/warehouse/${warehouseCode}/disable`)
}
