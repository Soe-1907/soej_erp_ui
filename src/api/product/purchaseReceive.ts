import request from '@/utils/request'
import type {
  InboundAuditOperationLogVO,
  PurchaseReceiveDetailListPayload,
  PurchaseReceiveDetailSavePayload,
  PurchaseReceiveDetailViewVO,
  PurchaseReceiveDto,
  PurchaseReceiveQuery,
} from '@/type/purchaseReceive'

function serializePurchaseReceiveQuery(q: PurchaseReceiveQuery): Record<string, unknown> {
  const { initiator, auditor, ...rest } = q
  const params: Record<string, unknown> = { ...rest }
  if (initiator) params.initiatorKeyword = initiator
  if (auditor) params.auditorKeyword = auditor
  return params
}

/** 新增明细：PurchaseReceiveListDto.purchaseReceiveDetails */
export function buildPurchaseReceiveAddPayload(dto: PurchaseReceiveDto): {
  warehouseCode?: string
  supplierCode?: string
  purchaseReceiveDetails: PurchaseReceiveDetailSavePayload[]
} {
  const details = (dto.details ?? []).map((d) => ({
    productCode: d.productCode,
    purchaseQuantity: Number(d.purchaseQuantity),
    actualPurchasePrice: Number(d.actualPrice),
    purchaseAmount: Number(d.settlementAmount),
  }))
  return {
    warehouseCode: dto.warehouseCode,
    supplierCode: dto.supplierCode,
    purchaseReceiveDetails: details,
  }
}

/** 修改明细：PurchaseReceiveDetailListDto */
export function buildPurchaseReceiveDetailListPayload(dto: PurchaseReceiveDto): PurchaseReceiveDetailListPayload {
  const purchaseReceiveDetailList = (dto.details ?? []).map((d) => ({
    productCode: d.productCode,
    purchaseQuantity: Number(d.purchaseQuantity),
    actualPurchasePrice: Number(d.actualPrice),
    purchaseAmount: Number(d.settlementAmount),
  }))
  const payload: PurchaseReceiveDetailListPayload = {
    purchaseReceiveCode: dto.purchaseReceiveCode,
    purchaseReceiveDetailList,
  }
  if (dto.warehouseCode) payload.warehouseCode = dto.warehouseCode
  if (dto.supplierCode) payload.supplierCode = dto.supplierCode
  return payload
}

/**
 * 采购入库单分页列表
 * 后端：GET /api/purchase
 */
export const queryPurchaseReceiveListApi = (params: PurchaseReceiveQuery) => {
  return request.get('/purchase', { params: serializePurchaseReceiveQuery(params) })
}

/**
 * 添加采购入库单（主单+明细）
 * 后端：POST /api/purchase，body PurchaseReceiveListDto
 */
export const addPurchaseReceiveApi = (params: PurchaseReceiveDto) => {
  return request.post('/purchase', buildPurchaseReceiveAddPayload(params))
}

/**
 * 查看：单头 + 明细 + 合计 + 操作记录
 * 后端：GET /api/purchase/detail-list/{purchaseReceiveCode}
 */
export const getPurchaseReceiveDetailViewApi = (purchaseReceiveCode: string) => {
  return request.get<PurchaseReceiveDetailViewVO>(
    `/purchase/detail-list/${encodeURIComponent(purchaseReceiveCode)}`
  )
}

/**
 * 修改采购入库商品明细（整单替换）
 * 后端：PUT /api/purchase/detail-list
 */
export const updatePurchaseReceiveDetailListApi = (payload: PurchaseReceiveDetailListPayload) => {
  return request.put('/purchase/detail-list', payload)
}

/**
 * 提交采购入库单
 * 后端：PUT /api/purchase/commit?purchaseReceiveCode=
 */
export const submitPurchaseReceiveApi = (purchaseReceiveCode: string) => {
  return request.put('/purchase/commit', {}, {
    params: { purchaseReceiveCode },
  })
}

/**
 * 删除采购入库单及明细
 * 后端：DELETE /api/purchase/{purchaseReceiveCode}
 */
export const deletePurchaseReceiveApi = (purchaseReceiveCode: string) => {
  return request.delete(`/purchase/${encodeURIComponent(purchaseReceiveCode)}`)
}

/**
 * 采购入库审核操作记录（可选单独拉取）
 * 后端：GET /api/purchase/{purchaseReceiveCode}/audit-logs
 */
export const getPurchaseReceiveAuditLogsApi = (purchaseReceiveCode: string) => {
  return request.get<InboundAuditOperationLogVO[]>(
    `/purchase/${encodeURIComponent(purchaseReceiveCode)}/audit-logs`
  )
}
