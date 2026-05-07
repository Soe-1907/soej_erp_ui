/**
 * 入库审核业务类型枚举（与后端 AuditBusinessTypeEnum 一致：1-3）
 */
export const INBOUND_BUSINESS_TYPES = [
  { value: 1, label: '采购入库' },
  { value: 2, label: '销售退货' },
  { value: 3, label: '调拨入库' },
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
 * 入库审核分页查询条件（与后端 InboundAuditQueryDto 对齐）
 */
export interface InboundAuditQuery {
  /** 单据号（模糊） */
  billCodeKeyword?: string
  /** 仓库编号或名称（模糊）；专员侧后端会忽略 */
  warehouseKeyword?: string
  /** 业务类型：1 采购入库 2 销售退货 3 调拨入库 */
  businessType?: number
  /** 审核状态：1 待审核 2 审核通过 3 审核拒绝 */
  auditStatus?: number
  /** 发起人用户名（模糊） */
  initiatorNameKeyword?: string
  /** 审核人用户名（模糊） */
  auditorNameKeyword?: string
  operationTimeStart?: string
  operationTimeEnd?: string
  auditTimeStart?: string
  auditTimeEnd?: string
  pageNum?: number
  pageSize?: number
}

/**
 * 入库审核分页列表行（与后端 InboundAuditListVo 对齐）
 */
export interface InboundAuditListItem {
  billCode: string
  warehouseCode: string
  warehouseName: string
  /** 业务类型编码：1/2/3 */
  businessType: number
  /** 业务类型描述 */
  businessTypeDesc: string
  /** 商品中类数（明细商品涉及的去重分类数） */
  categoryKindCount: number
  /** 审核状态：1/2/3 */
  auditStatus: number
  /** 审核状态描述 */
  auditStatusDesc: string
  initiatorName: string
  operationTime?: string
  auditorName?: string
  auditTime?: string
}

/**
 * 入库审核明细商品行（与后端 InboundAuditProductLineVo 对齐）
 */
export interface InboundAuditProductLine {
  rowNo?: number
  productCode: string
  productName: string
  categoryName: string
  brandName: string
  inboundQuantity: number
  uomName: string
  /** 行备注（调拨入库等） */
  lineRemark?: string
}

/**
 * 入库审核操作记录（与后端 InboundAuditOperationLogVo 对齐）
 */
export interface InboundAuditOperationLog {
  operationTime?: string
  operatorName?: string
  /** 操作类型：1/2/3 */
  operationType?: number
  operationTypeDesc?: string
  /** 备注/审核拒绝原因 */
  remark?: string
}

/**
 * 入库审核查看（与后端 InboundAuditDetailVo 对齐）
 */
export interface InboundAuditDetail {
  billCode: string
  auditStatus: number
  auditStatusDesc: string
  businessType: number
  businessTypeDesc: string
  initiatorName?: string
  operationTime?: string
  auditorName?: string
  auditTime?: string
  productLines: InboundAuditProductLine[]
  operationLogs: InboundAuditOperationLog[]
}

/**
 * 审核拒绝请求体（与后端 InboundAuditRejectRequest 对齐）
 */
export interface InboundAuditRejectRequest {
  billCode: string
  remark: string
}
