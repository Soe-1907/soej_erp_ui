import request from '@/utils/request'
import type { IncomeSettlementQuery, IncomeSettlementVO } from '@/type/incomeSettlement'
import type { PurchaseReturnDetailViewVO } from '@/type/purchaseReturn'
import type { SalesOutboundDetailViewVO } from '@/type/salesOutbound'

export const queryIncomeSettlementListApi = (params: IncomeSettlementQuery) => {
  return request.get('/income-settlement', { params })
}

export const getIncomeSettlementByCodeApi = (incomeSettlementCode: string) => {
  return request.get<IncomeSettlementVO>(
    `/income-settlement/${encodeURIComponent(incomeSettlementCode)}`
  )
}

/**
 * 收入结算关联业务单据详情（销售出库 / 采购退货），结算角色只读，不走销售/采购域 assertViewScope
 * 后端：GET /api/income-settlement/{incomeSettlementCode}/related-bill
 */
export const getIncomeSettlementRelatedBillDetailApi = (incomeSettlementCode: string) => {
  return request.get<SalesOutboundDetailViewVO | PurchaseReturnDetailViewVO>(
    `/income-settlement/${encodeURIComponent(incomeSettlementCode)}/related-bill`
  )
}
