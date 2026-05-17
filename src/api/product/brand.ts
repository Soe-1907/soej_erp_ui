import request from '@/utils/request'
import type { BrandDto, BrandQuery } from '@/type/brand'

// 商品品牌列表查询
export const queryAllBrandsApi = (params: BrandQuery) => {
  return request.get('/manager/brand', { params })
}
//更新商品品牌信息
export const updateBrandApi = (params: BrandDto) => {
  return request.put('/manager/brand/update', params)
}

//新增商品品牌
export const addBrandApi = (params: BrandDto) => {
  return request.post('/manager/brand/add', params)
}
//数据回显
export const getBrandByIdApi = (id: number) => {
  return request.get(`/manager/brand/${id}`)
}

/** PUT /prod-api/manager/brand/{brandId}/enable */
export const enableBrandApi = (brandId: number) => {
  return request.put(`/manager/brand/${brandId}/enable`)
}

/** PUT /prod-api/manager/brand/{brandId}/disable */
export const disableBrandApi = (brandId: number) => {
  return request.put(`/manager/brand/${brandId}/disable`)
}
