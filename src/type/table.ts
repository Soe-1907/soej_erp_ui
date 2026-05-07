// 表格列配置（用于配置表格列）
export interface TableColumn {
    prop: string;      // 字段名
    label: string;     // 列标题
    width?: number | string
    minWidth?: number | string
    align?: "left" | "center" | "right"
    headerAlign?: "left" | "center" | "right"
    formatter?: (row: any, column?: any, cellValue?: any) => string
    /** 缩略图列（如商品图片） */
    imageThumb?: boolean
  }