export interface SalesReturnQuery {
  returnCode?: string
  salesOutboundCode?: string
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

export interface SalesReturnVO {
  returnCode: string
  salesOutboundCode: string
  warehouseCode: string
  warehouseName: string
  customerCode: string
  customerName: string
  returnKindAmount: number
  returnTotalAmount: number
  auditStatus: number
  auditStatusName: string
  initiator: string
  operationTime: string
  auditor?: string
  auditTime?: string
}

export interface SalesReturnDetailDto {
  detailId?: number
  lineNo?: number
  salesOutboundCode?: string
  outboundDetailId?: number
  productCode?: string
  productName?: string
  categoryName?: string
  brandName?: string
  uomName?: string
  outboundQuantity?: number | string
  actualPrice?: number | string
  settlementAmount?: number | string
  returnQuantity?: number | string
  returnableQuantity?: number | string
  returnItemAmount?: number | string
}

export interface SalesReturnDetailVO extends SalesReturnDetailDto {
  detailId?: number
  returnCode?: string
}

export interface SalesReturnDto {
  returnCode?: string
  salesOutboundCode?: string
  warehouseCode?: string
  warehouseName?: string
  customerCode?: string
  customerName?: string
  returnKindAmount?: number
  returnTotalAmount?: number | string
  initiator?: string
  operationTime?: string
  remark?: string
  details?: SalesReturnDetailDto[]
}

/** POST：服务端只校验 productCode、returnQuantity */
export interface SalesReturnDetailSubmitLine {
  productCode: string
  returnQuantity: number
}

export interface SalesReturnAddRequestBody {
  refSalesOutboundCode: string
  salesReturnDetails: SalesReturnDetailSubmitLine[]
}

export interface SalesReturnUpdateRequestBody {
  salesReturnCode: string
  refSalesOutboundCode: string
  salesReturnDetails: SalesReturnDetailSubmitLine[]
}

export interface SalesReturnPrefillLineVO {
  lineNo?: number
  productCode: string
  productName?: string
  categoryName?: string
  brandName?: string
  outboundQuantity?: number
  productUnit?: string
  actualSalePrice?: number | string
  lineSettlementAmount?: number | string
  returnableQuantity?: number
}

export interface SalesReturnPrefillVO {
  refSalesOutboundCode: string
  warehouseCode: string
  warehouseName: string
  customerCode: string
  customerName: string
  lines: SalesReturnPrefillLineVO[]
}

export interface SalesReturnDetailLineViewVO {
  lineNo?: number
  detailId?: number
  productCode: string
  productName?: string
  categoryName?: string
  brandName?: string
  outboundQuantity?: number
  uomName?: string
  actualSalePrice?: number | string
  lineSettlementAmount?: number | string
  returnableQuantity?: number
  returnQuantity?: number
  returnAmount?: number | string
}

export interface OutboundAuditOperationLogVO {
  operationTime?: string
  operatorName?: string
  operationType?: number
  operationTypeDesc?: string
  remark?: string
}

export interface SalesReturnDetailViewVO {
  salesReturnCode: string
  refSalesOutboundCode: string
  warehouseName: string
  customerName: string
  auditStatus: number
  auditStatusDesc: string
  initiatorName: string
  auditorName?: string
  operationTime?: string
  auditTime?: string
  remark?: string
  lines: SalesReturnDetailLineViewVO[]
  lineSettlementSum?: number | string
  returnAmountSum?: number | string
  operationLogs?: OutboundAuditOperationLogVO[]
}

export interface SalesReturnRecordVO {
  recordId?: number
  returnCode?: string
  operationTime?: string
  operator?: string
  operationType?: string
  rejectReason?: string
}
