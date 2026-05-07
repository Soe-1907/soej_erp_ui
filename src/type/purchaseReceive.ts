/**
 * 采购入库（列表查询/VO）
 * 与后端 PurchaseReceiveQueryDto、PurchaseReceiveVo 对齐
 */
export interface PurchaseReceiveQuery {
  purchaseReceiveCode?: string
  warehouseKeyword?: string
  supplierKeyword?: string
  /** 0 待提交 1 待审核 2 审核通过 3 审核拒绝 */
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

export interface PurchaseReceiveVO {
  purchaseReceiveCode: string
  warehouseCode: string
  warehouseName: string
  supplierCode: string
  supplierName: string
  purchaseKindAmount: number
  purchaseAmount: number
  auditStatus: number
  auditStatusName: string
  initiator: string
  operationTime: string
  auditor: string
  auditTime: string
}

/**
 * 采购入库商品明细 DTO
 * 对应后端：PurchaseReceiveDetailDto
 */
export interface PurchaseReceiveDetailDto {
  detailId?: number
  purchaseReceiveCode?: string
  productCode?: string
  productName?: string
  categoryName?: string
  brandName?: string
  uomName?: string
  /** 建议采购价（元） */
  suggestPrice?: number | string
  /** 实际采购价（元） */
  actualPrice?: number | string
  /** 采购入库数量 */
  purchaseQuantity?: number | string
  /** 采购结算金额（元）= 数量 × 实际采购价 */
  settlementAmount?: number | string
}

/** 采购入库单商品明细（详情查询接口，与 PurchaseReceiveDetailVo 对齐） */
export interface PurchaseReceiveDetailVO {
  detailId?: number
  purchaseReceiveCode?: string
  productCode?: string
  productName?: string
  categoryName?: string
  brandName?: string
  uomName?: string
  suggestPrice?: number
  actualPrice?: number
  purchaseQuantity?: number
  settlementAmount?: number
}

/**
 * 采购入库 DTO（新增/修改主表）
 * 对应后端：PurchaseReceiveDto
 */
export interface PurchaseReceiveDto {
  purchaseReceiveCode?: string
  warehouseCode?: string
  warehouseName?: string
  supplierCode?: string
  supplierName?: string
  purchaseKindAmount?: number
  purchaseAmount?: number | string
  /** 审核状态：0 待提交（未提交） */
  auditStatus?: number
  initiator?: string
  operationTime?: string
  auditor?: string
  auditTime?: string
  /** 商品明细（新增一次性写入） */
  details?: PurchaseReceiveDetailDto[]
}

/** 采购入库操作记录（审核通过/拒绝等） */
export interface PurchaseReceiveRecordVO {
  recordId?: number
  purchaseReceiveCode?: string
  operationTime?: string
  operator?: string
  operationType?: string
  rejectReason?: string
}

/** 后端 PurchaseReceiveDetailLineVo */
export interface PurchaseReceiveDetailLineVO {
  lineNo?: number
  detailId?: number
  productCode?: string
  productName?: string
  categoryName?: string
  brandName?: string
  purchaseQuantity?: number
  uomName?: string
  suggestPurchasePrice?: number
  actualPurchasePrice?: number
  purchaseAmount?: number
}

/** 后端 InboundAuditOperationLogVo */
export interface InboundAuditOperationLogVO {
  operationTime?: string
  operatorName?: string
  operationType?: number
  operationTypeDesc?: string
  remark?: string
}

/** 后端 PurchaseReceiveDetailViewVo（GET /purchase/detail-list/{code}） */
export interface PurchaseReceiveDetailViewVO {
  purchaseReceiveCode?: string
  warehouseName?: string
  supplierName?: string
  auditStatus?: number
  auditStatusDesc?: string
  initiatorName?: string
  auditorName?: string
  operationTime?: string
  auditTime?: string
  remark?: string
  lines?: PurchaseReceiveDetailLineVO[]
  lineAmountTotal?: number
  operationLogs?: InboundAuditOperationLogVO[]
}

/** POST /purchase 请求体（PurchaseReceiveListDto）明细行 */
export interface PurchaseReceiveDetailSavePayload {
  productCode?: string
  purchaseQuantity?: number
  actualPurchasePrice?: number
  purchaseAmount?: number
}

/** PUT /purchase/detail-list 请求体 */
export interface PurchaseReceiveDetailListPayload {
  purchaseReceiveCode?: string
  warehouseCode?: string
  supplierCode?: string
  purchaseReceiveDetailList?: PurchaseReceiveDetailSavePayload[]
}
