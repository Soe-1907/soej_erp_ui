/**
 * 商品分类 VO
 * 对应后端：CategoryVo
 */
export interface CategoryVO {
    /** 分类ID */
    categoryId: number
  
    /** 分类名称 */
    categoryName: string
  
    /** 分类状态：1 启用，0 禁用 */
    status: number
  
    /** 创建时间（ISO 字符串） */
    createdAt: string
  
    /** 更新时间（ISO 字符串） */
    updatedAt: string
  }
  
  /**
   * 商品分类查询参数
   * 对应后端：CategoryQueryDto
   */
  export interface CategoryQuery {
    /** 分类ID（精确查询，可选） */
    categoryId?: number
  
    /** 分类名称（支持模糊查询） */
    categoryName?: string
  
    /** 分类状态 */
    status?: number | undefined
  
    /** 当前页码 */
    pageNum?: number
  
    /** 每页大小 */
    pageSize?: number
  }
  
  /**
   * 商品分类 DTO
   * 对应后端：CategoryDto
   *
   * 注意：
   * - 新增：不传 categoryId（AddGroup）
   * - 修改：必须传 categoryId（UpdateGroup）
   */
  export interface CategoryDto {
    /** 分类ID（修改时必填） */
    categoryId?: number | undefined
  
    /**
     * 分类名称
     * 规则（后端校验）：
     * - 必填（新增）
     * - 长度：2-16 个字符
     * - 仅支持中英文
     */
    categoryName?: string
  
    /**
     * 分类状态：1 启用，0 禁用
     * @example 1
     */
    status?: number | undefined
  
    /** 创建时间（后端维护，前端一般不传） */
    createdAt?: string
  
    /** 更新时间（后端维护，前端一般不传） */
    updatedAt?: string
  }
  