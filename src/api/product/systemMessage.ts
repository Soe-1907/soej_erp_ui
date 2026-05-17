import request from '@/utils/request'
import type { SystemMessageVO } from '@/type/systemMessage'

export interface SystemMessageQuery {
  limit?: number
  expanded?: boolean
  pageNum?: number
  pageSize?: number
}

export const querySystemMessagesApi = (params: SystemMessageQuery = {}) => {
  return request.get<SystemMessageVO[]>('/system-messages', { params })
}

export const countSystemMessagesApi = () => {
  return request.get<number>('/system-messages/count')
}

export const markAllSystemMessagesReadApi = () => {
  return request.post<void>('/system-messages/read-all')
}
