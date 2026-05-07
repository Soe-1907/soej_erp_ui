import request from '@/utils/request'
import type { ProductDto, ProductQuery, MasterDataOptionVO } from '@/type/product'

// 商品列表查询（GET /api/product）
export const queryAllProductsApi = (params: ProductQuery) => {
  return request.get('/product', { params })
}

// 新增商品（POST /api/product）
export const addProductApi = (params: ProductDto) => {
  return request.post('/product', params)
}

// 保存并新增（POST /api/product/save-and-add）
export const saveAndAddProductApi = (params: ProductDto) => {
  return request.post('/product/save-and-add', params)
}

// 修改商品（PUT /api/product）
export const updateProductApi = (params: ProductDto) => {
  return request.put('/product', params)
}

// 商品数据回显（GET /api/product/{productId}）
export const getProductByIdApi = (productId: number | string) => {
  return request.get(`/product/${productId}`)
}

export const enableProductApi = (productId: number) => {
  return request.put(`/product/${productId}/enable`)
}

export const disableProductApi = (productId: number) => {
  return request.put(`/product/${productId}/disable`)
}

export const clearProductImageApi = (productId: number) => {
  return request.delete(`/product/${productId}/image`)
}

export const listProductCategoryOptionsApi = () => {
  return request.get<MasterDataOptionVO[]>('/product/options/categories')
}

export const listProductBrandOptionsApi = () => {
  return request.get<MasterDataOptionVO[]>('/product/options/brands')
}

export const listProductUomOptionsApi = () => {
  return request.get<MasterDataOptionVO[]>('/product/options/uoms')
}

export const importProductsApi = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post<string>('/product/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

/** 下载空模板（响应体为 xlsx 文件流） */
export const downloadProductImportTemplateApi = () => {
  return request.get<Blob>('/product/import-template', { responseType: 'blob' })
}
