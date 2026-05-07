import request from '@/utils/request'
import type {
  PurchaseReturnAddPayload,
  PurchaseReturnDetailLineVO,
  PurchaseReturnDetailListPayload,
  PurchaseReturnDetailViewVO,
  PurchaseReturnDto,
  PurchaseReturnQuery,
} from '@/type/purchaseReturn'

function serializePurchaseReturnQuery(q: PurchaseReturnQuery): Record<string, unknown> {
  const { returnCode, purchaseReceiveCode, initiator, auditor, ...rest } = q
  const params: Record<string, unknown> = { ...rest }
  if (returnCode) params.purchaseReturnCode = returnCode
  if (purchaseReceiveCode) params.refPurchaseReceiveCode = purchaseReceiveCode
  if (initiator) params.initiatorKeyword = initiator
  if (auditor) params.auditorKeyword = auditor
  return params
}

export function buildPurchaseReturnAddPayload(dto: PurchaseReturnDto): PurchaseReturnAddPayload {
  return {
    refPurchaseReceiveCode: dto.purchaseReceiveCode,
    purchaseReceiveReturnDetails: (dto.details ?? []).map((d) => ({
      productCode: d.productCode,
      returnQuantity: Number(d.returnQuantity),
    })),
  }
}

export function buildPurchaseReturnDetailListPayload(dto: PurchaseReturnDto): PurchaseReturnDetailListPayload {
  return {
    purchaseReturnCode: dto.returnCode,
    refPurchaseReceiveCode: dto.purchaseReceiveCode,
    purchaseReturnDetailList: (dto.details ?? []).map((d) => ({
      productCode: d.productCode,
      returnQuantity: Number(d.returnQuantity),
    })),
  }
}

/** 分页查询 后端：GET /api/purchaseReturn */
export const queryPurchaseReturnListApi = (params: PurchaseReturnQuery) => {
  return request.get('/purchaseReturn', { params: serializePurchaseReturnQuery(params) })
}

/** 按关联入库单预览可退商品行 后端：GET /api/purchaseReturn/ref/returnable-lines */
export const listReturnableLinesApi = (refPurchaseReceiveCode: string) => {
  return request.get<PurchaseReturnDetailLineVO[]>('/purchaseReturn/ref/returnable-lines', {
    params: { refPurchaseReceiveCode },
  })
}

/** 新增采购退货单 后端：POST /api/purchaseReturn */
export const addPurchaseReturnApi = (params: PurchaseReturnDto) => {
  return request.post('/purchaseReturn', buildPurchaseReturnAddPayload(params))
}

/** 详情（单头+明细+操作记录） 后端：GET /api/purchaseReturn/detail-list/{purchaseReturnCode} */
export const getPurchaseReturnDetailViewApi = (purchaseReturnCode: string) => {
  return request.get<PurchaseReturnDetailViewVO>(
    `/purchaseReturn/detail-list/${encodeURIComponent(purchaseReturnCode)}`
  )
}

/** 修改明细（整单替换） 后端：PUT /api/purchaseReturn/detail-list */
export const updatePurchaseReturnDetailListApi = (payload: PurchaseReturnDetailListPayload) => {
  return request.put('/purchaseReturn/detail-list', payload)
}

/** 删除 后端：DELETE /api/purchaseReturn/{purchaseReturnCode} */
export const deletePurchaseReturnApi = (purchaseReturnCode: string) => {
  return request.delete(`/purchaseReturn/${encodeURIComponent(purchaseReturnCode)}`)
}

/** 提交 后端：PUT /api/purchaseReturn/commit?purchaseReturnCode= */
export const submitPurchaseReturnApi = (purchaseReturnCode: string) => {
  return request.put('/purchaseReturn/commit', {}, {
    params: { purchaseReturnCode },
  })
}
