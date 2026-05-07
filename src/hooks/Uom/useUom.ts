import { ref } from "vue";
import type { UomQuery, UomVO, UomDto } from "@/type/uom";
import {
  queryAllUomsApi,
  updateUomApi,
  addUomApi,
  getUomByIdApi,
  enableUomApi,
  disableUomApi,
} from "@/api/product/uom";

export function useUom() {
  const UomList = ref<UomVO[]>([]);
  const total = ref(0); // 总数据条数
  const UomQuery = ref<UomQuery>({
    pageNum: 1,
    pageSize: 10,
    uomName: "",
    status: undefined,
  });

  // 查询商品单位列表
  const getAllUoms = async () => {
    const res = await queryAllUomsApi(UomQuery.value);
    UomList.value = res.data.list;
    total.value = res.data.total || 0;
  };

  const handleBanUom = async (row: UomVO, nextStatus: number) => {
    if (nextStatus === 1) {
      await enableUomApi(row.uomId);
    } else {
      await disableUomApi(row.uomId);
    }
    await getAllUoms();
  };

  // 重置查询条件
  const resetQuery = () => {
    UomQuery.value = {
      pageNum: 1,
      pageSize: 10,
      uomName: "",
      status: undefined,
    };
    getAllUoms();
  };

  // 新增单位
  const createUom = async (dto: UomDto) => {
    await addUomApi(dto);
    await getAllUoms();
  };

  // 修改单位
  const editUom = async (dto: UomDto) => {
    await updateUomApi(dto);
    await getAllUoms();
  };

  // 数据回显
  const getUomById = async (id: number) => {
    const res = await getUomByIdApi(id);
    return res.data;
  };

  return {
    UomList,
    UomQuery,
    total,
    getAllUoms,
    handleBanUom,
    createUom,
    editUom,
    resetQuery,
    getUomById
  };
}

