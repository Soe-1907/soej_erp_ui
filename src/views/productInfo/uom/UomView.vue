<template>
  <div class="query-container">
    <div class="query-row">
      <QueryInput
        v-model="UomQuery.uomName"
        placeholder="请输入商品单位名称查询"
        style="width: 250px"
      />
      <div class="query-item">
        <span class="query-label">状态</span>
        <div class="query-control-sm">
          <QueryStatusSelect v-model="UomQuery.status" />
        </div>
      </div>
    </div>
  </div>

  <div class="button-container">
    <el-button type="primary" @click="getAllUoms">查询</el-button>
    <el-button @click="resetQuery">
      <el-icon class="el-icon--left"><RefreshLeft /></el-icon>
      重置
    </el-button>
    <el-button type="primary" plain @click="openAdd">
      <el-icon class="el-icon--left"><Plus /></el-icon>
      新增
    </el-button>
  </div>

  <BaseTable
    :data="UomList"
    :columns="TableColumns"
    :index-base="indexBase"
    :operation-width="220"
  >
    <template #operations="{ row }">
      <el-button type="primary" size="small" link @click="openEdit(row)">
        修改
      </el-button>

      <!-- 禁用/启用按钮 -->
      <Ban
        :status="row.status"
        title="商品单位"
        @confirm="(nextStatus) => handleBanUom(row, nextStatus)"
      />
    </template>
  </BaseTable>

  <!-- 分页区域 -->
  <div class="pagination-container">
    <Pagination
      v-model:pageNum="UomQuery.pageNum!"
      v-model:pageSize="UomQuery.pageSize!"
      :total="total"
      @change="getAllUoms"
    />
  </div>

  <!-- 对话框区域 -->
  <UomEditDialog 
    v-model="editVisible" 
    :data="currentEditRow" 
    @submit="handleEditSubmit" 
  />
  <UomAddDialog v-model="addVisible" @submit="handleAddSubmit" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Plus, RefreshLeft } from "@element-plus/icons-vue";
import type { TableColumn } from "@/type/table";
import type { UomDto } from "@/type/uom";

import BaseTable from "@/components/table/BaseTable/BaseTable.vue";
import Pagination from "@/layouts/components/Pagination.vue";
import QueryStatusSelect from "@/components/query/Query/QueryStatusSelect.vue";
import QueryInput from "@/components/query/Query/QueryInput.vue";
import Ban from "@/components/table/BaseTable/Ban.vue";
import UomAddDialog from "./UomAddDialog.vue";
import UomEditDialog from "./UomEditDialog.vue";

import { useUom } from "@/hooks/Uom/useUom";

const {
  getAllUoms,
  UomList,
  UomQuery,
  total,
  handleBanUom,
  resetQuery,
  createUom,
  editUom,
} = useUom();

onMounted(() => {
  getAllUoms();
});

const indexBase = computed(
  () => (UomQuery.value.pageNum! - 1) * UomQuery.value.pageSize!
);

const TableColumns: TableColumn[] = [
  { prop: "uomName", label: "单位名称", minWidth: 260 },
  {
    prop: "status",
    label: "状态",
    width: 110,
    formatter: (_row, _column, value) => (value === 1 ? "启用" : "禁用"),
  },
];

// ============ 新增相关 ============
const addVisible = ref(false);
const openAdd = () => {
  addVisible.value = true;
};

const handleAddSubmit = async (dto: UomDto) => {
  await createUom(dto);
  addVisible.value = false;
};

// ============ 编辑相关 ============
const editVisible = ref(false);
const currentEditRow = ref<any>(null);

const openEdit = (row: any) => {
  currentEditRow.value = { ...row }; // 深拷贝避免直接修改原数据
  editVisible.value = true;
};

const handleEditSubmit = async (row: any) => {
  await editUom(row);
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

.pagination-container {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>
