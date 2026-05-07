import request from '@/utils/request'
import type { UomDto, UomQuery } from '@/type/uom'

// 商品单位列表查询
export const queryAllUomsApi = (params: UomQuery) => {
  return request.get('/uom', { params })
}

// 更新商品单位信息
export const updateUomApi = (params: UomDto) => {
  return request.put("/uom", params)
}

// 新增商品单位
export const addUomApi = (params: UomDto) => {
  return request.post("/uom", params)
}

// 数据回显
export const getUomByIdApi = (id: number) => {
  return request.get(`/uom/${id}`)
}

/** PUT /api/uom/{uomId}/enable */
export const enableUomApi = (uomId: number) => {
  return request.put(`/uom/${uomId}/enable`)
}

/** PUT /api/uom/{uomId}/disable */
export const disableUomApi = (uomId: number) => {
  return request.put(`/uom/${uomId}/disable`)
}
