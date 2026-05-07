import { ref } from 'vue'
import type { ExpenditureSettlementQuery, ExpenditureSettlementVO } from '@/type/expenditureSettlement'
import {
  getExpenditureSettlementByCodeApi,
  queryExpenditureSettlementListApi,
} from '@/api/product/expenditureSettlement'

function unwrapPage<T>(res: unknown): { list: T[]; total: number } {
  const data = (res as { data?: { list?: T[]; total?: number } })?.data
  if (!data || typeof data !== 'object') return { list: [], total: 0 }
  const list = Array.isArray(data.list) ? data.list : []
  const total = typeof data.total === 'number' ? data.total : Number(data.total ?? 0)
  return { list, total }
}

function normalizeListQuery(q: ExpenditureSettlementQuery): ExpenditureSettlementQuery {
  const next: ExpenditureSettlementQuery = { ...q }
  if (typeof next.expenditureSettlementCode === 'string') {
    const t = next.expenditureSettlementCode.trim()
    next.expenditureSettlementCode = t || undefined
  }
  return next
}

export function useExpenditureSettlement() {
  const list = ref<ExpenditureSettlementVO[]>([])
  const total = ref(0)
  const query = ref<ExpenditureSettlementQuery>(createDefaultQuery())

  const fetchList = async () => {
    const res = await queryExpenditureSettlementListApi(normalizeListQuery(query.value))
    const { list: rows, total: t } = unwrapPage<ExpenditureSettlementVO>(res)
    list.value = rows
    total.value = t
  }

  const resetQuery = () => {
    query.value = createDefaultQuery()
  }

  const getExpenditureSettlement = async (expenditureSettlementCode: string) => {
    const code = expenditureSettlementCode.trim()
    const res = (await getExpenditureSettlementByCodeApi(code)) as { data?: ExpenditureSettlementVO }
    return res.data
  }

  return {
    list,
    total,
    query,
    fetchList,
    resetQuery,
    getExpenditureSettlement,
  }
}

function createDefaultQuery(): ExpenditureSettlementQuery {
  return {
    pageNum: 1,
    pageSize: 10,
    expenditureSettlementCode: undefined,
    bizType: undefined,
  }
}
