import { ref } from 'vue'
import type {
  OutboundAuditDetail,
  OutboundAuditListItem,
  OutboundAuditOperationLog,
  OutboundAuditProductLine,
  OutboundAuditQuery,
} from '@/type/inventoryVerification'
import {
  approveOutboundAuditApi,
  getOutboundAuditDetailApi,
  queryOutboundAuditListApi,
  rejectOutboundAuditApi,
} from '@/api/product/inventoryVerification'

export function useInventoryVerification() {
  const list = ref<OutboundAuditListItem[]>([])
  const total = ref(0)
  const query = ref<OutboundAuditQuery>(createDefaultQuery())
  const currentHeader = ref<OutboundAuditDetail | null>(null)
  const detailList = ref<OutboundAuditProductLine[]>([])
  const recordList = ref<OutboundAuditOperationLog[]>([])

  const fetchList = async () => {
    const res = (await queryOutboundAuditListApi(query.value)) as {
      data: { list: OutboundAuditListItem[]; total: number }
    }
    list.value = res.data?.list ?? []
    total.value = res.data?.total ?? 0
  }

  const fetchDocument = async (billCode: string) => {
    const res = (await getOutboundAuditDetailApi(billCode)) as { data: OutboundAuditDetail }
    const detail = res.data ?? null
    currentHeader.value = detail
    detailList.value = detail?.productLines ?? []
    recordList.value = detail?.operationLogs ?? []
  }

  const approveDocument = async (billCode: string) => {
    await approveOutboundAuditApi(billCode)
    await fetchList()
  }

  const rejectDocument = async (billCode: string, remark: string) => {
    await rejectOutboundAuditApi({ billCode, remark })
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

function createDefaultQuery(): OutboundAuditQuery {
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
