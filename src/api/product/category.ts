import request from '@/utils/request'
import type { CategoryDto, CategoryQuery } from '@/type/category'

// 商品分类列表查询（GET /prod-api/manager/category）
export const queryAllCategoriesApi = (params: CategoryQuery) => {
  return request.get('/manager/category', { params })
}

// 新增商品分类（POST /prod-api/manager/category/add）
export const addCategoryApi = (params: CategoryDto) => {
  return request.post('/manager/category/add', params)
}

// 修改商品分类（PUT /prod-api/manager/category/update）
export const updateCategoryApi = (params: CategoryDto) => {
  return request.put('/manager/category/update', params)
}

// 分类数据回显（GET /prod-api/manager/category/{categoryId}）
export const getCategoryByIdApi = (categoryId: number | string) => {
  return request.get(`/manager/category/${categoryId}`)
}

/** PUT /prod-api/manager/category/{categoryId}/enable */
export const enableCategoryApi = (categoryId: number) => {
  return request.put(`/manager/category/${categoryId}/enable`)
}

/** PUT /prod-api/manager/category/{categoryId}/disable */
export const disableCategoryApi = (categoryId: number) => {
  return request.put(`/manager/category/${categoryId}/disable`)
}
