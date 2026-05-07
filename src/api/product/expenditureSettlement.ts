import request from '@/utils/request'
import type { ExpenditureSettlementQuery, ExpenditureSettlementVO } from '@/type/expenditureSettlement'
import type { PurchaseReceiveDetailViewVO } from '@/type/purchaseReceive'

export const queryExpenditureSettlementListApi = (params: ExpenditureSettlementQuery) => {
  return request.get('/expenditure-settlement', { params })
}

export const getExpenditureSettlementByCodeApi = (expenditureSettlementCode: string) => {
  return request.get<ExpenditureSettlementVO>(
    `/expenditure-settlement/${encodeURIComponent(expenditureSettlementCode)}`
  )
}

/**
 * 支出结算关联业务单据详情（采购入库/销售退货），结算角色只读，不走采购 assertViewScope
 * 后端：GET /api/expenditure-settlement/{expenditureSettlementCode}/related-bill
 */
export const getExpenditureSettlementRelatedBillApi = (expenditureSettlementCode: string) => {
  return request.get<PurchaseReceiveDetailViewVO>(
    `/expenditure-settlement/${encodeURIComponent(expenditureSettlementCode)}/related-bill`
  )
}
