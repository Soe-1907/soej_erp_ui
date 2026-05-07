/**
 * 客户 VO
 * 对应后端：CustomerVo
 */
export interface CustomerVO {
    /** 客户ID */
    customerId: number
  
    /** 客户编号 */
    customerCode: string
  
    /** 客户名称 */
    customerName: string
  
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
   * 客户查询参数
   * 对应后端：CustomerQueryDto
   */
  export interface CustomerQuery {
    /** 客户编号或名称（模糊查询） */
    keyword?: string
  
    /** 客户状态：1 启用，0 禁用 */
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
   * 客户 DTO
   * 对应后端：CustomerDto
   *
   * 说明：
   * - 新增（AddGroup）：不传 customerId
   * - 修改（UpdateGroup）：必须传 customerId
   */
  export interface CustomerDto {
    /** 客户ID（修改时必填） */
    customerId?: number | undefined
  
    /** 客户编号（系统生成，修改时必传） */
    customerCode?: string
  
    /**
     * 客户名称
     * 校验规则（后端）：
     * - 新增必填
     * - 最大 16 个字符
     * - 仅支持中英文和数字
     */
    customerName?: string
  
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
  
    /** 结账方式（默认：付款发货） */
    checkoutMethod?: string
  
    /** 状态：1 启用，0 禁用 */
    status?: number | undefined
  
    /** 创建时间（后端维护，前端一般不传） */
    createdAt?: string
  
    /** 修改时间（后端维护，前端一般不传） */
    updatedAt?: string
  }
  