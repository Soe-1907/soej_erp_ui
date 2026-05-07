/** 列表查询（页面绑定 initiator/auditor/outboundCode，请求时序列化） */
export interface SalesOutboundQuery {
  outboundCode?: string
  warehouseKeyword?: string
  customerKeyword?: string
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

/** 列表行（页面展示用，由后端 SalesOutboundPageVo 映射） */
export interface SalesOutboundVO {
  outboundCode: string
  warehouseCode: string
  warehouseName: string
  customerCode: string
  customerName: string
  productKindAmount: number
  settlementTotalAmount: number
  auditStatus: number
  auditStatusName: string
  initiator: string
  operationTime: string
  auditor?: string
  auditTime?: string
}

/** 明细行（弹窗编辑用） */
export interface SalesOutboundDetailDto {
  detailId?: number
  lineNo?: number
  productCode?: string
  productName?: string
  categoryName?: string
  brandName?: string
  availableQuantity?: number
  uomName?: string
  suggestedPrice?: number | string
  actualPrice?: number | string
  outboundQuantity?: number | string
  settlementAmount?: number | string
}

export interface SalesOutboundDetailVO extends SalesOutboundDetailDto {
  detailId?: number
}

export interface SalesOutboundDto {
  outboundCode?: string
  warehouseCode?: string
  warehouseName?: string
  customerCode?: string
  customerName?: string
  productKindAmount?: number
  settlementTotalAmount?: number | string
  initiator?: string
  operationTime?: string
  remark?: string
  details?: SalesOutboundDetailDto[]
}

/** POST /api/salesOutbound */
export interface SalesOutboundAddRequestBody {
  warehouseCode: string
  customerCode: string
  lines: SalesOutboundAddLineRequest[]
}

export interface SalesOutboundAddLineRequest {
  productCode: string
  outboundQuantity: number
  actualSalePrice: number
  lineNo?: number
}

/** PUT /api/salesOutbound（明细字段与 SalesOutboundDetail 对齐） */
export interface SalesOutboundUpdateRequestBody {
  salesOutboundCode: string
  warehouseCode: string
  customerCode: string
  salesOutboundDetailList: SalesOutboundUpdateDetailLine[]
}

export interface SalesOutboundUpdateDetailLine {
  productCode: string
  outboundQuantity: number
  actualSalePrice: number
  lineNo?: number
}

/** 选品查询 SalesOutboundProductPickerQueryDto */
export interface SalesOutboundProductPickerQuery {
  warehouseCode?: string
  warehouseName?: string
  keyword?: string
  categoryName?: string
  brandName?: string
  pageNum?: number
  pageSize?: number
}

export interface SalesOutboundProductPickerVO {
  productCode: string
  productName: string
  categoryName: string
  brandName: string
  availableQuantity: number
  uomName: string
  suggestSalePrice: number | string
}

export interface InventoryDistributionFilterOptionsVO {
  categories: string[]
  brands: string[]
}

/** GET detail-list 响应 */
export interface SalesOutboundDetailLineViewVO {
  lineNo?: number
  detailId?: number
  productCode: string
  productName?: string
  categoryName?: string
  brandName?: string
  availableQuantity?: number
  outboundQuantity?: number
  uomName?: string
  suggestSalePrice?: number | string
  actualSalePrice?: number | string
  lineSettlementAmount?: number | string
}

export interface OutboundAuditOperationLogVO {
  operationTime?: string
  operatorName?: string
  operationType?: number
  operationTypeDesc?: string
  remark?: string
}

export interface SalesOutboundDetailViewVO {
  salesOutboundCode: string
  warehouseName: string
  customerName: string
  auditStatus: number
  auditStatusDesc: string
  initiatorName: string
  auditorName?: string
  operationTime?: string
  auditTime?: string
  remark?: string
  lines: SalesOutboundDetailLineViewVO[]
  lineAmountTotal?: number | string
  operationLogs?: OutboundAuditOperationLogVO[]
}

export interface SalesOutboundRecordVO {
  recordId?: number
  outboundCode?: string
  operationTime?: string
  operator?: string
  operationType?: string
  rejectReason?: string
}

export interface WarehouseOptionVO {
  warehouseId?: number
  warehouseCode: string
  warehouseName: string
}

export interface CustomerOptionVO {
  customerId?: number
  customerCode: string
  customerName: string
  contactName?: string
  mobile?: string
}
