import request from '@/utils/request'
import type { BrandDto, BrandQuery } from '@/type/brand'

// 商品品牌列表查询
export const queryAllBrandsApi = (params: BrandQuery) => {
  return request.get('/brand', { params })
}
//更新商品品牌信息
export const updateBrandApi = (params:BrandDto) => {
  return request.put("/brand",params)
}

//新增商品品牌

export const addBrandApi = (params:BrandDto) => {
  return request.post("/brand",params)
}
//数据回显

export const getBrandByIdApi = (id:number) => {
  return request.get(`/brand/${id}`)
}

/** PUT /api/brand/{brandId}/enable */
export const enableBrandApi = (brandId: number) => {
  return request.put(`/brand/${brandId}/enable`)
}

/** PUT /api/brand/{brandId}/disable */
export const disableBrandApi = (brandId: number) => {
  return request.put(`/brand/${brandId}/disable`)
}