<template>
  <div class="query-container">
    <div class="query-row">
      <QueryInput
        v-model="WarehouseQuery.keyword"
        placeholder="请输入仓库编号或名称查询"
        style="width: 250px"
      />

      <div class="query-item">
        <span class="query-label">仓库专员</span>
        <QueryInput
          v-model="WarehouseQuery.specialistName"
          placeholder="请输入仓库专员名称查询"
          style="width: 250px"
        />
      </div>

      <div class="query-item">
        <span class="query-label">状态</span>
        <div class="query-control-sm">
          <QueryStatusSelect v-model="WarehouseQuery.status" />
        </div>
      </div>
    </div>

    <div class="query-row">
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
    :data="WarehouseList"
    :columns="TableColumns"
    :index-base="indexBase"
    :operation-width="220"
  >
    <template #operations="{ row }">
      <el-button type="primary" size="small" link @click="openEdit(row)">
        修改
      </el-button>

      <Ban
        :status="row.status"
        title="仓库信息"
        @confirm="(nextStatus) => handleBanWarehouse(row, nextStatus)"
      />
    </template>
  </BaseTable>

  <!-- 分页区域 -->
  <div class="pagination-container">
    <BasePagination
      v-model:pageNum="WarehouseQuery.pageNum!"
      v-model:pageSize="WarehouseQuery.pageSize!"
      :total="total"
      @change="getAllWarehouses"
    />
  </div>

  <!-- 对话框区域 -->
  <warehouseEditorDialog
    v-model="editVisible"
    :data="currentEditRow"
    :manager-options="managerOptions"
    @submit="handleEditSubmit"
  />
  <warehouseAddDialog
    v-model="addVisible"
    :manager-options="managerOptions"
    @submit="handleAddSubmit"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { Plus, RefreshLeft } from "@element-plus/icons-vue";
import type { TableColumn } from "@/type/table";
import type { WarehouseDto } from "@/type/warehouse";

import BaseTable from "@/components/table/BaseTable/BaseTable.vue";
import BasePagination from "@/components/page/BasePagination.vue";
import QueryStatusSelect from "@/components/query/Query/QueryStatusSelect.vue";
import QueryInput from "@/components/query/Query/QueryInput.vue";
import QueryDateTimeRange from "@/components/query/Query/QueryDateTimeRange.vue";
import Ban from "@/components/table/BaseTable/Ban.vue";
import warehouseAddDialog from "./warehouseAddDialog.vue";
import warehouseEditorDialog from "./warehouseEditorDialog.vue";

import { useWarehouse } from "@/hooks/Warehouse/useWarehouse";

const {
  getAllWarehouses,
  WarehouseList,
  WarehouseQuery,
  total,
  managerOptions,
  handleBanWarehouse,
  resetQuery,
  createWarehouse,
  editWarehouse,
  loadManagerOptions,
} = useWarehouse();

// 时间范围
const createdDateRange = ref<[string, string] | null>(null);

// 监听时间范围变化
watch(createdDateRange, (val) => {
  if (val && val.length === 2) {
    WarehouseQuery.value.createdStartDate = val[0];
    WarehouseQuery.value.createdEndDate = val[1];
  } else {
    WarehouseQuery.value.createdStartDate = undefined;
    WarehouseQuery.value.createdEndDate = undefined;
  }
});

onMounted(async () => {
  await getAllWarehouses();
});

const indexBase = computed(
  () => (WarehouseQuery.value.pageNum! - 1) * WarehouseQuery.value.pageSize!
);

const handleReset = () => {
  createdDateRange.value = null;
  resetQuery();
};

const TableColumns: TableColumn[] = [
  { prop: "warehouseCode", label: "仓库编号", minWidth: 140 },
  { prop: "warehouseName", label: "仓库名称", minWidth: 180 },
  { prop: "specialistUserName", label: "仓库专员", minWidth: 120 },
  { prop: "phone", label: "联系电话", minWidth: 140 },
  { prop: "address", label: "地址", minWidth: 240 },
  { prop: "createdAt", label: "创建时间", minWidth: 180 },
  {
    prop: "status",
    label: "状态",
    width: 90,
    formatter: (_row, _column, value) => (value === 1 ? "启用" : "禁用"),
  },
];

// ============ 查询相关 ============
const handleQuery = () => {
  WarehouseQuery.value.pageNum = 1;
  getAllWarehouses();
};

// ============ 新增相关 ============
const addVisible = ref(false);
const openAdd = async () => {
  await loadManagerOptions();
  addVisible.value = true;
};

const handleAddSubmit = async (dto: WarehouseDto) => {
  await createWarehouse(dto);
  ElMessage.success("新增成功");
  addVisible.value = false;
};

// ============ 编辑相关 ============
const editVisible = ref(false);
const currentEditRow = ref<any>(null);

const openEdit = async (row: Record<string, unknown>) => {
  await loadManagerOptions(row.warehouseId as number);
  currentEditRow.value = { ...row };
  editVisible.value = true;
};

const handleEditSubmit = async (dto: WarehouseDto) => {
  await editWarehouse(dto);
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
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.query-row:last-child {
  margin-bottom: 0;
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

.query-control-sm {
  width: 150px;
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

