import request from '@/utils/request'
import type { PageResult } from '@/type/page'
import type {
  OutboundAuditDetail,
  OutboundAuditListItem,
  OutboundAuditQuery,
  OutboundAuditRejectRequest,
} from '@/type/inventoryVerification'

/** 出库审核分页列表（仓库范围由后端按登录用户角色解析） */
export const queryOutboundAuditListApi = (params: OutboundAuditQuery) => {
  return request.get<PageResult<OutboundAuditListItem>>('/inventory/outbound-audit', { params })
}

/** 出库审核查看（一次返回 header + productLines + operationLogs） */
export const getOutboundAuditDetailApi = (billCode: string) => {
  return request.get<OutboundAuditDetail>('/inventory/outbound-audit/detail', {
    params: { billCode },
  })
}

/** 出库审核通过 */
export const approveOutboundAuditApi = (billCode: string) => {
  return request.put('/inventory/outbound-audit/approve', null, {
    params: { billCode },
  })
}

/** 出库审核拒绝（body：billCode + remark） */
export const rejectOutboundAuditApi = (body: OutboundAuditRejectRequest) => {
  return request.put('/inventory/outbound-audit/reject', body)
}
