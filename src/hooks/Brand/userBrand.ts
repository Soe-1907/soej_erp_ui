import { ref, reactive } from "vue";
import type { BrandQuery, BrandVO } from "@/type/brand";
import {
  queryAllBrandsApi,
  updateBrandApi,
  addBrandApi,
  getBrandByIdApi,
  enableBrandApi,
  disableBrandApi,
} from "@/api/product/brand";
import type { BrandDto } from "@/type/brand";

export function useBrand() {
  const BrandList = ref<BrandVO[]>([]);
  const total = ref(0); // 总数据条数
  const BrandQuery = ref<BrandQuery>({
    pageNum: 1,
    pageSize: 10,
    brandName: "",
    status: undefined,
  });
  //查询商品列表
  const getAllBrands = async () => {
    const res = await queryAllBrandsApi(BrandQuery.value);
    BrandList.value = res.data.list;
    total.value = res.data.total || 0;
  };
  const handleBanBrand = async (row: BrandVO, nextStatus: number) => {
    if (nextStatus === 1) {
      await enableBrandApi(row.brandId);
    } else {
      await disableBrandApi(row.brandId);
    }
    await getAllBrands();
  };
  //重置查询条件
  const resetQuery = () => {
    BrandQuery.value = {
      pageNum: 1,
      pageSize: 10,
      brandName: "",
      status: undefined,
    };
     getAllBrands()
  };
  //新增品牌
  const createBrand = async (dto: BrandDto) => {
    await addBrandApi(dto);
    await getAllBrands();
  };

  // 修改
  const editBrand = async (dto: BrandDto) => {
    await updateBrandApi(dto);
    await getAllBrands();
  };
  //数据回显
  const getBrandById = async (id:number) => {
    const res = await getBrandByIdApi(id);
    return res.data;
  };
  return {
    BrandList,
    BrandQuery,
    total,
    getAllBrands,
    handleBanBrand,
    createBrand,
    editBrand,
    resetQuery,
    getBrandById
  };
}
