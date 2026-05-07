export interface PurchaseReturnQuery {
  returnCode?: string
  purchaseReceiveCode?: string
  warehouseKeyword?: string
  supplierKeyword?: string
  auditStatus?: number
  initiator?: string
  auditor?: string
  operationTimeStart?: string
  operationTimeEnd?: string
  auditTimeStart?: string
  auditTimeEnd?: string
  pageNum?: number
  pageSize?: number
}

export interface PurchaseReturnVO {
  returnCode: string
  purchaseReceiveCode: string
  warehouseCode: string
  warehouseName: string
  supplierCode: string
  supplierName: string
  returnKindAmount: number
  returnAmount: number
  auditStatus: number
  auditStatusName: string
  initiator: string
  operationTime: string
  auditor?: string
  auditTime?: string
}

export interface PurchaseReturnDetailDto {
  detailId?: number
  purchaseReceiveCode?: string
  productCode?: string
  productName?: string
  categoryName?: string
  brandName?: string
  uomName?: string
  purchaseQuantity?: number | string
  actualPrice?: number | string
  settlementAmount?: number | string
  returnQuantity?: number | string
}

export interface PurchaseReturnDetailVO extends PurchaseReturnDetailDto {
  returnCode?: string
  availableStock?: number
  returnableQuantity?: number
  returnItemAmount?: number | string
}

export interface PurchaseReturnDto {
  returnCode?: string
  purchaseReceiveCode?: string
  warehouseCode?: string
  warehouseName?: string
  supplierCode?: string
  supplierName?: string
  initiator?: string
  operationTime?: string
  details?: PurchaseReturnDetailDto[]
}

export interface PurchaseReceiveForReturnVO {
  purchaseReceiveCode: string
  warehouseCode: string
  warehouseName: string
  supplierCode: string
  supplierName: string
  details: PurchaseReturnDetailVO[]
}

export interface PurchaseReturnRecordVO {
  recordId?: number
  returnCode?: string
  operationTime?: string
  operator?: string
  operationType?: string
  rejectReason?: string
}

/** 后端 PurchaseReturnDetailLineVo */
export interface PurchaseReturnDetailLineVO {
  lineNo?: number
  detailId?: number
  productCode?: string
  productName?: string
  categoryName?: string
  brandName?: string
  purchaseQuantity?: number
  availableQuantity?: number
  returnableQuantity?: number
  returnQuantity?: number | null
  uomName?: string
  suggestPurchasePrice?: number
  actualPurchasePrice?: number
  purchaseLineSettlementAmount?: number
  returnAmount?: number | null
  purchaseAmount?: number | null
}

/** 后端 OutboundAuditOperationLogVo */
export interface OutboundAuditOperationLogVO {
  operationTime?: string
  operatorName?: string
  operationType?: number
  operationTypeDesc?: string
  remark?: string
}

/** 后端 PurchaseReturnDetailViewVo */
export interface PurchaseReturnDetailViewVO {
  purchaseReturnCode?: string
  refPurchaseReceiveCode?: string
  warehouseName?: string
  supplierName?: string
  auditStatus?: number
  auditStatusDesc?: string
  initiatorName?: string
  auditorName?: string
  operationTime?: string
  auditTime?: string
  remark?: string
  lines?: PurchaseReturnDetailLineVO[]
  lineAmountTotal?: number
  operationLogs?: OutboundAuditOperationLogVO[]
}

/** POST /purchaseReturn 明细（PurchaseReturnDetail） */
export interface PurchaseReturnDetailSavePayload {
  productCode?: string
  returnQuantity?: number
  actualPurchasePrice?: number
  returnAmount?: number
}

/** POST /purchaseReturn body（PurchaseReceiveReturnDto 中与写入相关的字段） */
export interface PurchaseReturnAddPayload {
  refPurchaseReceiveCode?: string
  purchaseReceiveReturnDetails?: PurchaseReturnDetailSavePayload[]
}

/** PUT /purchaseReturn/detail-list */
export interface PurchaseReturnDetailListPayload {
  purchaseReturnCode?: string
  refPurchaseReceiveCode?: string
  purchaseReturnDetailList?: PurchaseReturnDetailSavePayload[]
}
