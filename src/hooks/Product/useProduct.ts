import { ref } from "vue";
import type { ProductQuery, ProductVO, ProductDto } from "@/type/product";
import type { CategoryVO } from "@/type/category";
import type { BrandVO } from "@/type/brand";
import type { UomVO } from "@/type/uom";
import type { SelectOption } from "@/type/select";
import {
  queryAllProductsApi,
  updateProductApi,
  addProductApi,
  saveAndAddProductApi,
  getProductByIdApi,
  enableProductApi,
  disableProductApi,
  listProductCategoryOptionsApi,
  listProductBrandOptionsApi,
  listProductUomOptionsApi,
} from "@/api/product/manager";
import { queryAllCategoriesApi } from "@/api/product/category";
import { queryAllBrandsApi } from "@/api/product/brand";
import { queryAllUomsApi } from "@/api/product/uom";

const mapMasterToSelect = (list: { id: number; name: string }[]): SelectOption[] =>
  list.map((x) => ({ value: Number(x.id), label: x.name }));

/** 列表查询区：所有状态的主数据（大页拉取） */
const QUERY_PAGE_SIZE = 500;

export function useProduct() {
  const ProductList = ref<ProductVO[]>([]);
  const total = ref(0);
  const ProductQuery = ref<ProductQuery>({
    pageNum: 1,
    pageSize: 10,
    keyword: "",
    categoryId: undefined,
    brandId: undefined,
    status: undefined,
    createdStartDate: undefined,
    createdEndDate: undefined,
    updatedStartDate: undefined,
    updatedEndDate: undefined,
  });

  /** 查询区下拉（含禁用数据） */
  const filterCategoryOptions = ref<SelectOption[]>([]);
  const filterBrandOptions = ref<SelectOption[]>([]);
  const filterUomOptions = ref<SelectOption[]>([]);

  /** 新增/编辑弹窗：仅启用 */
  const formCategoryOptions = ref<SelectOption[]>([]);
  const formBrandOptions = ref<SelectOption[]>([]);
  const formUomOptions = ref<SelectOption[]>([]);

  const getAllProducts = async () => {
    const res = await queryAllProductsApi(ProductQuery.value);
    ProductList.value = res.data.list;
    total.value = res.data.total || 0;
  };

  const handleBanProduct = async (row: ProductVO, nextStatus: number) => {
    if (nextStatus === 1) {
      await enableProductApi(row.productId);
    } else {
      await disableProductApi(row.productId);
    }
    await getAllProducts();
  };

  const resetQuery = () => {
    ProductQuery.value = {
      pageNum: 1,
      pageSize: 10,
      keyword: "",
      categoryId: undefined,
      brandId: undefined,
      status: undefined,
      createdStartDate: undefined,
      createdEndDate: undefined,
      updatedStartDate: undefined,
      updatedEndDate: undefined,
    };
    getAllProducts();
  };

  const createProduct = async (dto: ProductDto) => {
    await addProductApi(dto);
    await getAllProducts();
  };

  const createProductAndContinue = async (dto: ProductDto) => {
    await saveAndAddProductApi(dto);
    await getAllProducts();
  };

  const editProduct = async (dto: ProductDto) => {
    await updateProductApi(dto);
    await getAllProducts();
  };

  const getProductById = async (id: number) => {
    const res = await getProductByIdApi(id);
    return res.data;
  };

  const loadFilterOptions = async () => {
    const [cRes, bRes, uRes] = await Promise.all([
      queryAllCategoriesApi({ pageNum: 1, pageSize: QUERY_PAGE_SIZE }),
      queryAllBrandsApi({ pageNum: 1, pageSize: QUERY_PAGE_SIZE, brandName: "" }),
      queryAllUomsApi({ pageNum: 1, pageSize: QUERY_PAGE_SIZE }),
    ]);
    filterCategoryOptions.value = (cRes.data.list ?? []).map((row: CategoryVO) => ({
      value: row.categoryId,
      label: row.categoryName,
    }));
    filterBrandOptions.value = (bRes.data.list ?? []).map((row: BrandVO) => ({
      value: row.brandId,
      label: row.brandName,
    }));
    filterUomOptions.value = (uRes.data.list ?? []).map((row: UomVO) => ({
      value: row.uomId,
      label: row.uomName,
    }));
  };

  const loadFormOptions = async () => {
    const [cRes, bRes, uRes] = await Promise.all([
      listProductCategoryOptionsApi(),
      listProductBrandOptionsApi(),
      listProductUomOptionsApi(),
    ]);
    formCategoryOptions.value = mapMasterToSelect(cRes.data ?? []);
    formBrandOptions.value = mapMasterToSelect(bRes.data ?? []);
    formUomOptions.value = mapMasterToSelect(uRes.data ?? []);
  };

  const loadSelectOptions = async () => {
    await Promise.all([loadFilterOptions(), loadFormOptions()]);
  };

  return {
    ProductList,
    ProductQuery,
    total,
    filterCategoryOptions,
    filterBrandOptions,
    filterUomOptions,
    formCategoryOptions,
    formBrandOptions,
    formUomOptions,
    getAllProducts,
    handleBanProduct,
    createProduct,
    createProductAndContinue,
    editProduct,
    resetQuery,
    getProductById,
    loadSelectOptions,
    loadFilterOptions,
    loadFormOptions,
  };
}
