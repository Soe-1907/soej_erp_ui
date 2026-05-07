import { ref } from "vue";
import type { WarehouseQuery, WarehouseVO, WarehouseDto } from "@/type/warehouse";
import type { SelectOption } from "@/type/select";
import {
  queryAllWarehousesApi,
  updateWarehouseApi,
  addWarehouseApi,
  getWarehouseByCodeApi,
  listAvailableWarehouseSpecialistsApi,
  enableWarehouseApi,
  disableWarehouseApi,
} from "@/api/product/warehouse";

export function useWarehouse() {
  const WarehouseList = ref<WarehouseVO[]>([]);
  const total = ref(0); // 总数据条数
  const WarehouseQuery = ref<WarehouseQuery>({
    pageNum: 1,
    pageSize: 10,
    keyword: "",
    specialistName: "",
    status: undefined,
    createdStartDate: undefined,
    createdEndDate: undefined,
  });

  // 仓库专员下拉框选项
  const managerOptions = ref<SelectOption[]>([]);

  // 查询仓库列表
  const getAllWarehouses = async () => {
    const res = await queryAllWarehousesApi(WarehouseQuery.value);
    WarehouseList.value = res.data.list;
    total.value = res.data.total || 0;
  };

  const handleBanWarehouse = async (row: WarehouseVO, nextStatus: number) => {
    if (nextStatus === 1) {
      await enableWarehouseApi(row.warehouseCode);
    } else {
      await disableWarehouseApi(row.warehouseCode);
    }
    await getAllWarehouses();
  };

  // 重置查询条件
  const resetQuery = () => {
    WarehouseQuery.value = {
      pageNum: 1,
      pageSize: 10,
      keyword: "",
      specialistName: "",
      status: undefined,
      createdStartDate: undefined,
      createdEndDate: undefined,
    };
    getAllWarehouses();
  };

  // 新增仓库
  const createWarehouse = async (dto: WarehouseDto) => {
    await addWarehouseApi(dto);
    await getAllWarehouses();
  };

  // 修改仓库
  const editWarehouse = async (dto: WarehouseDto) => {
    await updateWarehouseApi(dto);
    await getAllWarehouses();
  };

  // 获取仓库详情
  const getWarehouseByCode = async (code: string) => {
    const res = await getWarehouseByCodeApi(code);
    return res.data;
  };

  /** 可选仓库专员（未被其他仓占用）；编辑时传入当前仓 warehouseId 以保留本仓专员 */
  const loadManagerOptions = async (excludeWarehouseId?: number) => {
    const res = await listAvailableWarehouseSpecialistsApi(excludeWarehouseId);
    const list = res.data ?? [];
    managerOptions.value = list.map((u) => ({
      label: u.userName,
      value: Number(u.id),
    }));
  };

  return {
    WarehouseList,
    WarehouseQuery,
    total,
    managerOptions,
    getAllWarehouses,
    handleBanWarehouse,
    createWarehouse,
    editWarehouse,
    resetQuery,
    getWarehouseByCode,
    loadManagerOptions,
  };
}

