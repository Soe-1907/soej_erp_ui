import { ref } from 'vue'
import type {
  InventoryDistributionDetailVo,
  InventoryDistributionFilterOptionsVo,
  InventoryDistributionQuery,
  InventoryDistributionVO,
  InventoryWarehouseVO,
} from '@/type/inventoryDistribution'
import {
  queryInventoryDistributionDetailApi,
  queryInventoryDistributionFilterOptionsApi,
  queryInventoryDistributionListApi,
} from '@/api/product/inventoryDistribution'

export function useInventoryDistribution() {
  const list = ref<InventoryDistributionVO[]>([])
  const total = ref(0)
  const query = ref<InventoryDistributionQuery>(createDefaultQuery())
  const categoryOptions = ref<string[]>([])
  const brandOptions = ref<string[]>([])
  const warehouseList = ref<InventoryWarehouseVO[]>([])

  const fetchList = async () => {
    const res = (await queryInventoryDistributionListApi(query.value)) as {
      data: { list: InventoryDistributionVO[]; total: number }
    }
    list.value = res.data?.list ?? []
    total.value = res.data?.total ?? 0
  }

  const fetchOptions = async () => {
    const res = (await queryInventoryDistributionFilterOptionsApi()) as {
      data: InventoryDistributionFilterOptionsVo
    }
    categoryOptions.value = res.data?.categories ?? []
    brandOptions.value = res.data?.brands ?? []
  }

  const fetchWarehouses = async (productCode: string) => {
    const res = (await queryInventoryDistributionDetailApi(productCode)) as {
      data: InventoryDistributionDetailVo
    }
    const detail = res.data
    if (!detail) {
      warehouseList.value = []
      return
    }
    const lines: InventoryWarehouseVO[] = (detail.lines ?? []).map((line) => ({
      warehouseCode: line.warehouseCode,
      warehouseName: line.warehouseName,
      actualQuantity: line.actualQuantity,
      availableQuantity: line.availableQuantity,
    }))
    lines.push({
      warehouseCode: '合计',
      warehouseName: '合计',
      actualQuantity: detail.totalActualQuantity ?? 0,
      availableQuantity: detail.totalAvailableQuantity ?? 0,
    })
    warehouseList.value = lines
  }

  const resetQuery = () => {
    query.value = createDefaultQuery()
  }

  return {
    list,
    total,
    query,
    categoryOptions,
    brandOptions,
    warehouseList,
    fetchList,
    fetchOptions,
    fetchWarehouses,
    resetQuery,
  }
}

function createDefaultQuery(): InventoryDistributionQuery {
  return {
    pageNum: 1,
    pageSize: 10,
    keyword: undefined,
    categoryName: undefined,
    brandName: undefined,
  }
}
