import { ref } from 'vue'
import type {
  InventoryTransferAddRequestBody,
  InventoryTransferDetailItem,
  InventoryTransferDto,
  InventoryTransferListItem,
  InventoryTransferQuery,
  InventoryTransferUpdateRequestBody,
} from '@/type/inventoryTransfer'
import {
  addInventoryTransferApi,
  commitInventoryTransferApi,
  deleteInventoryTransferApi,
  queryInventoryTransferListApi,
  updateInventoryTransferApi,
} from '@/api/product/inventoryTransfer'

export function useInventoryTransfer() {
  const list = ref<InventoryTransferListItem[]>([])
  const total = ref(0)
  const query = ref<InventoryTransferQuery>(createDefaultQuery())

  const fetchList = async () => {
    const res = (await queryInventoryTransferListApi(query.value)) as {
      data: { list: InventoryTransferListItem[]; total: number }
    }
    list.value = res.data?.list ?? []
    total.value = res.data?.total ?? 0
  }

  const resetQuery = () => {
    query.value = createDefaultQuery()
  }

  const createInventoryTransfer = async (dto: InventoryTransferDto) => {
    await addInventoryTransferApi(mapDtoToAddBody(dto))
    await fetchList()
  }

  const editInventoryTransfer = async (dto: InventoryTransferDto) => {
    if (!dto.transferCode) {
      throw new Error('缺少库存调拨单号')
    }
    await updateInventoryTransferApi(mapDtoToUpdateBody(dto))
    await fetchList()
  }

  const commitInventoryTransfer = async (transferCode: string) => {
    await commitInventoryTransferApi(transferCode)
    await fetchList()
  }

  const deleteInventoryTransfer = async (transferCode: string) => {
    await deleteInventoryTransferApi(transferCode)
    await fetchList()
  }

  return {
    list,
    total,
    query,
    fetchList,
    resetQuery,
    createInventoryTransfer,
    editInventoryTransfer,
    commitInventoryTransfer,
    deleteInventoryTransfer,
  }
}

function mapDtoToAddBody(dto: InventoryTransferDto): InventoryTransferAddRequestBody {
  const fromWarehouseCode = dto.fromWarehouseCode?.trim() ?? ''
  const toWarehouseCode = dto.toWarehouseCode?.trim() ?? ''
  const lines = (dto.details ?? []).map((row: InventoryTransferDetailItem, idx) => {
    const outQuantity = Number(row.outQuantity)
    return {
      productCode: String(row.productCode ?? '').trim(),
      outQuantity,
      inQuantity: outQuantity,
      lineNo: idx + 1,
      lineRemark: String(row.lineRemark ?? '').trim(),
    }
  })
  return { fromWarehouseCode, toWarehouseCode, lines }
}

function mapDtoToUpdateBody(dto: InventoryTransferDto): InventoryTransferUpdateRequestBody {
  const transferCode = dto.transferCode?.trim() ?? ''
  return {
    transferCode,
    ...mapDtoToAddBody(dto),
  }
}

function createDefaultQuery(): InventoryTransferQuery {
  return {
    pageNum: 1,
    pageSize: 10,
    transferCode: undefined,
    fromWarehouseKeyword: undefined,
    toWarehouseKeyword: undefined,
    transferStatus: undefined,
    initiatorKeyword: undefined,
    auditorKeyword: undefined,
    operationTimeStart: undefined,
    operationTimeEnd: undefined,
    auditTimeStart: undefined,
    auditTimeEnd: undefined,
  }
}
