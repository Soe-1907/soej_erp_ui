import { ref } from "vue";
import type { CategoryQuery, CategoryVO, CategoryDto } from "@/type/category";
import {
  queryAllCategoriesApi,
  updateCategoryApi,
  addCategoryApi,
  getCategoryByIdApi,
  enableCategoryApi,
  disableCategoryApi,
} from "@/api/product/category";

export function useCategory() {
  const CategoryList = ref<CategoryVO[]>([]);
  const total = ref(0); // 总数据条数
  const CategoryQuery = ref<CategoryQuery>({
    pageNum: 1,
    pageSize: 10,
    categoryName: "",
    status: undefined,
  });

  // 查询商品分类列表
  const getAllCategories = async () => {
    const res = await queryAllCategoriesApi(CategoryQuery.value);
    CategoryList.value = res.data.list;
    total.value = res.data.total || 0;
  };

  const handleBanCategory = async (row: CategoryVO, nextStatus: number) => {
    if (nextStatus === 1) {
      await enableCategoryApi(row.categoryId);
    } else {
      await disableCategoryApi(row.categoryId);
    }
    await getAllCategories();
  };

  // 重置查询条件
  const resetQuery = () => {
    CategoryQuery.value = {
      pageNum: 1,
      pageSize: 10,
      categoryName: "",
      status: undefined,
    };
    getAllCategories();
  };

  // 新增分类
  const createCategory = async (dto: CategoryDto) => {
    await addCategoryApi(dto);
    await getAllCategories();
  };

  // 修改分类
  const editCategory = async (dto: CategoryDto) => {
    await updateCategoryApi(dto);
    await getAllCategories();
  };

  // 数据回显
  const getCategoryById = async (id: number) => {
    const res = await getCategoryByIdApi(id);
    return res.data;
  };

  return {
    CategoryList,
    CategoryQuery,
    total,
    getAllCategories,
    handleBanCategory,
    createCategory,
    editCategory,
    resetQuery,
    getCategoryById
  };
}

