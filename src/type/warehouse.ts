/** 仓库专员等用户下拉（对应后端 UserOptionVo） */
export interface UserOptionVO {
  id: number
  userName: string
  realName?: string
}

/**
 * 仓库 VO
 * 对应后端：WarehouseVo
 */
export interface WarehouseVO {
    /** 仓库ID */
    warehouseId: number
  
    /** 仓库编号 */
    warehouseCode: string
  
    /** 仓库名称 */
    warehouseName: string
  
    /** 仓库专员用户ID */
    specialistUserId: number
  
    /** 仓库专员名称（关联查询） */
    specialistUserName: string
  
    /** 联系电话 */
    phone: string
  
    /** 地址 */
    address: string
  
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
   * 仓库查询参数
   * 对应后端：WarehouseQueryDto
   */
  export interface WarehouseQuery {
    /** 关键字（仓库编号 / 名称模糊查询） */
    keyword?: string
  
    /** 仓库专员名称（模糊查询） */
    specialistName?: string
  
    /** 状态：1 启用，0 禁用 */
    status?: number | undefined
  
    /** 创建开始日期（yyyy-MM-dd HH:mm:ss） */
    createdStartDate?: string
  
    /** 创建结束日期（yyyy-MM-dd HH:mm:ss） */
    createdEndDate?: string
  
    /** 当前页码 */
    pageNum?: number
  
    /** 每页条数 */
    pageSize?: number
  }
  
  /**
   * 仓库 DTO
   * 对应后端：WarehouseDto
   *
   * 说明：
   * - 新增（AddGroup）：不传 warehouseId / warehouseCode
   * - 修改（UpdateGroup）：必须传 warehouseCode
   */
  export interface WarehouseDto {
    /** 仓库ID（系统自动生成） */
    warehouseId?: number
  
    /** 仓库编号（系统生成，修改时必填） */
    warehouseCode?: string
  
    /**
     * 仓库名称
     * 校验规则（后端）：
     * - 新增必填
     * - 最大 16 字符
     * - 仅支持中英文和数字
     */
    warehouseName?: string
  
    /** 仓库专员用户ID（新增/修改必填，对应后端 specialistUserId） */
    specialistUserId?: number | undefined
  
    /**
     * 联系电话
     * - 新增必填
     * - 11 位手机号
     */
    phone?: string
  
    /**
     * 地址
     * - 新增必填
     * - 长度 2–64 字符
     */
    address?: string
  
    /** 状态：1 启用，0 禁用 */
    status?: number | undefined
  
    /** 创建时间（后端维护，前端一般不传） */
    createdAt?: string
  
    /** 修改时间（后端维护，前端一般不传） */
    updatedAt?: string
  }
  