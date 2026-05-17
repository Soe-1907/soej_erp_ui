import request from '@/utils/request'
import type { UomDto, UomQuery } from '@/type/uom'

// 商品单位列表查询
export const queryAllUomsApi = (params: UomQuery) => {
  return request.get('/manager/unit', { params })
}

// 更新商品单位信息
export const updateUomApi = (params: UomDto) => {
  return request.put('/manager/unit/update', params)
}

// 新增商品单位
export const addUomApi = (params: UomDto) => {
  return request.post('/manager/unit/add', params)
}

// 数据回显
export const getUomByIdApi = (id: number) => {
  return request.get(`/manager/unit/${id}`)
}

/** PUT /prod-api/manager/unit/{uomId}/enable */
export const enableUomApi = (uomId: number) => {
  return request.put(`/manager/unit/${uomId}/enable`)
}

/** PUT /prod-api/manager/unit/{uomId}/disable */
export const disableUomApi = (uomId: number) => {
  return request.put(`/manager/unit/${uomId}/disable`)
}
