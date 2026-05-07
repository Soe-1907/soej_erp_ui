// src/api/common/upload.ts
import request from '@/utils/request'

/**
 * 上传图片
 * 后端：POST /api/upload/image
 * 入参：multipart/form-data，字段名 file
 * 出参：Result<String>（图片 URL）
 */
export const uploadImageApi = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  return request.post<string>('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
