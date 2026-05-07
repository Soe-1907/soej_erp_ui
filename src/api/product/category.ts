import request from '@/utils/request'
import type { CategoryDto, CategoryQuery } from '@/type/category'

// 商品分类列表查询（GET /api/category）
export const queryAllCategoriesApi = (params: CategoryQuery) => {
  return request.get('/category', { params })
}

// 新增商品分类（POST /api/category）
export const addCategoryApi = (params: CategoryDto) => {
  return request.post('/category', params)
}

// 修改商品分类（PUT /api/category）
export const updateCategoryApi = (params: CategoryDto) => {
  return request.put('/category', params)
}

// 分类数据回显（GET /api/category/{categoryId}）
export const getCategoryByIdApi = (categoryId: number | string) => {
  return request.get(`/category/${categoryId}`)
}

/** PUT /api/category/{categoryId}/enable */
export const enableCategoryApi = (categoryId: number) => {
  return request.put(`/category/${categoryId}/enable`)
}

/** PUT /api/category/{categoryId}/disable */
export const disableCategoryApi = (categoryId: number) => {
  return request.put(`/category/${categoryId}/disable`)
}
