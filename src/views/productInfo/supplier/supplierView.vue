<template>
  <div class="query-container">
    <div class="query-row">
      <QueryInput
        v-model="SupplierQuery.keyword"
        placeholder="请输入供应商编号或名称查询"
        style="width: 250px"
      />

      <div class="query-item">
        <span class="query-label">状态</span>
        <div class="query-control-sm">
          <QueryStatusSelect v-model="SupplierQuery.status" />
        </div>
      </div>

      <div class="query-item">
        <span class="query-label">创建时间</span>
        <QueryDateTimeRange v-model="createdDateRange" />
      </div>
    </div>
  </div>

  <!-- 按钮区 -->
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
  </div>

  <!-- 表格区 -->
  <BaseTable
    :data="SupplierList"
    :columns="TableColumns"
    :index-base="indexBase"
    :operation-width="240"
    operation-align="center"
  >
    <template #operations="{ row }">
      <!-- 查看按钮 -->
      <el-button type="primary" size="small" link @click="openDetail(row)">
        查看
      </el-button>

      <!-- 编辑按钮 -->
      <el-button type="primary" size="small" link @click="openEdit(row)">
        修改
      </el-button>

      <!-- 禁用/启用按钮 -->
      <Ban
        :status="row.status"
        title="供应商信息"
        @confirm="(nextStatus) => handleBanSupplier(row, nextStatus)"
      />
    </template>
  </BaseTable>

  <!-- 分页区域 -->
  <div class="pagination-container">
    <BasePagination
      v-model:pageNum="SupplierQuery.pageNum!"
      v-model:pageSize="SupplierQuery.pageSize!"
      :total="total"
      @change="getAllSuppliers"
    />
  </div>

  <!-- 对话框区域 -->
  <supplierDetailDialog
    v-model="detailVisible"
    :data="currentDetailRow"
  />
  <supplierEditDialog
    v-model="editVisible"
    :data="currentEditRow"
    @submit="handleEditSubmit"
  />
  <supplierAddDialog
    v-model="addVisible"
    @submit="handleAddSubmit"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { Plus, RefreshLeft } from "@element-plus/icons-vue";
import type { TableColumn } from "@/type/table";
import type { SupplierDto } from "@/type/supplier";

import BaseTable from "@/components/table/BaseTable/BaseTable.vue";
import BasePagination from "@/components/page/BasePagination.vue";
import QueryStatusSelect from "@/components/query/Query/QueryStatusSelect.vue";
import QueryInput from "@/components/query/Query/QueryInput.vue";
import QueryDateTimeRange from "@/components/query/Query/QueryDateTimeRange.vue";
import Ban from "@/components/table/BaseTable/Ban.vue";
import supplierAddDialog from "./supplierAddDialog.vue";
import supplierEditDialog from "./supplierEditDialog.vue";
import supplierDetailDialog from "./supplierDetailDialog.vue";

import { useSupplier } from "@/hooks/Supplier/useSupplier";

const {
  getAllSuppliers,
  SupplierList,
  SupplierQuery,
  total,
  handleBanSupplier,
  resetQuery,
  createSupplier,
  editSupplier,
} = useSupplier();

// 时间范围
const createdDateRange = ref<[string, string] | null>(null);

// 监听时间范围变化
watch(createdDateRange, (val) => {
  if (val && val.length === 2) {
    SupplierQuery.value.createdStartDate = val[0];
    SupplierQuery.value.createdEndDate = val[1];
  } else {
    SupplierQuery.value.createdStartDate = undefined;
    SupplierQuery.value.createdEndDate = undefined;
  }
});

onMounted(() => {
  getAllSuppliers();
});

const indexBase = computed(
  () => (SupplierQuery.value.pageNum! - 1) * SupplierQuery.value.pageSize!
);

const handleReset = () => {
  createdDateRange.value = null;
  resetQuery();
};

const TableColumns: TableColumn[] = [
  { prop: "supplierCode", label: "供应商编号", minWidth: 150 },
  { prop: "supplierName", label: "供应商名称", minWidth: 220 },
  { prop: "createdAt", label: "创建时间", minWidth: 180 },
  {
    prop: "status",
    label: "状态",
    width: 100,
    formatter: (_row, _column, value) => (value === 1 ? "启用" : "禁用"),
  },
];

// ============ 查询相关 ============
const handleQuery = () => {
  SupplierQuery.value.pageNum = 1;
  getAllSuppliers();
};

// ============ 查看详情相关 ============
const detailVisible = ref(false);
const currentDetailRow = ref<any>(null);

const openDetail = (row: any) => {
  currentDetailRow.value = { ...row };
  detailVisible.value = true;
};

// ============ 新增相关 ============
const addVisible = ref(false);
const openAdd = () => {
  addVisible.value = true;
};

const handleAddSubmit = async (dto: SupplierDto) => {
  await createSupplier(dto);
  ElMessage.success("新增成功");
  addVisible.value = false;
};

// ============ 编辑相关 ============
const editVisible = ref(false);
const currentEditRow = ref<any>(null);

const openEdit = (row: any) => {
  currentEditRow.value = { ...row };
  editVisible.value = true;
};

const handleEditSubmit = async (dto: SupplierDto) => {
  await editSupplier(dto);
  ElMessage.success("修改成功");
  editVisible.value = false;
  currentEditRow.value = null;
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
  flex-wrap: wrap;
}

.query-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.query-control-sm {
  width: 150px;
}

.query-label {
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
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

