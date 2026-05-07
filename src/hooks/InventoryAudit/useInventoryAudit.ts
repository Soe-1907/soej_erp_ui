import { ref } from 'vue'
import type {
  InboundAuditDetail,
  InboundAuditListItem,
  InboundAuditOperationLog,
  InboundAuditProductLine,
  InboundAuditQuery,
} from '@/type/inventoryAudit'
import {
  approveInboundAuditApi,
  getInboundAuditDetailApi,
  queryInboundAuditListApi,
  rejectInboundAuditApi,
} from '@/api/product/inventoryAudit'

export function useInventoryAudit() {
  const list = ref<InboundAuditListItem[]>([])
  const total = ref(0)
  const query = ref<InboundAuditQuery>(createDefaultQuery())
  const currentHeader = ref<InboundAuditDetail | null>(null)
  const detailList = ref<InboundAuditProductLine[]>([])
  const recordList = ref<InboundAuditOperationLog[]>([])

  const fetchList = async () => {
    const res = (await queryInboundAuditListApi(query.value)) as {
      data: { list: InboundAuditListItem[]; total: number }
    }
    list.value = res.data?.list ?? []
    total.value = res.data?.total ?? 0
  }

  const fetchDocument = async (billCode: string) => {
    const res = (await getInboundAuditDetailApi(billCode)) as { data: InboundAuditDetail }
    const detail = res.data ?? null
    currentHeader.value = detail
    detailList.value = detail?.productLines ?? []
    recordList.value = detail?.operationLogs ?? []
  }

  const approveDocument = async (billCode: string) => {
    await approveInboundAuditApi(billCode)
    await fetchList()
  }

  const rejectDocument = async (billCode: string, remark: string) => {
    await rejectInboundAuditApi({ billCode, remark })
    await fetchList()
  }

  const resetQuery = () => {
    query.value = createDefaultQuery()
  }

  return {
    list,
    total,
    query,
    currentHeader,
    detailList,
    recordList,
    fetchList,
    fetchDocument,
    approveDocument,
    rejectDocument,
    resetQuery,
  }
}

function createDefaultQuery(): InboundAuditQuery {
  return {
    pageNum: 1,
    pageSize: 10,
    billCodeKeyword: undefined,
    warehouseKeyword: undefined,
    businessType: undefined,
    auditStatus: undefined,
    initiatorNameKeyword: undefined,
    auditorNameKeyword: undefined,
    operationTimeStart: undefined,
    operationTimeEnd: undefined,
    auditTimeStart: undefined,
    auditTimeEnd: undefined,
  }
}
