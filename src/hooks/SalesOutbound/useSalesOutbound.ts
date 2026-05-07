import { ref } from 'vue'
import type {
  SalesOutboundAddRequestBody,
  SalesOutboundDetailDto,
  SalesOutboundDto,
  SalesOutboundQuery,
  SalesOutboundUpdateRequestBody,
  SalesOutboundVO,
} from '@/type/salesOutbound'
import {
  addSalesOutboundApi,
  deleteSalesOutboundApi,
  querySalesOutboundListApi,
  submitSalesOutboundApi,
  updateSalesOutboundApi,
} from '@/api/product/salesOutbound'

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

function mapOutboundRow(row: Record<string, unknown>): SalesOutboundVO {
  return {
    outboundCode: String(row.salesOutboundCode ?? ''),
    warehouseCode: String(row.warehouseCode ?? ''),
    warehouseName: String(row.warehouseName ?? ''),
    customerCode: String(row.customerCode ?? ''),
    customerName: String(row.customerName ?? ''),
    productKindAmount: Number(row.productKindCount ?? row.productKindAmount ?? 0),
    settlementTotalAmount: Number(row.salesTotalAmount ?? row.settlementTotalAmount ?? 0),
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

export function useSalesOutbound() {
  const list = ref<SalesOutboundVO[]>([])
  const total = ref(0)
  const query = ref<SalesOutboundQuery>(createDefaultQuery())

  const fetchList = async () => {
    const res = await querySalesOutboundListApi(query.value)
    const { list: rawList, total: t } = unwrapPage<Record<string, unknown>>(res)
    list.value = rawList.map(mapOutboundRow)
    total.value = t
  }

  const resetQuery = () => {
    query.value = createDefaultQuery()
  }

  const createSalesOutbound = async (dto: SalesOutboundDto) => {
    await addSalesOutboundApi(mapDtoToAddBody(dto))
    await fetchList()
  }

  const editSalesOutbound = async (dto: SalesOutboundDto) => {
    if (!dto.outboundCode) {
      throw new Error('缺少销售出库单号')
    }
    await updateSalesOutboundApi(mapDtoToUpdateBody(dto))
    await fetchList()
  }

  const submitSalesOutbound = async (outboundCode: string) => {
    await submitSalesOutboundApi(outboundCode)
    await fetchList()
  }

  const deleteSalesOutbound = async (outboundCode: string) => {
    await deleteSalesOutboundApi(outboundCode)
    await fetchList()
  }

  return {
    list,
    total,
    query,
    fetchList,
    resetQuery,
    createSalesOutbound,
    editSalesOutbound,
    submitSalesOutbound,
    deleteSalesOutbound,
  }
}

function mapDtoToAddBody(dto: SalesOutboundDto): SalesOutboundAddRequestBody {
  const warehouseCode = dto.warehouseCode?.trim() ?? ''
  const customerCode = dto.customerCode?.trim() ?? ''
  const lines = (dto.details ?? []).map((row: SalesOutboundDetailDto, idx) => ({
    productCode: String(row.productCode ?? '').trim(),
    outboundQuantity: Number(row.outboundQuantity),
    actualSalePrice: Number(row.actualPrice),
    lineNo: idx + 1,
  }))
  return { warehouseCode, customerCode, lines }
}

function mapDtoToUpdateBody(dto: SalesOutboundDto): SalesOutboundUpdateRequestBody {
  const salesOutboundCode = dto.outboundCode?.trim() ?? ''
  const warehouseCode = dto.warehouseCode?.trim() ?? ''
  const customerCode = dto.customerCode?.trim() ?? ''
  const salesOutboundDetailList = (dto.details ?? []).map((row: SalesOutboundDetailDto, idx) => ({
    productCode: String(row.productCode ?? '').trim(),
    outboundQuantity: Number(row.outboundQuantity),
    actualSalePrice: Number(row.actualPrice),
    lineNo: idx + 1,
  }))
  return { salesOutboundCode, warehouseCode, customerCode, salesOutboundDetailList }
}

function createDefaultQuery(): SalesOutboundQuery {
  return {
    pageNum: 1,
    pageSize: 10,
    outboundCode: undefined,
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
