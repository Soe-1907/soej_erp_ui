/**
 * 库存分布列表查询参数（与后端 InventoryDistributionQueryDto 对齐）
 */
export interface InventoryDistributionQuery {
  /** 商品编号/名称模糊关键字 */
  keyword?: string

  /** 商品分类名称（精确） */
  categoryName?: string

  /** 商品品牌名称（精确） */
  brandName?: string

  /** 当前页码 */
  pageNum?: number

  /** 每页大小 */
  pageSize?: number
}

/**
 * 库存分布列表行（与 InventoryDistributionListVo 对齐）
 */
export interface InventoryDistributionVO {
  productCode: string
  imageUrl?: string
  productName: string
  categoryName: string
  brandName: string
  uomName: string
}

/**
 * 「查看仓库」表格使用的行模型（前端拼装，含合计行）
 */
export interface InventoryWarehouseVO {
  /** 仓库编号；合计行为 "合计" */
  warehouseCode: string
  /** 仓库名称；合计行为 "合计" */
  warehouseName: string
  actualQuantity: number
  availableQuantity: number
}

/**
 * 后端 detail 接口返回的明细行（与 InventoryDistributionDetailLineVo 对齐）
 */
export interface InventoryDistributionDetailLineVo {
  lineNo?: number
  warehouseCode: string
  warehouseName: string
  actualQuantity: number
  availableQuantity: number
}

/**
 * 后端 detail 接口返回结构（与 InventoryDistributionDetailVo 对齐）
 */
export interface InventoryDistributionDetailVo {
  productCode: string
  lines: InventoryDistributionDetailLineVo[]
  totalActualQuantity: number
  totalAvailableQuantity: number
}

/**
 * 分类/品牌筛选项（与 InventoryDistributionFilterOptionsVo 对齐）
 */
export interface InventoryDistributionFilterOptionsVo {
  categories: string[]
  brands: string[]
}
