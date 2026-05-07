import { ref } from "vue";
import type { SupplierQuery, SupplierVO, SupplierDto } from "@/type/supplier";
import {
  queryAllSuppliersApi,
  updateSupplierApi,
  addSupplierApi,
  getSupplierByIdApi,
  enableSupplierApi,
  disableSupplierApi,
} from "@/api/product/supplier";

export function useSupplier() {
  const SupplierList = ref<SupplierVO[]>([]);
  const total = ref(0); // 总数据条数
  const SupplierQuery = ref<SupplierQuery>({
    pageNum: 1,
    pageSize: 10,
    keyword: "",
    status: undefined,
    createdStartDate: undefined,
    createdEndDate: undefined,
  });

  // 查询供应商列表
  const getAllSuppliers = async () => {
    const res = await queryAllSuppliersApi(SupplierQuery.value);
    SupplierList.value = res.data.list;
    total.value = res.data.total || 0;
  };

  const handleBanSupplier = async (row: SupplierVO, nextStatus: number) => {
    if (nextStatus === 1) {
      await enableSupplierApi(row.supplierId);
    } else {
      await disableSupplierApi(row.supplierId);
    }
    await getAllSuppliers();
  };

  // 重置查询条件
  const resetQuery = () => {
    SupplierQuery.value = {
      pageNum: 1,
      pageSize: 10,
      keyword: "",
      status: undefined,
      createdStartDate: undefined,
      createdEndDate: undefined,
    };
    getAllSuppliers();
  };

  // 新增供应商
  const createSupplier = async (dto: SupplierDto) => {
    await addSupplierApi(dto);
    await getAllSuppliers();
  };

  // 修改供应商
  const editSupplier = async (dto: SupplierDto) => {
    await updateSupplierApi(dto);
    await getAllSuppliers();
  };

  // 获取供应商详情
  const getSupplierById = async (id: number) => {
    const res = await getSupplierByIdApi(id);
    return res.data;
  };

  return {
    SupplierList,
    SupplierQuery,
    total,
    getAllSuppliers,
    handleBanSupplier,
    createSupplier,
    editSupplier,
    resetQuery,
    getSupplierById,
  };
}

