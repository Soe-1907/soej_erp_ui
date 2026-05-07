<template>
  <div class="query-block">
    <div class="query-container">
      <span class="query-label">采购入库单号</span>
      <QueryInput
        v-model="query.purchaseReceiveCode"
        placeholder="请输入采购入库单号查询"
        style="width: 220px"
      />
      <span class="query-label">仓库</span>
      <QueryInput
        v-model="query.warehouseKeyword"
        placeholder="请输入仓库编号/名称查询"
        style="width: 220px"
      />
      <span class="query-label">供应商</span>
      <QueryInput
        v-model="query.supplierKeyword"
        placeholder="请输入供应商编号/名称查询"
        style="width: 220px"
      />
    </div>
    <div class="query-container">
      <div class="query-item">
        <span class="query-label">审核状态</span>
        <el-select
          v-model="query.auditStatus"
          clearable
          placeholder="请选择"
          style="width: 150px"
        >
          <el-option
            v-for="o in auditStatusOptions"
            :key="o.value"
            :label="o.label"
            :value="o.value"
          />
        </el-select>
      </div>
      <span class="query-label">发起人</span>
      <QueryInput
        v-model="query.initiator"
        placeholder="请输入发起人查询"
        :disabled="isSpecialist"
        style="width: 200px"
      />
      <span class="query-label">审核人</span>
      <QueryInput
        v-model="query.auditor"
        placeholder="请输入审核人查询"
        style="width: 200px"
      />
    </div>
    <div class="query-container">
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
    <el-button v-if="canAdd" type="primary" plain :icon="Plus" @click="onAdd">新增</el-button>
  </div>

  <BaseTable
    :data="list"
    :columns="tableColumns"
    :index-base="(query.pageNum! - 1) * query.pageSize!"
    :operation-width="operationWidth"
  >
    <template #operations="{ row }">
      <el-button v-if="canEditRow(row)" type="primary" link size="small" @click="onEdit(row)">修改</el-button>
      <el-button type="primary" link size="small" @click="onView(row)">查看</el-button>
      <el-button v-if="canEditRow(row)" type="primary" link size="small" @click="onSubmit(row)">提交</el-button>
      <el-button v-if="canEditRow(row)" type="primary" link size="small" @click="onDelete(row)">删除</el-button>
    </template>
  </BaseTable>

  <BasePagination
    v-model:pageNum="query.pageNum!"
    v-model:pageSize="query.pageSize!"
    :total="total"
    @change="fetchList"
  />

  <PurchaseReceiveAddDialog v-model="addVisible" mode="add" @submit="handleAddSubmit" />
  <PurchaseReceiveAddDialog
    v-model="editVisible"
    mode="edit"
    :purchase-receive-code="editingCode"
    @submit="handleEditSubmit"
  />
  <PurchaseReceiveAddDialog
    v-model="viewVisible"
    mode="view"
    :purchase-receive-code="viewingCode"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, RefreshRight, Plus } from '@element-plus/icons-vue'
import type { TableColumn } from '@/type/table'
import type { PurchaseReceiveDto, PurchaseReceiveVO } from '@/type/purchaseReceive'
import BaseTable from '@/components/table/BaseTable/BaseTable.vue'
import BasePagination from '@/components/page/BasePagination.vue'
import QueryInput from '@/components/query/Query/QueryInput.vue'
import QueryDateTimeRange from '@/components/query/Query/QueryDateTimeRange.vue'
import PurchaseReceiveAddDialog from './purchaseReceiveAddDialog.vue'
import { useUserStore } from '@/stores/user'
import { usePurchaseReceive } from '@/hooks/PurchaseReceive/usePurchaseReceive'
import { ROLE_PURCHASE_SPECIALIST } from '@/constants/role'

const userStore = useUserStore()
const {
  list,
  total,
  query,
  fetchList,
  resetQuery,
  createPurchaseReceive,
  editPurchaseReceive,
  submitPurchaseReceive,
  deletePurchaseReceive,
} = usePurchaseReceive()

const addVisible = ref(false)
const editVisible = ref(false)
const viewVisible = ref(false)
const editingCode = ref('')
const viewingCode = ref('')

const roleCode = computed(() => userStore.userInfo?.roleCode)

const isSpecialist = computed(() => roleCode.value === ROLE_PURCHASE_SPECIALIST)

/** 仅采购专员可新增 */
const canAdd = computed(() => isSpecialist.value)

const operationWidth = computed(() => (isSpecialist.value ? 280 : 100))

/**
 * 采购专员 +（待提交 | 审核拒绝）可修改/提交/删除；
 * 采购主管及其他角色：仅查看
 */
function canEditRow(row: PurchaseReceiveVO) {
  if (!isSpecialist.value) return false
  const s = row.auditStatus
  return s === 0 || s === 3
}

/** 数据级权限：采购专员仅能查看自己发起的数据 */
function applySelfInitiatorIfSpecialist() {
  if (isSpecialist.value) {
    query.value.initiator = userStore.userInfo?.userName
  }
}

const auditStatusOptions = [
  { value: 0, label: '待提交' },
  { value: 1, label: '待审核' },
  { value: 2, label: '审核通过' },
  { value: 3, label: '审核拒绝' },
]

const operationTimeRange = ref<[string, string] | null>(null)
const auditTimeRange = ref<[string, string] | null>(null)

watch(operationTimeRange, (val) => {
  if (val && val.length === 2) {
    query.value.operationTimeStart = val[0]
    query.value.operationTimeEnd = val[1]
  } else {
    query.value.operationTimeStart = undefined
    query.value.operationTimeEnd = undefined
  }
})

watch(auditTimeRange, (val) => {
  if (val && val.length === 2) {
    query.value.auditTimeStart = val[0]
    query.value.auditTimeEnd = val[1]
  } else {
    query.value.auditTimeStart = undefined
    query.value.auditTimeEnd = undefined
  }
})

function formatDateTime(_row: unknown, _col: unknown, cell: unknown) {
  if (cell == null || cell === '') return '-'
  const s = String(cell)
  if (s.includes('T')) return s.replace('T', ' ').slice(0, 19)
  return s.length >= 19 ? s.slice(0, 19) : s
}

const tableColumns = computed<TableColumn[]>(() => [
  { prop: 'purchaseReceiveCode', label: '采购入库单号', minWidth: 190 },
  { prop: 'warehouseCode', label: '仓库编号', minWidth: 130 },
  { prop: 'warehouseName', label: '仓库名称', minWidth: 160 },
  { prop: 'supplierCode', label: '供应商编号', minWidth: 130 },
  { prop: 'supplierName', label: '供应商名称', minWidth: 160 },
  { prop: 'purchaseKindAmount', label: '商品种类数', width: 110 },
  {
    prop: 'purchaseAmount',
    label: '采购结算总金额',
    minWidth: 140,
    formatter: (_r, _c, v) => (v != null && v !== '' ? Number(v).toFixed(2) : '-'),
  },
  { prop: 'auditStatusName', label: '审核状态', width: 110 },
  { prop: 'initiator', label: '发起人', width: 110 },
  { prop: 'operationTime', label: '操作时间', minWidth: 170, formatter: formatDateTime },
  { prop: 'auditor', label: '审核人', width: 110, formatter: (_r, _c, v) => (v != null && v !== '' ? String(v) : '-') },
  { prop: 'auditTime', label: '审核时间', minWidth: 170, formatter: formatDateTime },
])

onMounted(() => {
  applySelfInitiatorIfSpecialist()
  fetchList()
})

const handleQuery = () => {
  applySelfInitiatorIfSpecialist()
  query.value.pageNum = 1
  fetchList()
}

const onReset = async () => {
  operationTimeRange.value = null
  auditTimeRange.value = null
  await resetQuery()
  if (isSpecialist.value) {
    applySelfInitiatorIfSpecialist()
    await fetchList()
  }
}

const onAdd = () => {
  addVisible.value = true
}

const handleAddSubmit = async (dto: PurchaseReceiveDto) => {
  await createPurchaseReceive(dto)
  ElMessage.success('新增成功')
  addVisible.value = false
}

const handleEditSubmit = async (dto: PurchaseReceiveDto) => {
  await editPurchaseReceive(dto)
  ElMessage.success('修改成功')
  editVisible.value = false
}

const onView = (row: PurchaseReceiveVO) => {
  viewingCode.value = row.purchaseReceiveCode
  viewVisible.value = true
}
const onEdit = (row: PurchaseReceiveVO) => {
  editingCode.value = row.purchaseReceiveCode
  editVisible.value = true
}
const onSubmit = async (row: PurchaseReceiveVO) => {
  try {
    await ElMessageBox.confirm(
      '请确认是否提交当前记录？',
      '提交采购入库单',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
  } catch {
    return
  }

  await submitPurchaseReceive(row.purchaseReceiveCode)
  ElMessage.success('提交成功')
}
const onDelete = async (row: PurchaseReceiveVO) => {
  try {
    await ElMessageBox.confirm(
      '请确认是否删除当前记录？',
      '删除采购入库单',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
  } catch {
    return
  }

  await deletePurchaseReceive(row.purchaseReceiveCode)
  ElMessage.success('删除成功')
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
