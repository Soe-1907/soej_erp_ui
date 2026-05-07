/** 与 PageData 等价（设计方案别名） */
export type PageResult<T> = PageData<T>

/** 启用 / 禁用等业务状态 */
export type StatusValue = 0 | 1

/**
   * 分页数据（简化版，只包含必要字段）
   */
export interface PageData<T> {
    /** 当前页码 */
    pageNum: number;
    /** 每页大小 */
    pageSize: number;
    /** 总记录数 */
    total: number;
    /** 数据列表 */
    list: T[];
  }
  
  /**
   * 分页查询参数
   */
  export interface PageQuery {
    /** 当前页码 */
    pageNum: number;
    /** 每页大小 */
    pageSize: number;
  }