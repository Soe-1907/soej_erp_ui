import request from '@/utils/request'
import type {
  InventoryDistributionFilterOptionsVO,
  SalesOutboundAddRequestBody,
  SalesOutboundDetailViewVO,
  SalesOutboundProductPickerQuery,
  SalesOutboundQuery,
  SalesOutboundUpdateRequestBody,
  SalesOutboundProductPickerVO,
} from '@/type/salesOutbound'

/** 查询参数序列化：与后端 SalesOutboundQueryDto 对齐 */
export function serializeSalesOutboundQuery(q: SalesOutboundQuery): Record<string, unknown> {
  const { initiator, auditor, outboundCode, ...rest } = q
  const params: Record<string, unknown> = { ...rest }
  if (outboundCode) params.salesOutboundCode = outboundCode
  if (initiator) params.initiatorKeyword = initiator
  if (auditor) params.auditorKeyword = auditor
  return params
}

/** 分页列表 GET /api/salesOutbound */
export const querySalesOutboundListApi = (params: SalesOutboundQuery) => {
  return request.get('/salesOutbound', { params: serializeSalesOutboundQuery(params) })
}

/** 详情（单头+明细+操作记录）GET /api/salesOutbound/detail-list/{code} */
export const getSalesOutboundDetailViewApi = (salesOutboundCode: string) => {
  return request.get<SalesOutboundDetailViewVO>(
    `/salesOutbound/detail-list/${encodeURIComponent(salesOutboundCode)}`
  )
}

export const addSalesOutboundApi = (body: SalesOutboundAddRequestBody) => {
  return request.post('/salesOutbound', body)
}

export const updateSalesOutboundApi = (body: SalesOutboundUpdateRequestBody) => {
  return request.put('/salesOutbound', body)
}

export const deleteSalesOutboundApi = (salesOutboundCode: string) => {
  return request.delete(`/salesOutbound/${encodeURIComponent(salesOutboundCode)}`)
}

/** PUT /api/salesOutbound/commit?salesOutboundCode= */
export const submitSalesOutboundApi = (salesOutboundCode: string) => {
  return request.put('/salesOutbound/commit', undefined, {
    params: { salesOutboundCode },
  })
}

/** 选品分页 GET /api/salesOutbound/picker/products */
export const querySalesOutboundPickerProductsApi = (params: SalesOutboundProductPickerQuery) => {
  return request.get('/salesOutbound/picker/products', { params })
}

/** 选品筛选项 GET /api/salesOutbound/picker/filter-options */
export const querySalesOutboundPickerFilterOptionsApi = (params: SalesOutboundProductPickerQuery) => {
  return request.get<InventoryDistributionFilterOptionsVO>('/salesOutbound/picker/filter-options', {
    params,
  })
}

export type SalesOutboundProductPickerPage = {
  list: SalesOutboundProductPickerVO[]
  total: number
}
