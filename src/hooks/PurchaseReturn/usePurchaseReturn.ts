import { ref } from 'vue'
import type { PurchaseReturnDto, PurchaseReturnQuery, PurchaseReturnVO } from '@/type/purchaseReturn'
import {
  addPurchaseReturnApi,
  deletePurchaseReturnApi,
  queryPurchaseReturnListApi,
  submitPurchaseReturnApi,
  updatePurchaseReturnDetailListApi,
  buildPurchaseReturnDetailListPayload,
} from '@/api/product/purchaseReturn'

function unwrapPage<T>(res: unknown): { list: T[]; total: number } {
  const data = (res as { data?: { list?: T[]; total?: number } })?.data
  if (!data || typeof data !== 'object') return { list: [], total: 0 }
  const list = Array.isArray(data.list) ? data.list : []
  const total = typeof data.total === 'number' ? data.total : Number(data.total ?? 0)
  return { list, total }
}

function mapReturnRow(row: Record<string, unknown>): PurchaseReturnVO {
  return {
    returnCode: String(row.purchaseReturnCode ?? row.returnCode ?? ''),
    purchaseReceiveCode: String(row.refPurchaseReceiveCode ?? row.purchaseReceiveCode ?? ''),
    warehouseCode: String(row.warehouseCode ?? ''),
    warehouseName: String(row.warehouseName ?? ''),
    supplierCode: String(row.supplierCode ?? ''),
    supplierName: String(row.supplierName ?? ''),
    returnKindAmount: Number(row.productKindCount ?? row.returnKindAmount ?? 0),
    returnAmount: Number(row.returnTotalAmount ?? row.returnAmount ?? 0),
    auditStatus: Number(row.auditStatus ?? 0),
    auditStatusName: String(row.auditStatusDesc ?? row.auditStatusName ?? ''),
    initiator: String(row.initiatorName ?? row.initiator ?? ''),
    operationTime: row.operationTime != null ? String(row.operationTime) : '',
    auditor: row.auditorName != null ? String(row.auditorName) : undefined,
    auditTime: row.auditTime != null ? String(row.auditTime) : undefined,
  }
}

export function usePurchaseReturn() {
  const list = ref<PurchaseReturnVO[]>([])
  const total = ref(0)
  const query = ref<PurchaseReturnQuery>(createDefaultQuery())

  const fetchList = async () => {
    const res = await queryPurchaseReturnListApi(query.value)
    const { list: rawList, total: t } = unwrapPage<Record<string, unknown>>(res)
    list.value = rawList.map(mapReturnRow)
    total.value = t
  }

  const resetQuery = () => {
    query.value = createDefaultQuery()
  }

  const createPurchaseReturn = async (dto: PurchaseReturnDto) => {
    await addPurchaseReturnApi(dto)
    await fetchList()
  }

  const editPurchaseReturn = async (dto: PurchaseReturnDto) => {
    if (!dto.returnCode) {
      throw new Error('缺少采购退货单号')
    }
    await updatePurchaseReturnDetailListApi(buildPurchaseReturnDetailListPayload(dto))
    await fetchList()
  }

  const submitPurchaseReturn = async (returnCode: string) => {
    await submitPurchaseReturnApi(returnCode)
    await fetchList()
  }

  const deletePurchaseReturn = async (returnCode: string) => {
    await deletePurchaseReturnApi(returnCode)
    await fetchList()
  }

  return {
    list,
    total,
    query,
    fetchList,
    resetQuery,
    createPurchaseReturn,
    editPurchaseReturn,
    submitPurchaseReturn,
    deletePurchaseReturn,
  }
}

function createDefaultQuery(): PurchaseReturnQuery {
  return {
    pageNum: 1,
    pageSize: 10,
    returnCode: undefined,
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
}
