<template>
  <div class="query-block">
    <div class="query-container">
      <QueryInput v-model="query.returnCode" placeholder="请输入单据编号查询" style="width: 220px" />
      <QueryInput
        v-model="query.salesOutboundCode"
        placeholder="请输入关联销售出库单号查询"
        style="width: 240px"
      />
      <QueryInput v-model="query.warehouseKeyword" placeholder="请输入仓库编号/名称查询" style="width: 220px" />
      <QueryInput v-model="query.customerKeyword" placeholder="请输入客户编号/名称查询" style="width: 220px" />
    </div>
    <div class="query-container">
      <div class="query-item">
        <span class="query-label">审核状态</span>
        <el-select v-model="query.auditStatus" clearable placeholder="请选择" style="width: 150px">
          <el-option
            v-for="item in auditStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <QueryInput
        v-model="query.initiator"
        placeholder="请输入发起人查询"
        :disabled="isSalesSpecialist"
        style="width: 200px"
      />
      <QueryInput v-model="query.auditor" placeholder="请输入审核人查询" style="width: 200px" />
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

  <SalesReturnDialog
    ref="addDialogRef"
    v-model="addVisible"
    mode="add"
    @submit="handleAddSubmit"
  />
  <SalesReturnDialog
    v-model="editVisible"
    mode="edit"
    :return-code="editingCode"
    @submit="handleEditSubmit"
    @commit="handleEditCommit"
  />
  <SalesReturnDialog v-model="viewVisible" mode="view" :return-code="viewingCode" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, RefreshRight, Search } from '@element-plus/icons-vue'
import type { TableColumn } from '@/type/table'
import BasePagination from '@/components/page/BasePagination.vue'
import BaseTable from '@/components/table/BaseTable/BaseTable.vue'
import QueryDateTimeRange from '@/components/query/Query/QueryDateTimeRange.vue'
import QueryInput from '@/components/query/Query/QueryInput.vue'
import { useUserStore } from '@/stores/user'
import { ROLE_SALES_SPECIALIST } from '@/constants/role'
import type { SalesReturnDto, SalesReturnVO } from '@/type/salesReturn'
import { useSalesReturn } from '@/hooks/SalesReturn/useSalesReturn'
import SalesReturnDialog from './salesReturnDialog.vue'

const addDialogRef = ref<InstanceType<typeof SalesReturnDialog> | null>(null)

const userStore = useUserStore()
const {
  list,
  total,
  query,
  fetchList,
  resetQuery,
  createSalesReturn,
  editSalesReturn,
  submitSalesReturn,
  deleteSalesReturn,
} = useSalesReturn()

const addVisible = ref(false)
const editVisible = ref(false)
const viewVisible = ref(false)
const editingCode = ref('')
const viewingCode = ref('')
const operationTimeRange = ref<[string, string] | null>(null)
const auditTimeRange = ref<[string, string] | null>(null)

const roleCode = computed(() => userStore.userInfo?.roleCode)
const userName = computed(() => userStore.userInfo?.userName)
const isSalesSpecialist = computed(() => roleCode.value === ROLE_SALES_SPECIALIST)
const canAdd = computed(() => isSalesSpecialist.value)
const operationWidth = computed(() => (isSalesSpecialist.value ? 260 : 100))

const auditStatusOptions = [
  { value: 0, label: '待提交' },
  { value: 1, label: '待审核' },
  { value: 2, label: '已完成' },
  { value: 3, label: '审核拒绝' },
]

watch(operationTimeRange, (value) => {
  query.value.operationTimeStart = value?.[0]
  query.value.operationTimeEnd = value?.[1]
})

watch(auditTimeRange, (value) => {
  query.value.auditTimeStart = value?.[0]
  query.value.auditTimeEnd = value?.[1]
})

const tableColumns = computed<TableColumn[]>(() => [
  { prop: 'returnCode', label: '销售退货单号', minWidth: 190 },
  { prop: 'warehouseCode', label: '仓库编号', minWidth: 130 },
  { prop: 'warehouseName', label: '仓库名称', minWidth: 160 },
  { prop: 'customerCode', label: '客户编号', minWidth: 130 },
  { prop: 'customerName', label: '客户名称', minWidth: 160 },
  { prop: 'returnKindAmount', label: '商品种类数', width: 110 },
  { prop: 'returnTotalAmount', label: '销退总金额', minWidth: 140, formatter: (_r, _c, v) => formatMoney(v) },
  { prop: 'salesOutboundCode', label: '关联销售出库单号', minWidth: 190 },
  { prop: 'auditStatusName', label: '审核状态', width: 110 },
  { prop: 'initiator', label: '发起人', width: 110 },
  { prop: 'operationTime', label: '操作时间', minWidth: 170, formatter: (_r, _c, v) => formatDateTime(v) },
  { prop: 'auditor', label: '审核人', width: 110, formatter: (_r, _c, v) => (v ? String(v) : '-') },
  { prop: 'auditTime', label: '审核时间', minWidth: 170, formatter: (_r, _c, v) => formatDateTime(v) },
])

onMounted(() => {
  applyIdentityQuery()
  fetchList()
})

function applyIdentityQuery() {
  if (isSalesSpecialist.value) {
    query.value.initiator = userName.value
  }
}

function canEditRow(row: SalesReturnVO) {
  return isSalesSpecialist.value && (row.auditStatus === 0 || row.auditStatus === 3)
}

function handleQuery() {
  applyIdentityQuery()
  query.value.pageNum = 1
  fetchList()
}

async function onReset() {
  operationTimeRange.value = null
  auditTimeRange.value = null
  await resetQuery()
  applyIdentityQuery()
  await fetchList()
}

function onAdd() {
  addVisible.value = true
}

async function handleAddSubmit(dto: SalesReturnDto, opts?: { saveAndNew?: boolean }) {
  if (!userName.value) {
    ElMessage.warning('当前登录用户异常，请重新登录。')
    return
  }
  await createSalesReturn(dto)
  ElMessage.success('新增成功')
  if (opts?.saveAndNew) {
    addDialogRef.value?.resetAfterSaveAndNew()
  } else {
    addVisible.value = false
  }
}

async function handleEditSubmit(dto: SalesReturnDto) {
  await editSalesReturn(dto)
  ElMessage.success('修改成功')
  editVisible.value = false
}

async function handleEditCommit(returnCode: string) {
  try {
    await ElMessageBox.confirm('请确认是否提交当前记录？', '提交销售退货单', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }
  await submitSalesReturn(returnCode)
  ElMessage.success('提交成功')
  editVisible.value = false
}

function onView(row: SalesReturnVO) {
  viewingCode.value = row.returnCode
  viewVisible.value = true
}

function onEdit(row: SalesReturnVO) {
  editingCode.value = row.returnCode
  editVisible.value = true
}

async function onSubmit(row: SalesReturnVO) {
  try {
    await ElMessageBox.confirm('请确认是否提交当前记录？', '提交销售退货单', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }
  await submitSalesReturn(row.returnCode)
  ElMessage.success('提交成功')
}

async function onDelete(row: SalesReturnVO) {
  try {
    await ElMessageBox.confirm('请确认是否删除当前记录？', '删除销售退货单', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }
  await deleteSalesReturn(row.returnCode)
  ElMessage.success('删除成功')
}

function formatDateTime(value: unknown) {
  if (value == null || value === '') return '-'
  const text = String(value)
  if (text.includes('T')) return text.replace('T', ' ').slice(0, 19)
  return text.length >= 19 ? text.slice(0, 19) : text
}

function formatMoney(value: unknown) {
  if (value == null || value === '') return '-'
  const n = Number(value)
  return Number.isNaN(n) ? '-' : n.toFixed(2)
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
