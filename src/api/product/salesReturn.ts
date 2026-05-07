import request from '@/utils/request'
import type {
  SalesReturnAddRequestBody,
  SalesReturnDetailViewVO,
  SalesReturnPrefillVO,
  SalesReturnQuery,
  SalesReturnUpdateRequestBody,
} from '@/type/salesReturn'

export function serializeSalesReturnQuery(q: SalesReturnQuery): Record<string, unknown> {
  const { initiator, auditor, returnCode, salesOutboundCode, ...rest } = q
  const params: Record<string, unknown> = { ...rest }
  if (returnCode) params.salesReturnCode = returnCode
  if (salesOutboundCode) params.refSalesOutboundCode = salesOutboundCode
  if (initiator) params.initiatorKeyword = initiator
  if (auditor) params.auditorKeyword = auditor
  return params
}

export const querySalesReturnListApi = (params: SalesReturnQuery) => {
  return request.get('/salesReturn', { params: serializeSalesReturnQuery(params) })
}

export const getSalesReturnDetailViewApi = (salesReturnCode: string) => {
  return request.get<SalesReturnDetailViewVO>(
    `/salesReturn/detail-list/${encodeURIComponent(salesReturnCode)}`
  )
}

/** GET /api/salesReturn/prefill-lines?refSalesOutboundCode= */
export const prefillSalesReturnLinesApi = (refSalesOutboundCode: string) => {
  return request.get<SalesReturnPrefillVO>('/salesReturn/prefill-lines', {
    params: { refSalesOutboundCode },
  })
}

export const addSalesReturnApi = (body: SalesReturnAddRequestBody) => {
  return request.post('/salesReturn', body)
}

export const updateSalesReturnApi = (body: SalesReturnUpdateRequestBody) => {
  return request.put('/salesReturn', body)
}

export const deleteSalesReturnApi = (salesReturnCode: string) => {
  return request.delete(`/salesReturn/${encodeURIComponent(salesReturnCode)}`)
}

/** PUT /api/salesReturn/commit?salesReturnCode= */
export const submitSalesReturnApi = (salesReturnCode: string) => {
  return request.put('/salesReturn/commit', undefined, {
    params: { salesReturnCode },
  })
}
