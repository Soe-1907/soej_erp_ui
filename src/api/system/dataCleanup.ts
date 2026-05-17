import request from '@/utils/request'

export interface DataCleanupConfigVO {
  enabled: boolean
  intervalHours: number
  lastRunAt?: string
  nextRunAt?: string
  lastResult?: string
}

export interface DataCleanupSaveDTO {
  enabled: boolean
  intervalHours: number
}

export interface DataCleanupExecuteDTO {
  confirmText: string
}

export const getDataCleanupConfigApi = () => {
  return request.get<DataCleanupConfigVO>('/system/data-cleanup')
}

export const saveDataCleanupConfigApi = (data: DataCleanupSaveDTO) => {
  return request.put<string>('/system/data-cleanup', data)
}

export const executeDataCleanupApi = (data: DataCleanupExecuteDTO) => {
  return request.post<string>('/system/data-cleanup/execute', data)
}
