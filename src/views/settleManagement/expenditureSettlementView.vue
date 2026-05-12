<template>
  <div class="query-block">
    <div class="query-container">
      <QueryInput
        v-model="query.expenditureSettlementCode"
        placeholder="请输入支出结算单号查询"
        style="width: 240px"
      />
      <div class="query-item">
        <span class="query-label">单据类型</span>
        <el-select v-model="query.bizType" clearable placeholder="请选择" style="width: 150px">
          <el-option
            v-for="item in bizTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
  </div>

  <div class="button-container">
    <el-button type="primary" :icon="Search" @click="handleQuery">查询</el-button>
    <el-button plain :icon="RefreshRight" @click="onReset">重置</el-button>
  </div>

  <BaseTable
    :data="list"
    :columns="tableColumns"
    :index-base="(query.pageNum! - 1) * query.pageSize!"
    :operation-width="100"
  >
    <template #operations="{ row }">
      <el-button type="primary" link size="small" @click="onView(row)">查看</el-button>
    </template>
  </BaseTable>

  <Pagination
    v-model:pageNum="query.pageNum!"
    v-model:pageSize="query.pageSize!"
    :total="total"
    @change="fetchList"
  />

  <ExpenditureSettlementDialog
    v-model="viewVisible"
    :settlement="selectedSettlement"
    @view-detail="onViewRelatedDetail"
  />
  <PurchaseReceiveAddDialog
    v-model="purchaseReceiveVisible"
    mode="view"
    :purchase-receive-code="selectedRelatedCode"
    :expenditure-settlement-code="purchaseDetailSettlementCode"
  />
  <SalesReturnDialog
    v-model="salesReturnVisible"
    mode="view"
    :return-code="selectedRelatedCode"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { RefreshRight, Search } from '@element-plus/icons-vue'
import type { TableColumn } from '@/type/table'
import type { ExpenditureSettlementVO } from '@/type/expenditureSettlement'
import Pagination from '@/layouts/components/Pagination.vue'
import BaseTable from '@/components/table/BaseTable/BaseTable.vue'
import QueryInput from '@/components/query/Query/QueryInput.vue'
import { useExpenditureSettlement } from '@/hooks/ExpenditureSettlement/useExpenditureSettlement'
import PurchaseReceiveAddDialog from '@/views/purchase/purchaseReceiveAddDialog.vue'
import SalesReturnDialog from '@/views/salesManagement/salesReturnDialog.vue'
import ExpenditureSettlementDialog from './expenditureSettlementDialog.vue'

const SOURCE_TYPE_PURCHASE_RECEIVE = 3
const SOURCE_TYPE_SALES_RETURN = 4
const SOURCE_TYPE_OTHER = 5

const { list, total, query, fetchList, resetQuery, getExpenditureSettlement } =
  useExpenditureSettlement()

const viewVisible = ref(false)
const purchaseReceiveVisible = ref(false)
const salesReturnVisible = ref(false)
const selectedSettlement = ref<ExpenditureSettlementVO | null>(null)
const selectedRelatedCode = ref('')
/** 打开采购入库查看弹窗时传入，用于 related-bill 接口（结算角色免采购数据权限） */
const purchaseDetailSettlementCode = ref('')

const bizTypeOptions = [
  { value: 1, label: '采入支出' },
  { value: 2, label: '销退支出' },
  { value: 3, label: '其他支出' },
]

const tableColumns = computed<TableColumn[]>(() => [
  { prop: 'expenditureSettlementCode', label: '支出结算单号', minWidth: 200 },
  { prop: 'bizTypeName', label: '单据类型', width: 120 },
  { prop: 'amount', label: '金额（元）', minWidth: 130, formatter: (_r, _c, v) => formatMoney(v) },
  { prop: 'relatedBillCode', label: '关联单据号', minWidth: 200, formatter: (_r, _c, v) => (v ? String(v) : '-') },
  {
    prop: 'createTime',
    label: '创建时间',
    minWidth: 170,
    formatter: (_r, _c, v) => formatDateTime(v),
  },
])

onMounted(() => {
  fetchList()
})

function handleQuery() {
  query.value.pageNum = 1
  fetchList()
}

async function onReset() {
  resetQuery()
  await fetchList()
}

async function onView(row: ExpenditureSettlementVO) {
  try {
    const detail = await getExpenditureSettlement(row.expenditureSettlementCode)
    if (!detail) {
      ElMessage.warning('未获取到支出结算详情')
      return
    }
    selectedSettlement.value = detail
    viewVisible.value = true
  } catch {
    /* request 拦截器已提示 */
  }
}

function onViewRelatedDetail() {
  const settlement = selectedSettlement.value
  if (!settlement || settlement.sourceType === SOURCE_TYPE_OTHER) {
    ElMessage.warning('其他支出无关联单据详情')
    return
  }
  if (!settlement.relatedBillCode) {
    ElMessage.warning('缺少关联单据号')
    return
  }

  purchaseDetailSettlementCode.value = ''
  selectedRelatedCode.value = settlement.relatedBillCode
  if (settlement.sourceType === SOURCE_TYPE_PURCHASE_RECEIVE) {
    purchaseDetailSettlementCode.value = settlement.expenditureSettlementCode
    purchaseReceiveVisible.value = true
    return
  }
  if (settlement.sourceType === SOURCE_TYPE_SALES_RETURN) {
    salesReturnVisible.value = true
    return
  }
  ElMessage.warning('未知的关联单据类型')
}

function formatMoney(value: unknown) {
  if (value == null || value === '') return '-'
  const n = Number(value)
  return Number.isNaN(n) ? '-' : n.toFixed(2)
}

/** 与项目约定一致：YYYY-MM-DD HH:mm:ss */
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
