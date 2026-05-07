import request from '@/utils/request'
import type { PageResult } from '@/type/page'
import type {
  InventoryTransferAddRequestBody,
  InventoryTransferDetailViewVo,
  InventoryTransferFilterOptionsVo,
  InventoryTransferListItem,
  InventoryTransferProductPickerVo,
  InventoryTransferProductQuery,
  InventoryTransferQuery,
  InventoryTransferUpdateRequestBody,
  InventoryTransferWarehousePickerVo,
  InventoryTransferWarehouseQuery,
} from '@/type/inventoryTransfer'

/** 库存调拨分页列表 */
export const queryInventoryTransferListApi = (params: InventoryTransferQuery) => {
  return request.get<PageResult<InventoryTransferListItem>>('/inventory/transfer', { params })
}

/** 新增库存调拨单（含明细） */
export const addInventoryTransferApi = (body: InventoryTransferAddRequestBody) => {
  return request.post('/inventory/transfer', body)
}

/** 修改库存调拨单（明细整单替换） */
export const updateInventoryTransferApi = (body: InventoryTransferUpdateRequestBody) => {
  return request.put('/inventory/transfer', body)
}

/** 提交库存调拨单（query 参数 transferCode） */
export const commitInventoryTransferApi = (transferCode: string) => {
  return request.put('/inventory/transfer/commit', null, {
    params: { transferCode },
  })
}

/** 删除库存调拨单 */
export const deleteInventoryTransferApi = (transferCode: string) => {
  return request.delete(`/inventory/transfer/${encodeURIComponent(transferCode)}`)
}

/** 详情回显（单头 + 明细） */
export const getInventoryTransferDetailApi = (transferCode: string) => {
  return request.get<InventoryTransferDetailViewVo>(
    `/inventory/transfer/detail/${encodeURIComponent(transferCode)}`
  )
}

/** 选择调出仓库分页 */
export const pickerFromWarehousesApi = (params: InventoryTransferWarehouseQuery) => {
  return request.get<PageResult<InventoryTransferWarehousePickerVo>>(
    '/inventory/transfer/picker/from-warehouses',
    { params }
  )
}

/** 选择调入仓库分页 */
export const pickerToWarehousesApi = (params: InventoryTransferWarehouseQuery) => {
  return request.get<PageResult<InventoryTransferWarehousePickerVo>>(
    '/inventory/transfer/picker/to-warehouses',
    { params }
  )
}

/** 选品分页（调出仓下启用商品且实际库存>0） */
export const pickerProductsApi = (params: InventoryTransferProductQuery) => {
  return request.get<PageResult<InventoryTransferProductPickerVo>>(
    '/inventory/transfer/picker/products',
    { params }
  )
}

/** 选品筛选项：分类/品牌（合并接口） */
export const pickerFilterOptionsApi = (params: InventoryTransferProductQuery) => {
  return request.get<InventoryTransferFilterOptionsVo>(
    '/inventory/transfer/picker/filter-options',
    { params }
  )
}
