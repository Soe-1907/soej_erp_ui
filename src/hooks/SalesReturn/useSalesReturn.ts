import { ref } from 'vue'
import type {
  SalesReturnAddRequestBody,
  SalesReturnDetailDto,
  SalesReturnDto,
  SalesReturnQuery,
  SalesReturnUpdateRequestBody,
  SalesReturnVO,
} from '@/type/salesReturn'
import {
  addSalesReturnApi,
  deleteSalesReturnApi,
  querySalesReturnListApi,
  submitSalesReturnApi,
  updateSalesReturnApi,
} from '@/api/product/salesReturn'

function unwrapPage<T>(res: unknown): { list: T[]; total: number } {
  const data = (res as { data?: { list?: T[]; total?: number } })?.data
  if (!data || typeof data !== 'object') return { list: [], total: 0 }
  const list = Array.isArray(data.list) ? data.list : []
  const total = typeof data.total === 'number' ? data.total : Number(data.total ?? 0)
  return { list, total }
}

function mapAuditStatusLabel(auditStatus: number, auditStatusDesc: string): string {
  if (auditStatus === 2) return '已完成'
  return auditStatusDesc || ''
}

function mapReturnRow(row: Record<string, unknown>): SalesReturnVO {
  return {
    returnCode: String(row.salesReturnCode ?? ''),
    salesOutboundCode: String(row.refSalesOutboundCode ?? row.salesOutboundCode ?? ''),
    warehouseCode: String(row.warehouseCode ?? ''),
    warehouseName: String(row.warehouseName ?? ''),
    customerCode: String(row.customerCode ?? ''),
    customerName: String(row.customerName ?? ''),
    returnKindAmount: Number(row.productKindCount ?? row.returnKindAmount ?? 0),
    returnTotalAmount: Number(row.returnTotalAmount ?? 0),
    auditStatus: Number(row.auditStatus ?? 0),
    auditStatusName: mapAuditStatusLabel(
      Number(row.auditStatus ?? 0),
      String(row.auditStatusDesc ?? row.auditStatusName ?? '')
    ),
    initiator: String(row.initiatorName ?? row.initiator ?? ''),
    operationTime: row.operationTime != null ? String(row.operationTime) : '',
    auditor: row.auditorName != null ? String(row.auditorName) : '',
    auditTime: row.auditTime != null ? String(row.auditTime) : '',
  }
}

function mapDtoToAddBody(dto: SalesReturnDto): SalesReturnAddRequestBody {
  const refSalesOutboundCode = dto.salesOutboundCode?.trim() ?? ''
  const salesReturnDetails = (dto.details ?? []).map((row: SalesReturnDetailDto) => ({
    productCode: String(row.productCode ?? '').trim(),
    returnQuantity: Number(row.returnQuantity),
  }))
  return { refSalesOutboundCode, salesReturnDetails }
}

function mapDtoToUpdateBody(dto: SalesReturnDto): SalesReturnUpdateRequestBody {
  const salesReturnCode = dto.returnCode?.trim() ?? ''
  const refSalesOutboundCode = dto.salesOutboundCode?.trim() ?? ''
  const salesReturnDetails = (dto.details ?? []).map((row: SalesReturnDetailDto) => ({
    productCode: String(row.productCode ?? '').trim(),
    returnQuantity: Number(row.returnQuantity),
  }))
  return { salesReturnCode, refSalesOutboundCode, salesReturnDetails }
}

export function useSalesReturn() {
  const list = ref<SalesReturnVO[]>([])
  const total = ref(0)
  const query = ref<SalesReturnQuery>(createDefaultQuery())

  const fetchList = async () => {
    const res = await querySalesReturnListApi(query.value)
    const { list: rawList, total: t } = unwrapPage<Record<string, unknown>>(res)
    list.value = rawList.map(mapReturnRow)
    total.value = t
  }

  const resetQuery = () => {
    query.value = createDefaultQuery()
  }

  const createSalesReturn = async (dto: SalesReturnDto) => {
    await addSalesReturnApi(mapDtoToAddBody(dto))
    await fetchList()
  }

  const editSalesReturn = async (dto: SalesReturnDto) => {
    if (!dto.returnCode) {
      throw new Error('缺少销售退货单号')
    }
    await updateSalesReturnApi(mapDtoToUpdateBody(dto))
    await fetchList()
  }

  const submitSalesReturn = async (returnCode: string) => {
    await submitSalesReturnApi(returnCode)
    await fetchList()
  }

  const deleteSalesReturn = async (returnCode: string) => {
    await deleteSalesReturnApi(returnCode)
    await fetchList()
  }

  return {
    list,
    total,
    query,
    fetchList,
    resetQuery,
    createSalesReturn,
    editSalesReturn,
    submitSalesReturn,
    deleteSalesReturn,
  }
}

function createDefaultQuery(): SalesReturnQuery {
  return {
    pageNum: 1,
    pageSize: 10,
    returnCode: undefined,
    salesOutboundCode: undefined,
    warehouseKeyword: undefined,
    customerKeyword: undefined,
    auditStatus: undefined,
    initiator: undefined,
    auditor: undefined,
    operationTimeStart: undefined,
    operationTimeEnd: undefined,
    auditTimeStart: undefined,
    auditTimeEnd: undefined,
  }
}
