export interface ExpenditureSettlementQuery {
  expenditureSettlementCode?: string
  bizType?: number
  pageNum?: number
  pageSize?: number
}

/** 与后端 ExpenditureSettlementVo 对齐；异常数据时 bizType/sourceType 可能为空 */
export interface ExpenditureSettlementVO {
  expenditureSettlementId?: number
  expenditureSettlementCode: string
  bizType?: number | null
  bizTypeName?: string
  amount?: number
  relatedBillCode?: string
  sourceType?: number | null
  remark?: string
  createTime?: string
}
