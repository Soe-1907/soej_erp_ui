/** 商品表单用启用主数据下拉（对应后端 MasterDataOptionVo） */
export interface MasterDataOptionVO {
  id: number
  name: string
}

/**
 * 商品 VO
 * 对应后端：ProductVo
 */
export interface ProductVO {
    /** 商品ID */
    productId: number
  
    /** 商品编号 */
    productCode: string
  
    /** 商品名称 */
    productName: string
  
    /** 分类ID */
    categoryId: number
  
    /** 分类名称 */
    categoryName: string
  
    /** 品牌ID */
    brandId: number
  
    /** 品牌名称 */
    brandName: string
  
    /** 单位ID */
    uomId: number
  
    /** 单位名称 */
    uomName: string
  
    /** 建议采购价格 */
    suggestPurchasePrice: number
  
    /** 建议销售价格 */
    suggestSalePrice: number
  
    /** 商品图片 URL */
    imageUrl: string
  
    /** 商品状态：1 启用，0 禁用 */
    status: number
  
    /** 创建时间（ISO 字符串） */
    createdAt: string
  
    /** 更新时间（ISO 字符串） */
    updatedAt: string
  }
  
  /**
   * 商品查询参数
   * 对应后端：ProductQueryDto
   */
  export interface ProductQuery {
    /** 商品编号或名称（模糊查询） */
    keyword?: string
  
    /** 商品分类ID */
    categoryId?: number
  
    /** 商品品牌ID */
    brandId?: number
  
    /** 商品状态：1 启用，0 禁用 */
    status?: number
  
    /** 创建开始日期（yyyy-MM-dd HH:mm:ss） */
    createdStartDate?: string
  
    /** 创建结束日期（yyyy-MM-dd HH:mm:ss） */
    createdEndDate?: string
  
    /** 修改开始日期（yyyy-MM-dd HH:mm:ss） */
    updatedStartDate?: string
  
    /** 修改结束日期（yyyy-MM-dd HH:mm:ss） */
    updatedEndDate?: string
  
    /** 当前页码 */
    pageNum?: number
  
    /** 每页大小 */
    pageSize?: number
  }
  
  /**
   * 商品 DTO
   * 对应后端：ProductDto
   *
   * 说明：
   * - 新增（AddGroup）：不传 productId
   * - 修改（UpdateGroup）：必须传 productId
   */
  export interface ProductDto {
    /** 商品ID（修改时必填） */
    productId?: number | undefined
  
    /** 商品编号 */
    productCode?: string
  
    /**
     * 商品名称
     * 规则：
     * - 新增必填
     * - 长度 2-100 字符
     */
    productName?: string
  
    /** 商品分类ID（新增必填） */
    categoryId?: number | undefined
  
    /** 商品品牌ID（新增必填） */
    brandId?: number | undefined
  
    /** 商品单位ID（新增必填） */
    uomId?: number | undefined
  
    /**
     * 建议采购价格
     * - 大于 0
     * - 最多 8 位整数 + 2 位小数
     */
    suggestPurchasePrice?: number | undefined
  
    /**
     * 建议销售价格
     * - 大于 0
     * - 最多 8 位整数 + 2 位小数
     */
    suggestSalePrice?: number | undefined
  
    /** 商品图片 URL */
    imageUrl?: string
  
    /** 商品状态：1 启用，0 禁用 */
    status?: number | undefined
  
    /** 创建时间（后端维护，前端一般不传） */
    createdAt?: string
  
    /** 更新时间（后端维护，前端一般不传） */
    updatedAt?: string
  }
  