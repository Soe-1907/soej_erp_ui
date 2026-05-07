import { ref } from 'vue'
import type { PurchaseReceiveDto, PurchaseReceiveQuery, PurchaseReceiveVO } from '@/type/purchaseReceive'
import {
  addPurchaseReceiveApi,
  deletePurchaseReceiveApi,
  queryPurchaseReceiveListApi,
  submitPurchaseReceiveApi,
  updatePurchaseReceiveDetailListApi,
  buildPurchaseReceiveDetailListPayload,
} from '@/api/product/purchaseReceive'

function unwrapPage<T>(res: unknown): { list: T[]; total: number } {
  const data = (res as { data?: { list?: T[]; total?: number } })?.data
  if (!data || typeof data !== 'object') return { list: [], total: 0 }
  const list = Array.isArray(data.list) ? data.list : []
  const total = typeof data.total === 'number' ? data.total : Number(data.total ?? 0)
  return { list, total }
}

function mapReceiveRow(row: Record<string, unknown>): PurchaseReceiveVO {
  return {
    purchaseReceiveCode: String(row.purchaseReceiveCode ?? ''),
    warehouseCode: String(row.warehouseCode ?? ''),
    warehouseName: String(row.warehouseName ?? ''),
    supplierCode: String(row.supplierCode ?? ''),
    supplierName: String(row.supplierName ?? ''),
    purchaseKindAmount: Number(row.productKindCount ?? row.purchaseKindAmount ?? 0),
    purchaseAmount: Number(row.purchaseTotalAmount ?? row.purchaseAmount ?? 0),
    auditStatus: Number(row.auditStatus ?? 0),
    auditStatusName: String(row.auditStatusDesc ?? row.auditStatusName ?? ''),
    initiator: String(row.initiatorName ?? row.initiator ?? ''),
    operationTime: row.operationTime != null ? String(row.operationTime) : '',
    auditor: row.auditorName != null ? String(row.auditorName) : '',
    auditTime: row.auditTime != null ? String(row.auditTime) : '',
  }
}

export function usePurchaseReceive() {
  const list = ref<PurchaseReceiveVO[]>([])
  const total = ref(0)
  const query = ref<PurchaseReceiveQuery>({
    pageNum: 1,
    pageSize: 10,
    purchaseReceiveCode: undefined,
    warehouseKeyword: undefined,
    supplierKeyword: undefined,
    auditStatus: undefined,
    initiator: undefined,
    auditor: undefined,
    operationTimeStart: undefined,
    operationTimeEnd: undefined,
    auditTimeStart: undefined,
    auditTimeEnd: undefined,
  })

  const fetchList = async () => {
    const res = await queryPurchaseReceiveListApi(query.value)
    const { list: rawList, total: t } = unwrapPage<Record<string, unknown>>(res)
    list.value = rawList.map(mapReceiveRow)
    total.value = t
  }

  const resetQuery = () => {
    query.value = {
      pageNum: 1,
      pageSize: 10,
      purchaseReceiveCode: undefined,
      warehouseKeyword: undefined,
      supplierKeyword: undefined,
      auditStatus: undefined,
      initiator: undefined,
      auditor: undefined,
      operationTimeStart: undefined,
      operationTimeEnd: undefined,
      auditTimeStart: undefined,
      auditTimeEnd: undefined,
    }
    return fetchList()
  }

  const createPurchaseReceive = async (dto: PurchaseReceiveDto) => {
    await addPurchaseReceiveApi(dto)
    await fetchList()
  }

  const editPurchaseReceive = async (dto: PurchaseReceiveDto) => {
    if (!dto.purchaseReceiveCode) {
      throw new Error('缺少采购入库单号')
    }
    await updatePurchaseReceiveDetailListApi(buildPurchaseReceiveDetailListPayload(dto))
    await fetchList()
  }

  const submitPurchaseReceive = async (purchaseReceiveCode: string) => {
    await submitPurchaseReceiveApi(purchaseReceiveCode)
    await fetchList()
  }

  const deletePurchaseReceive = async (purchaseReceiveCode: string) => {
    await deletePurchaseReceiveApi(purchaseReceiveCode)
    await fetchList()
  }

  return {
    list,
    total,
    query,
    fetchList,
    resetQuery,
    createPurchaseReceive,
    editPurchaseReceive,
    submitPurchaseReceive,
    deletePurchaseReceive,
  }
}
