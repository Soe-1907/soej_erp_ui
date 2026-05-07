import request from '@/utils/request'
import type { PageResult } from '@/type/page'
import type {
  InboundAuditDetail,
  InboundAuditListItem,
  InboundAuditQuery,
  InboundAuditRejectRequest,
} from '@/type/inventoryAudit'

/** 入库审核分页列表（仓库范围由后端按登录用户角色解析） */
export const queryInboundAuditListApi = (params: InboundAuditQuery) => {
  return request.get<PageResult<InboundAuditListItem>>('/inventory/inbound-audit', { params })
}

/** 入库审核查看（一次返回 header + productLines + operationLogs） */
export const getInboundAuditDetailApi = (billCode: string) => {
  return request.get<InboundAuditDetail>('/inventory/inbound-audit/detail', {
    params: { billCode },
  })
}

/** 入库审核通过 */
export const approveInboundAuditApi = (billCode: string) => {
  return request.put('/inventory/inbound-audit/approve', null, {
    params: { billCode },
  })
}

/** 入库审核拒绝（body：billCode + remark） */
export const rejectInboundAuditApi = (body: InboundAuditRejectRequest) => {
  return request.put('/inventory/inbound-audit/reject', body)
}
