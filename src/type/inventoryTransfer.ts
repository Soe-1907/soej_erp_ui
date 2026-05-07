/**
 * 库存调拨状态（与后端 TransferStatusEnum 一致：1-4）
 */
export const TRANSFER_STATUS_OPTIONS = [
  { value: 1, label: '未调拨' },
  { value: 2, label: '待调拨' },
  { value: 3, label: '已调拨' },
  { value: 4, label: '无法调拨' },
] as const

/** 是否允许修改/提交/删除：未调拨(1)、无法调拨(4) */
export const isTransferEditable = (transferStatus?: number): boolean =>
  transferStatus === 1 || transferStatus === 4

/**
 * 库存调拨单分页查询条件（与后端 InventoryTransferQueryDto 对齐）
 */
export interface InventoryTransferQuery {
  transferCode?: string
  /** 调出仓库编号或名称（模糊） */
  fromWarehouseKeyword?: string
  /** 调入仓库编号或名称（模糊） */
  toWarehouseKeyword?: string
  /** 调拨状态：1 未调拨 2 待调拨 3 已调拨 4 无法调拨 */
  transferStatus?: number
  /** 发起人用户名（模糊） */
  initiatorKeyword?: string
  /** 审核人用户名（模糊） */
  auditorKeyword?: string
  operationTimeStart?: string
  operationTimeEnd?: string
  auditTimeStart?: string
  auditTimeEnd?: string
  pageNum?: number
  pageSize?: number
}

/**
 * 库存调拨分页列表行（与后端 InventoryTransferPageVo 对齐）
 */
export interface InventoryTransferListItem {
  transferCode: string
  fromWarehouseCode: string
  fromWarehouseName: string
  toWarehouseCode: string
  toWarehouseName: string
  transferStatus: number
  transferStatusDesc: string
  initiatorName: string
  operationTime?: string
  /** 审核人展示：调出审核人/调入审核人，缺省为 - */
  auditorsDisplay?: string
  auditTime?: string
}

/**
 * 库存调拨明细行（统一前端模型；
 * - 选品时由 picker 接口带入 availableQuantity
 * - 详情回显时由 availableQtySnapshot 映射至 availableQuantity）
 */
export interface InventoryTransferDetailItem {
  detailId?: number
  lineNo?: number
  productCode?: string
  productName?: string
  categoryName?: string
  brandName?: string
  uomName?: string
  /** 可用库存（picker 实时 / 详情快照 二者择一） */
  availableQuantity?: number
  /** 调出数量（编辑态可为字符串；提交时统一 Number） */
  outQuantity?: number | string
  /** 调入数量（前端联动 = outQuantity） */
  inQuantity?: number
  /** 行备注 */
  lineRemark?: string
}

/**
 * 详情回显（与后端 InventoryTransferDetailViewVo 对齐）
 */
export interface InventoryTransferDetailViewVo {
  transferCode: string
  fromWarehouseCode: string
  fromWarehouseName: string
  toWarehouseCode: string
  toWarehouseName: string
  transferStatus: number
  transferStatusDesc: string
  initiatorId?: number
  initiatorName?: string
  operationTime?: string
  fromWarehouseAuditorId?: number
  toWarehouseAuditorId?: number
  auditorsDisplay?: string
  auditTime?: string
  rejectReason?: string
  currentAuditRound?: number
  outboundBillCode?: string
  inboundBillCode?: string
  lines: InventoryTransferDetailLineVo[]
}

/**
 * 详情明细行（与后端 InventoryTransferDetailLineVo 对齐）
 */
export interface InventoryTransferDetailLineVo {
  detailId: number
  lineNo: number
  productCode: string
  productName: string
  categoryName: string
  brandName: string
  uomName: string
  /** 可用库存快照（提交时调出仓） */
  availableQtySnapshot?: number
  outQuantity: number
  inQuantity: number
  lineRemark?: string
}

/**
 * 新增请求体（与后端 InventoryTransferAddDto 对齐）
 */
export interface InventoryTransferAddRequestBody {
  fromWarehouseCode: string
  toWarehouseCode: string
  lines: InventoryTransferAddLineRequest[]
}

/**
 * 修改请求体（与后端 InventoryTransferUpdateDto 对齐）
 */
export interface InventoryTransferUpdateRequestBody extends InventoryTransferAddRequestBody {
  transferCode: string
}

export interface InventoryTransferAddLineRequest {
  productCode: string
  outQuantity: number
  inQuantity: number
  lineNo?: number
  lineRemark?: string
}

/**
 * 选仓库查询条件（与后端 InventoryTransferWarehousePickerQueryDto 对齐）
 */
export interface InventoryTransferWarehouseQuery {
  warehouseCodeKeyword?: string
  warehouseNameKeyword?: string
  excludeWarehouseCode?: string
  pageNum?: number
  pageSize?: number
}

/**
 * 选仓库返回行（与后端 TransferWarehousePickerVo 对齐）
 */
export interface InventoryTransferWarehousePickerVo {
  warehouseCode: string
  warehouseName: string
}

/**
 * 选品查询条件（与后端 InventoryTransferProductPickerQueryDto 对齐）
 */
export interface InventoryTransferProductQuery {
  /** 调出仓库编号（与名称二选一） */
  fromWarehouseCode?: string
  /** 调出仓库名称（与编号二选一） */
  fromWarehouseName?: string
  /** 商品编号/名称模糊 */
  keyword?: string
  categoryName?: string
  brandName?: string
  pageNum?: number
  pageSize?: number
}

/**
 * 选品返回行（与后端 InventoryTransferProductPickerVo 对齐）
 */
export interface InventoryTransferProductPickerVo {
  lineNo?: number
  productCode: string
  productName: string
  categoryName: string
  brandName: string
  availableQuantity: number
  uomName: string
}

/**
 * 选品筛选项（复用后端 InventoryDistributionFilterOptionsVo 结构）
 */
export interface InventoryTransferFilterOptionsVo {
  categories: string[]
  brands: string[]
}

/**
 * 前端表单 DTO（页面/弹窗内部使用，不直接发到后端）
 */
export interface InventoryTransferDto {
  transferCode?: string
  fromWarehouseCode?: string
  fromWarehouseName?: string
  toWarehouseCode?: string
  toWarehouseName?: string
  details?: InventoryTransferDetailItem[]
}
