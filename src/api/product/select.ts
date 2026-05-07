import request from '@/utils/request'
import type { SelectOption } from '@/type/select'

/**
 * 下拉框数据类型
 * 1 - 商品分类
 * 2 - 商品品牌
 * 3 - 商品单位
 * 4 - 仓库专员
 */
export enum SelectType {
  CATEGORY = 1,
  BRAND = 2,
  UOM = 3,
  WAREHOUSE = 4,
}

/**
 * 获取下拉框选项列表
 * 对应后端：GET /api/select?type=xx
 */
export const getSelectListApi = (type: SelectType | number) => {
  return request.get<SelectOption[]>('/select', {
    params: { type },
  })
}
