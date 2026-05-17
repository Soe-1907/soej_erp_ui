<template>
  <div class="query-container">
    <div class="query-row">
      <QueryInput
        v-model="CustomerQuery.keyword"
        placeholder="请输入客户编号或名称查询"
        style="width: 250px"
      />

      <div class="query-item">
        <span class="query-label">状态</span>
        <div class="query-control-sm">
          <QueryStatusSelect v-model="CustomerQuery.status" />
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
    <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
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
    :data="CustomerList"
    :columns="TableColumns"
    :index-base="indexBase"
    :operation-width="240"
    operation-align="center"
  >
    <template #operations="{ row }">
      <div class="operation-actions">
        <!-- 查看按钮 -->
        <el-button type="primary" link size="small" @click="openDetail(row)">
          查看
        </el-button>

        <!-- 编辑按钮 -->
        <el-button type="primary" link size="small" @click="openEdit(row)">
          修改
        </el-button>

        <!-- 禁用/启用按钮 -->
        <Ban
          :status="row.status"
          title="客户信息"
          @confirm="(nextStatus) => handleBanCustomer(row, nextStatus)"
        />
      </div>
    </template>
  </BaseTable>

  <!-- 分页区域 -->
  <div class="pagination-container">
    <Pagination
      v-model:pageNum="CustomerQuery.pageNum!"
      v-model:pageSize="CustomerQuery.pageSize!"
      :total="total"
      @change="getAllCustomers"
    />
  </div>

  <!-- 对话框区域 -->
  <customerDetailDialog
    v-model="detailVisible"
    :data="currentDetailRow"
  />
  <customerEditorDialog
    v-model="editVisible"
    :data="currentEditRow"
    @submit="handleEditSubmit"
  />
  <customerAddDialog
    v-model="addVisible"
    @submit="handleAddSubmit"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { Plus, RefreshLeft, Search } from "@element-plus/icons-vue";
import type { TableColumn } from "@/type/table";
import type { CustomerDto } from "@/type/customer";

import BaseTable from "@/components/table/BaseTable/BaseTable.vue";
import Pagination from "@/layouts/components/Pagination.vue";
import QueryStatusSelect from "@/components/query/Query/QueryStatusSelect.vue";
import QueryInput from "@/components/query/Query/QueryInput.vue";
import QueryDateTimeRange from "@/components/query/Query/QueryDateTimeRange.vue";
import Ban from "@/components/table/BaseTable/Ban.vue";
import customerAddDialog from "./customerAddDialog.vue";
import customerEditorDialog from "./customerEditorDialog.vue";
import customerDetailDialog from "./customerDetailDialog.vue";

import { useCustomer } from "@/hooks/Customer/useCustomer";

const {
  getAllCustomers,
  CustomerList,
  CustomerQuery,
  total,
  handleBanCustomer,
  resetQuery,
  createCustomer,
  editCustomer,
} = useCustomer();

// 时间范围
const createdDateRange = ref<[string, string] | null>(null);

// 监听时间范围变化
watch(createdDateRange, (val) => {
  if (val && val.length === 2) {
    CustomerQuery.value.createdStartDate = val[0];
    CustomerQuery.value.createdEndDate = val[1];
  } else {
    CustomerQuery.value.createdStartDate = undefined;
    CustomerQuery.value.createdEndDate = undefined;
  }
});

onMounted(() => {
  getAllCustomers();
});

const indexBase = computed(
  () => (CustomerQuery.value.pageNum! - 1) * CustomerQuery.value.pageSize!
);

const handleReset = () => {
  createdDateRange.value = null;
  resetQuery();
};

const TableColumns: TableColumn[] = [
  { prop: "customerCode", label: "客户编号", minWidth: 160 },
  { prop: "customerName", label: "客户名称", minWidth: 180 },
  { prop: "createdAt", label: "创建时间", minWidth: 190 },
  {
    prop: "status",
    label: "状态",
    width: 110,
    statusButton: true,
  },
];

// ============ 查询相关 ============
const handleQuery = () => {
  CustomerQuery.value.pageNum = 1;
  getAllCustomers();
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

const handleAddSubmit = async (dto: CustomerDto) => {
  await createCustomer(dto);
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

const handleEditSubmit = async (dto: CustomerDto) => {
  await editCustomer(dto);
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

.operation-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.operation-actions :deep(.el-button) {
  margin-left: 0;
}

.pagination-container {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>

