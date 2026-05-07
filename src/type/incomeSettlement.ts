export interface IncomeSettlementQuery {
  incomeSettlementCode?: string
  bizType?: number
  pageNum?: number
  pageSize?: number
}

/** 与后端 IncomeSettlementVo 对齐；异常数据时 bizType/sourceType 可能为空 */
export interface IncomeSettlementVO {
  incomeSettlementId?: number
  incomeSettlementCode: string
  bizType?: number | null
  bizTypeName?: string
  amount?: number
  relatedBillCode?: string
  sourceType?: number | null
  createTime?: string
}
