<template>
  <div class="query-block">
    <div class="query-container">
      <QueryInput
        v-model="query.incomeSettlementCode"
        placeholder="请输入收入结算单号查询"
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

  <IncomeSettlementDialog
    v-model="viewVisible"
    :settlement="selectedSettlement"
    @view-detail="onViewRelatedDetail"
  />
  <SalesOutboundDialog
    v-model="salesOutboundVisible"
    mode="view"
    :outbound-code="selectedRelatedCode"
  />
  <PurchaseReturnDialog
    v-model="purchaseReturnVisible"
    mode="view"
    :return-code="selectedRelatedCode"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { RefreshRight, Search } from '@element-plus/icons-vue'
import type { TableColumn } from '@/type/table'
import type { IncomeSettlementVO } from '@/type/incomeSettlement'
import Pagination from '@/layouts/components/Pagination.vue'
import BaseTable from '@/components/table/BaseTable/BaseTable.vue'
import QueryInput from '@/components/query/Query/QueryInput.vue'
import { useIncomeSettlement } from '@/hooks/IncomeSettlement/useIncomeSettlement'
import SalesOutboundDialog from '@/views/salesManagement/salesOutboundDialog.vue'
import PurchaseReturnDialog from '@/views/purchase/purchaseReturnDialog.vue'
import IncomeSettlementDialog from './incomeSettlementDialog.vue'

const SOURCE_TYPE_SALES_OUTBOUND = 1
const SOURCE_TYPE_PURCHASE_RETURN = 2

const { list, total, query, fetchList, resetQuery, getIncomeSettlement } = useIncomeSettlement()

const viewVisible = ref(false)
const salesOutboundVisible = ref(false)
const purchaseReturnVisible = ref(false)
const selectedSettlement = ref<IncomeSettlementVO | null>(null)
const selectedRelatedCode = ref('')

const bizTypeOptions = [
  { value: 1, label: '销出收入' },
  { value: 2, label: '采退收入' },
]

const tableColumns = computed<TableColumn[]>(() => [
  { prop: 'incomeSettlementCode', label: '收入结算单号', minWidth: 200 },
  { prop: 'bizTypeName', label: '单据类型', width: 120 },
  { prop: 'amount', label: '金额（元）', minWidth: 130, formatter: (_r, _c, v) => formatMoney(v) },
  { prop: 'relatedBillCode', label: '关联单据号', minWidth: 200 },
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

async function onView(row: IncomeSettlementVO) {
  try {
    const detail = await getIncomeSettlement(row.incomeSettlementCode)
    if (!detail) {
      ElMessage.warning('未获取到收入结算详情')
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
  if (!settlement?.relatedBillCode) {
    ElMessage.warning('缺少关联单据号')
    return
  }

  selectedRelatedCode.value = settlement.relatedBillCode
  if (settlement.sourceType === SOURCE_TYPE_SALES_OUTBOUND) {
    salesOutboundVisible.value = true
    return
  }
  if (settlement.sourceType === SOURCE_TYPE_PURCHASE_RETURN) {
    purchaseReturnVisible.value = true
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
