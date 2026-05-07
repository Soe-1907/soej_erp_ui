/**
 * 商品单位 VO
 */
export interface UomVO {
  /** 单位ID */
  uomId: number;
  /** 单位名称 */
  uomName: string;
  /** 单位状态 0-禁用 1-启用 */
  status: number;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/**
 * 商品单位查询参数
 * 对应后端：UomQueryDto
 */
export interface UomQuery {
  /** 单位名称（模糊查询） */
  uomName?: string

  /** 单位状态 */
  status?: number | undefined

  /** 当前页码 */
  pageNum?: number

  /** 每页大小 */
  pageSize?: number

}

/**
 * 商品单位 DTO
 */
export interface UomDto {
  /** 单位ID，使用自增方式 */
  uomId?: number | undefined;
  
  /**
   * 单位名称（必填；长度不超过 16；允许汉字、英文、数字、特殊符号，以后端校验为准）
   */
  uomName?: string;
  
  /** 
   * 单位状态：1启用，0禁用
   * @example 1
   */
  status?: number | undefined;
  
  /** 
   * 创建时间，ISO 8601 格式
   * @example "2023-01-01T12:00:00"
   */
  createdAt?: string;
  
  /** 
   * 更新时间，ISO 8601 格式
   * @example "2023-01-01T12:00:00"
   */
  updatedAt?: string;
}

