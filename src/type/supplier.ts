/**
 * 供应商 VO
 * 对应后端：SupplierVo
 */
export interface SupplierVO {
    /** 供应商ID */
    supplierId: number
  
    /** 供应商编号 */
    supplierCode: string
  
    /** 供应商名称 */
    supplierName: string
  
    /** 联系人名称 */
    contactName: string
  
    /** 联系电话 */
    mobile: string
  
    /** 地址 */
    address: string
  
    /** 结账方式 */
    checkoutMethod: string
  
    /** 状态：1 启用，0 禁用 */
    status: number
  
    /** 状态名称（启用 / 禁用） */
    statusName: string
  
    /** 创建时间（ISO 字符串） */
    createdAt: string
  
    /** 修改时间（ISO 字符串） */
    updatedAt: string
  }
  
  /**
   * 供应商查询参数
   * 对应后端：SupplierQueryDto
   */
  export interface SupplierQuery {
    /** 供应商编号或名称（模糊查询） */
    keyword?: string
  
    /** 供应商状态：1 启用，0 禁用 */
    status?: number | undefined
  
    /** 创建开始日期（yyyy-MM-dd HH:mm:ss） */
    createdStartDate?: string
  
    /** 创建结束日期（yyyy-MM-dd HH:mm:ss） */
    createdEndDate?: string
  
    /** 当前页码 */
    pageNum?: number
  
    /** 每页大小 */
    pageSize?: number
  }
  
  /**
   * 供应商 DTO
   * 对应后端：SupplierDto
   *
   * 说明：
   * - 新增（AddGroup）：不传 supplierId
   * - 修改（UpdateGroup）：必须传 supplierId
   */
  export interface SupplierDto {
    /** 供应商ID（修改时必填） */
    supplierId?: number | undefined
  
    /** 供应商编号（系统生成，修改时必传） */
    supplierCode?: string
  
    /**
     * 供应商名称
     * 校验规则（后端）：
     * - 新增必填
     * - 最大 16 个字符
     * - 仅支持中英文和数字
     */
    supplierName?: string
  
    /**
     * 联系人名称
     * - 新增必填
     * - 最大 16 个字符
     */
    contactName?: string
  
    /**
     * 联系电话
     * - 新增必填
     * - 11 位手机号
     */
    mobile?: string
  
    /**
     * 地址
     * - 新增必填
     * - 长度 2–64 字符
     */
    address?: string
  
    /** 结账方式（默认：货到付款） */
    checkoutMethod?: string
  
    /** 状态：1 启用，0 禁用 */
    status?: number | undefined
  
    /** 创建时间（后端维护，前端一般不传） */
    createdAt?: string
  
    /** 修改时间（后端维护，前端一般不传） */
    updatedAt?: string
  }
  