/**
 * 商品品牌 VO
 */
export interface BrandVO {
  /** 品牌ID */
  brandId: number;
  /** 品牌名称 */
  brandName: string;
  /** 品牌状态 0-禁用 1-启用 */
  status: number;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/**
 * 商品品牌查询参数
 * 对应后端：BrandQueryDto
 */
export interface BrandQuery {
  /** 品牌名称（模糊查询） */
  brandName?: string

  /** 品牌状态 */
  status?: number | undefined

  /** 当前页码 */
  pageNum: number

  /** 每页大小 */
  pageSize: number

}
export interface BrandDto {
  /** 品牌ID，使用自增方式 */
  brandId?: number | undefined;
  
  /** 
   * 品牌名称，必填，仅支持中英文，2-16个字符
   * 验证规则：
   * - 不能为空
   * - 长度：2-16个字符
   * - 格式：只能包含中英文字符
   */
  brandName?: string;
  
  /** 
   * 品牌状态：1启用，0禁用
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