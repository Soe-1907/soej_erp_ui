import request from '@/utils/request'
import type { IncomeSettlementQuery, IncomeSettlementVO } from '@/type/incomeSettlement'

export const queryIncomeSettlementListApi = (params: IncomeSettlementQuery) => {
  return request.get('/income-settlement', { params })
}

export const getIncomeSettlementByCodeApi = (incomeSettlementCode: string) => {
  return request.get<IncomeSettlementVO>(
    `/income-settlement/${encodeURIComponent(incomeSettlementCode)}`
  )
}
