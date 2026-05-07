<template>
  <div class="query-container">
    <div class="query-row">
      <div class="query-keyword-wrap">
        <QueryInput
          v-model="ProductQuery.keyword"
          placeholder="请输入商品编号或名称查询"
        />
      </div>

      <div class="query-item">
        <span class="query-label">商品分类</span>
        <el-select
          v-model="ProductQuery.categoryId"
          placeholder="请选择"
          clearable
          class="query-select"
        >
          <el-option
            v-for="item in filterCategoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>

      <div class="query-item">
        <span class="query-label">商品品牌</span>
        <el-select
          v-model="ProductQuery.brandId"
          placeholder="请选择"
          clearable
          class="query-select"
        >
          <el-option
            v-for="item in filterBrandOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>

      <div class="query-item">
        <span class="query-label">状态</span>
        <div class="query-control-sm">
          <QueryStatusSelect v-model="ProductQuery.status" />
        </div>
      </div>
    </div>

    <div class="query-row query-row-dates">
      <div class="query-item query-item-grow">
        <span class="query-label">创建时间</span>
        <QueryDateTimeRange v-model="createdDateRange" />
      </div>

      <div class="query-item query-item-grow">
        <span class="query-label">修改时间</span>
        <QueryDateTimeRange v-model="updatedDateRange" />
      </div>
    </div>
  </div>

  <div class="button-container">
    <el-button type="primary" @click="handleQuery">查询</el-button>
    <el-button @click="handleReset">
      <el-icon class="el-icon--left"><RefreshLeft /></el-icon>
      重置
    </el-button>
    <el-button type="primary" plain @click="openAdd">
      <el-icon class="el-icon--left"><Plus /></el-icon>
      新增
    </el-button>
    <el-button type="warning" plain @click="importVisible = true">批量导入</el-button>
  </div>

  <BaseTable
    :data="ProductList"
    :columns="TableColumns"
    :index-base="indexBase"
    :operation-width="200"
  >
    <template #operations="{ row }">
      <el-button type="primary" size="small" link @click="openEdit(row)">
        修改
      </el-button>

      <Ban
        :status="row.status"
        title="商品"
        @confirm="(nextStatus) => handleBanProduct(row, nextStatus)"
      />
    </template>
  </BaseTable>

  <div class="pagination-container">
    <BasePagination
      v-model:pageNum="ProductQuery.pageNum!"
      v-model:pageSize="ProductQuery.pageSize!"
      :total="total"
      @change="getAllProducts"
    />
  </div>

  <ManagerEditDialog
    v-model="editVisible"
    :data="currentEditRow"
    :category-options="formCategoryOptions"
    :brand-options="formBrandOptions"
    :uom-options="formUomOptions"
    @submit="handleEditSubmit"
  />
  <ManagerAddDialog
    ref="addDialogRef"
    v-model="addVisible"
    :category-options="formCategoryOptions"
    :brand-options="formBrandOptions"
    :uom-options="formUomOptions"
    @submit="handleAddSubmit"
  />
  <ManagerImportDialog
    v-model="importVisible"
    @success="onImportSuccess"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { Plus, RefreshLeft } from "@element-plus/icons-vue";
import type { TableColumn } from "@/type/table";
import type { ProductDto, ProductVO } from "@/type/product";

import BaseTable from "@/components/table/BaseTable/BaseTable.vue";
import BasePagination from "@/components/page/BasePagination.vue";
import QueryStatusSelect from "@/components/query/Query/QueryStatusSelect.vue";
import QueryInput from "@/components/query/Query/QueryInput.vue";
import QueryDateTimeRange from "@/components/query/Query/QueryDateTimeRange.vue";
import Ban from "@/components/table/BaseTable/Ban.vue";
import ManagerAddDialog from "./ManagerAddDialog.vue";
import ManagerEditDialog from "./ManagerEditDialog.vue";
import ManagerImportDialog from "./ManagerImportDialog.vue";

import { useProduct } from "@/hooks/Product/useProduct";

const {
  getAllProducts,
  ProductList,
  ProductQuery,
  total,
  filterCategoryOptions,
  filterBrandOptions,
  formCategoryOptions,
  formBrandOptions,
  formUomOptions,
  handleBanProduct,
  resetQuery,
  createProduct,
  createProductAndContinue,
  editProduct,
  loadSelectOptions,
  loadFilterOptions,
} = useProduct();

const createdDateRange = ref<[string, string] | null>(null);
const updatedDateRange = ref<[string, string] | null>(null);
const addDialogRef = ref<InstanceType<typeof ManagerAddDialog> | null>(null);
const importVisible = ref(false);

watch(createdDateRange, (val) => {
  if (val && val.length === 2) {
    ProductQuery.value.createdStartDate = val[0];
    ProductQuery.value.createdEndDate = val[1];
  } else {
    ProductQuery.value.createdStartDate = undefined;
    ProductQuery.value.createdEndDate = undefined;
  }
});

watch(updatedDateRange, (val) => {
  if (val && val.length === 2) {
    ProductQuery.value.updatedStartDate = val[0];
    ProductQuery.value.updatedEndDate = val[1];
  } else {
    ProductQuery.value.updatedStartDate = undefined;
    ProductQuery.value.updatedEndDate = undefined;
  }
});

onMounted(async () => {
  await loadSelectOptions();
  await getAllProducts();
});

const indexBase = computed(
  () => (ProductQuery.value.pageNum! - 1) * ProductQuery.value.pageSize!
);

const formatDateTime = (val: string) => {
  if (!val) return "—";
  return val.replace("T", " ").slice(0, 19);
};

const TableColumns: TableColumn[] = [
  { prop: "productCode", label: "商品编号", minWidth: 150 },
  {
    prop: "imageUrl",
    label: "商品图片",
    width: 100,
    imageThumb: true,
  },
  { prop: "productName", label: "商品名称", minWidth: 200 },
  { prop: "categoryName", label: "商品分类", minWidth: 120 },
  { prop: "brandName", label: "商品品牌", minWidth: 120 },
  { prop: "uomName", label: "商品单位", width: 100 },
  {
    prop: "suggestPurchasePrice",
    label: "建议采购价（元）",
    minWidth: 130,
  },
  {
    prop: "suggestSalePrice",
    label: "建议销售价（元）",
    minWidth: 130,
  },
  {
    prop: "createdAt",
    label: "创建时间",
    minWidth: 170,
    formatter: (_r, _c, v) => formatDateTime(String(v ?? "")),
  },
  {
    prop: "updatedAt",
    label: "修改时间",
    minWidth: 170,
    formatter: (_r, _c, v) => formatDateTime(String(v ?? "")),
  },
  {
    prop: "status",
    label: "状态",
    width: 90,
    formatter: (_row, _column, value) => (value === 1 ? "启用" : "禁用"),
  },
];

const handleQuery = () => {
  ProductQuery.value.pageNum = 1;
  getAllProducts();
};

const handleReset = () => {
  createdDateRange.value = null;
  updatedDateRange.value = null;
  resetQuery();
};

const addVisible = ref(false);
const openAdd = () => {
  addVisible.value = true;
};

const handleAddSubmit = async (dto: ProductDto, continueAdd: boolean) => {
  try {
    if (continueAdd) {
      await createProductAndContinue(dto);
      ElMessage.success("保存成功");
      addDialogRef.value?.resetForm();
    } else {
      await createProduct(dto);
      ElMessage.success("新增成功");
      addVisible.value = false;
    }
    await loadFilterOptions();
  } catch {
    /* 全局已提示 */
  }
};

const editVisible = ref(false);
const currentEditRow = ref<ProductVO | null>(null);

const openEdit = (row: ProductVO) => {
  currentEditRow.value = { ...row };
  editVisible.value = true;
};

const handleEditSubmit = async (dto: ProductDto) => {
  try {
    await editProduct(dto);
    ElMessage.success("修改成功");
    editVisible.value = false;
    currentEditRow.value = null;
    await loadFilterOptions();
  } catch {
    /* 全局已提示 */
  }
};

const onImportSuccess = async () => {
  await getAllProducts();
  await loadFilterOptions();
};
</script>

<style scoped>
.query-container {
  margin-bottom: 16px;
}

.query-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.query-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.query-label {
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
}

.query-keyword-wrap :deep(.el-input) {
  width: 220px;
}

.query-select {
  width: 180px;
}

.query-control-sm {
  width: 150px;
}

.query-row-dates {
  align-items: stretch;
}

.query-item-grow {
  flex: 1;
  min-width: 280px;
}

.query-item-grow :deep(.el-date-editor.el-date-editor--datetimerange) {
  width: 100%;
  max-width: 100%;
  flex: 1;
  box-sizing: border-box;
}

.button-container {
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
}

.pagination-container {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>
