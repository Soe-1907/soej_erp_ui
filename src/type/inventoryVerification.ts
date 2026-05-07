/**
 * 出库审核业务类型枚举（与后端 AuditBusinessTypeEnum 一致：4-6）
 */
export const OUTBOUND_BUSINESS_TYPES = [
  { value: 4, label: '采购退货' },
  { value: 5, label: '销售出库' },
  { value: 6, label: '调拨出库' },
] as const

/**
 * 审核状态枚举（与后端 AuditStatusEnum 一致：1-3）
 */
export const AUDIT_STATUS_OPTIONS = [
  { value: 1, label: '待审核' },
  { value: 2, label: '审核通过' },
  { value: 3, label: '审核拒绝' },
] as const

/**
 * 出库审核分页查询条件（与后端 OutboundAuditQueryDto 对齐）
 */
export interface OutboundAuditQuery {
  billCodeKeyword?: string
  warehouseKeyword?: string
  /** 业务类型：4 采购退货 5 销售出库 6 调拨出库 */
  businessType?: number
  /** 审核状态：1 待审核 2 审核通过 3 审核拒绝 */
  auditStatus?: number
  initiatorNameKeyword?: string
  auditorNameKeyword?: string
  operationTimeStart?: string
  operationTimeEnd?: string
  auditTimeStart?: string
  auditTimeEnd?: string
  pageNum?: number
  pageSize?: number
}

/**
 * 出库审核分页列表行（与后端 OutboundAuditListVo 对齐）
 */
export interface OutboundAuditListItem {
  billCode: string
  warehouseCode: string
  warehouseName: string
  businessType: number
  businessTypeDesc: string
  categoryKindCount: number
  auditStatus: number
  auditStatusDesc: string
  initiatorName: string
  operationTime?: string
  auditorName?: string
  auditTime?: string
}

/**
 * 出库审核明细商品行（与后端 OutboundAuditProductLineVo 对齐）
 */
export interface OutboundAuditProductLine {
  rowNo?: number
  productCode: string
  productName: string
  categoryName: string
  brandName: string
  /** 可用库存数量（待审核、审核拒绝时返回；审核通过时为 null） */
  availableQuantity?: number
  outboundQuantity: number
  uomName: string
  /** 行备注（调拨出库等） */
  lineRemark?: string
}

/**
 * 出库审核操作记录（与后端 OutboundAuditOperationLogVo 对齐）
 */
export interface OutboundAuditOperationLog {
  operationTime?: string
  operatorName?: string
  operationType?: number
  operationTypeDesc?: string
  remark?: string
}

/**
 * 出库审核查看（与后端 OutboundAuditDetailVo 对齐）
 */
export interface OutboundAuditDetail {
  billCode: string
  warehouseCode?: string
  auditStatus: number
  auditStatusDesc: string
  businessType: number
  businessTypeDesc: string
  initiatorName?: string
  operationTime?: string
  auditorName?: string
  auditTime?: string
  productLines: OutboundAuditProductLine[]
  operationLogs: OutboundAuditOperationLog[]
}

/**
 * 审核拒绝请求体（与后端 OutboundAuditRejectRequest 对齐）
 */
export interface OutboundAuditRejectRequest {
  billCode: string
  remark: string
}
