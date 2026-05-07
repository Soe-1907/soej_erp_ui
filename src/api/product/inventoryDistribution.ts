import request from '@/utils/request'
import type {
  InventoryDistributionDetailVo,
  InventoryDistributionFilterOptionsVo,
  InventoryDistributionQuery,
  InventoryDistributionVO,
} from '@/type/inventoryDistribution'
import type { PageResult } from '@/type/page'

/** 库存分布分页列表 */
export const queryInventoryDistributionListApi = (params: InventoryDistributionQuery) => {
  return request.get<PageResult<InventoryDistributionVO>>('/inventory/distribution', { params })
}

/** 分类/品牌筛选项（合并接口） */
export const queryInventoryDistributionFilterOptionsApi = () => {
  return request.get<InventoryDistributionFilterOptionsVo>('/inventory/distribution/filter-options')
}

/** 查看仓库（按商品维度返回各仓库实际/可用库存与合计） */
export const queryInventoryDistributionDetailApi = (productCode: string) => {
  return request.get<InventoryDistributionDetailVo>('/inventory/distribution/detail', {
    params: { productCode },
  })
}
