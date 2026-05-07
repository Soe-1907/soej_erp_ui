/**
 * 通用 API 响应结构
 */
export interface ApiResponse<T> {
    code: string;
    message: string;
    data: T;
  }
  
  