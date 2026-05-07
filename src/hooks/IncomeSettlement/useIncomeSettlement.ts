import { ref } from 'vue'
import type { IncomeSettlementQuery, IncomeSettlementVO } from '@/type/incomeSettlement'
import {
  getIncomeSettlementByCodeApi,
  queryIncomeSettlementListApi,
} from '@/api/product/incomeSettlement'

function unwrapPage<T>(res: unknown): { list: T[]; total: number } {
  const data = (res as { data?: { list?: T[]; total?: number } })?.data
  if (!data || typeof data !== 'object') return { list: [], total: 0 }
  const list = Array.isArray(data.list) ? data.list : []
  const total = typeof data.total === 'number' ? data.total : Number(data.total ?? 0)
  return { list, total }
}

function normalizeListQuery(q: IncomeSettlementQuery): IncomeSettlementQuery {
  const next: IncomeSettlementQuery = { ...q }
  if (typeof next.incomeSettlementCode === 'string') {
    const t = next.incomeSettlementCode.trim()
    next.incomeSettlementCode = t || undefined
  }
  return next
}

export function useIncomeSettlement() {
  const list = ref<IncomeSettlementVO[]>([])
  const total = ref(0)
  const query = ref<IncomeSettlementQuery>(createDefaultQuery())

  const fetchList = async () => {
    const res = await queryIncomeSettlementListApi(normalizeListQuery(query.value))
    const { list: rows, total: t } = unwrapPage<IncomeSettlementVO>(res)
    list.value = rows
    total.value = t
  }

  const resetQuery = () => {
    query.value = createDefaultQuery()
  }

  const getIncomeSettlement = async (incomeSettlementCode: string) => {
    const code = incomeSettlementCode.trim()
    const res = (await getIncomeSettlementByCodeApi(code)) as { data?: IncomeSettlementVO }
    return res.data
  }

  return {
    list,
    total,
    query,
    fetchList,
    resetQuery,
    getIncomeSettlement,
  }
}

function createDefaultQuery(): IncomeSettlementQuery {
  return {
    pageNum: 1,
    pageSize: 10,
    incomeSettlementCode: undefined,
    bizType: undefined,
  }
}
