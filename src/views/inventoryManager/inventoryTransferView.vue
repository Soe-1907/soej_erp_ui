<template>
  <div class="query-block">
    <div class="query-container">
      <QueryInput
        v-model="query.transferCode"
        placeholder="请输入库存调拨单号查询"
        style="width: 240px"
      />
      <QueryInput
        v-model="query.fromWarehouseKeyword"
        placeholder="请输入调出仓库编号/名称查询"
        style="width: 250px"
      />
      <QueryInput
        v-model="query.toWarehouseKeyword"
        placeholder="请输入调入仓库编号/名称查询"
        style="width: 250px"
      />
      <div class="query-item">
        <span class="query-label">调拨状态</span>
        <el-select
          v-model="query.transferStatus"
          clearable
          placeholder="请选择"
          style="width: 150px"
        >
          <el-option
            v-for="item in TRANSFER_STATUS_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <div class="query-container">
      <QueryInput
        v-model="query.initiatorKeyword"
        placeholder="请输入发起人查询"
        style="width: 200px"
      />
      <QueryInput
        v-model="query.auditorKeyword"
        placeholder="请输入审核人查询"
        style="width: 200px"
      />
      <div class="query-item">
        <span class="query-label">操作时间</span>
        <QueryDateTimeRange v-model="operationTimeRange" />
      </div>
      <div class="query-item">
        <span class="query-label">审核时间</span>
        <QueryDateTimeRange v-model="auditTimeRange" />
      </div>
    </div>
  </div>

  <div class="button-container">
    <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
    <el-button plain :icon="RefreshRight" @click="onReset">重置</el-button>
    <el-button type="primary" plain :icon="Plus" @click="onAdd">新增</el-button>
  </div>

  <el-table :data="list" style="width: 100%">
    <el-table-column type="index" label="序号" width="70" :index="indexMethod" fixed />
    <el-table-column prop="transferCode" label="库存调拨单号" min-width="190" />
    <el-table-column prop="fromWarehouseName" label="调出仓库" min-width="140" />
    <el-table-column prop="toWarehouseName" label="调入仓库" min-width="140" />
    <el-table-column prop="transferStatusDesc" label="调拨状态" width="110" />
    <el-table-column prop="initiatorName" label="发起人" min-width="120" />
    <el-table-column label="操作时间" min-width="170">
      <template #default="{ row }">{{ formatDateTime(row.operationTime) }}</template>
    </el-table-column>
    <el-table-column label="审核人" min-width="160">
      <template #default="{ row }">{{ row.auditorsDisplay || '-' }}</template>
    </el-table-column>
    <el-table-column label="审核时间" min-width="170">
      <template #default="{ row }">{{ formatDateTime(row.auditTime) }}</template>
    </el-table-column>
    <el-table-column label="操作" width="210" fixed="right">
      <template #default="{ row }">
        <el-button v-if="canEditRow(row)" type="primary" link size="small" @click="onEdit(row)">
          修改
        </el-button>
        <el-button v-if="canEditRow(row)" type="primary" link size="small" @click="onSubmit(row)">
          提交
        </el-button>
        <el-button v-if="canEditRow(row)" type="primary" link size="small" @click="onDelete(row)">
          删除
        </el-button>
        <el-button type="primary" link size="small" @click="onView(row)">查看</el-button>
      </template>
    </el-table-column>
  </el-table>

  <Pagination
    v-model:pageNum="query.pageNum!"
    v-model:pageSize="query.pageSize!"
    :total="total"
    :page-sizes="[10, 20, 30, 50]"
    @change="fetchList"
  />

  <InventoryTransferDialog v-model="addVisible" mode="add" @submit="handleAddSubmit" />
  <InventoryTransferDialog
    v-model="editVisible"
    mode="edit"
    :transfer-code="editingCode"
    @submit="handleEditSubmit"
  />
  <InventoryTransferDialog v-model="viewVisible" mode="view" :transfer-code="viewingCode" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, RefreshRight, Search } from '@element-plus/icons-vue'
import Pagination from '@/layouts/components/Pagination.vue'
import QueryDateTimeRange from '@/components/query/Query/QueryDateTimeRange.vue'
import QueryInput from '@/components/query/Query/QueryInput.vue'
import {
  TRANSFER_STATUS_OPTIONS,
  isTransferEditable,
  type InventoryTransferDto,
  type InventoryTransferListItem,
} from '@/type/inventoryTransfer'
import { useInventoryTransfer } from '@/hooks/InventoryTransfer/useInventoryTransfer'
import InventoryTransferDialog from './inventoryTransferDialog.vue'

const {
  list,
  total,
  query,
  fetchList,
  resetQuery,
  createInventoryTransfer,
  editInventoryTransfer,
  commitInventoryTransfer,
  deleteInventoryTransfer,
} = useInventoryTransfer()

const addVisible = ref(false)
const editVisible = ref(false)
const viewVisible = ref(false)
const editingCode = ref('')
const viewingCode = ref('')
const operationTimeRange = ref<[string, string] | null>(null)
const auditTimeRange = ref<[string, string] | null>(null)

watch(operationTimeRange, (value) => {
  query.value.operationTimeStart = value?.[0]
  query.value.operationTimeEnd = value?.[1]
})

watch(auditTimeRange, (value) => {
  query.value.auditTimeStart = value?.[0]
  query.value.auditTimeEnd = value?.[1]
})

onMounted(() => {
  fetchList()
})

function indexMethod(index: number) {
  return ((query.value.pageNum ?? 1) - 1) * (query.value.pageSize ?? 10) + index + 1
}

function canEditRow(row: InventoryTransferListItem) {
  return isTransferEditable(row.transferStatus)
}

async function handleQuery() {
  query.value.pageNum = 1
  await fetchList()
}

async function onReset() {
  operationTimeRange.value = null
  auditTimeRange.value = null
  resetQuery()
  await fetchList()
}

function onAdd() {
  addVisible.value = true
}

function onEdit(row: InventoryTransferListItem) {
  editingCode.value = row.transferCode
  editVisible.value = true
}

function onView(row: InventoryTransferListItem) {
  viewingCode.value = row.transferCode
  viewVisible.value = true
}

async function handleAddSubmit(dto: InventoryTransferDto) {
  await createInventoryTransfer(dto)
  ElMessage.success('新增成功')
  addVisible.value = false
}

async function handleEditSubmit(dto: InventoryTransferDto) {
  await editInventoryTransfer(dto)
  ElMessage.success('修改成功')
  editVisible.value = false
}

async function onSubmit(row: InventoryTransferListItem) {
  try {
    await ElMessageBox.confirm('请确认是否提交当前记录？', '提交库存调拨单', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }
  await commitInventoryTransfer(row.transferCode)
  ElMessage.success('提交成功')
}

async function onDelete(row: InventoryTransferListItem) {
  try {
    await ElMessageBox.confirm('请确认是否删除当前记录？', '删除库存调拨单', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }
  await deleteInventoryTransfer(row.transferCode)
  ElMessage.success('删除成功')
}

function formatDateTime(value: unknown) {
  if (value == null || value === '') return '-'
  const text = String(value)
  if (text.includes('T')) return text.replace('T', ' ').slice(0, 19)
  return text.length >= 19 ? text.slice(0, 19) : text
}
</script>

<style scoped>
.query-block {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 8px;
}
.query-container {
  margin-bottom: 16px;
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
.button-container {
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
}
</style>
