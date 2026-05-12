<template>
  <div class="query-block">
    <div class="query-container">
      <QueryInput v-model="query.billCodeKeyword" placeholder="请输入单据号查询" style="width: 220px" />
      <QueryInput
        v-model="query.warehouseKeyword"
        placeholder="请输入仓库编号/名称查询"
        :disabled="isWarehouseSpecialist"
        style="width: 220px"
      />
      <div class="query-item">
        <span class="query-label">业务类型</span>
        <el-select v-model="query.businessType" clearable placeholder="请选择" style="width: 150px">
          <el-option
            v-for="item in INBOUND_BUSINESS_TYPES"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>

    <div class="query-container">
      <div class="query-item">
        <span class="query-label">审核状态</span>
        <el-select v-model="query.auditStatus" clearable placeholder="请选择" style="width: 150px">
          <el-option
            v-for="item in AUDIT_STATUS_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <QueryInput
        v-model="query.initiatorNameKeyword"
        placeholder="请输入发起人查询"
        style="width: 200px"
      />
      <QueryInput
        v-model="query.auditorNameKeyword"
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
    <el-button plain :icon="RefreshRight" @click="handleReset">重置</el-button>
  </div>

  <el-table :data="list" style="width: 100%">
    <el-table-column type="index" label="序号" width="70" :index="indexMethod" />
    <el-table-column prop="billCode" label="单据号" min-width="170" />
    <el-table-column prop="warehouseCode" label="仓库编号" min-width="120" />
    <el-table-column prop="warehouseName" label="仓库名称" min-width="120" />
    <el-table-column prop="businessTypeDesc" label="业务类型" width="110" />
    <el-table-column prop="categoryKindCount" label="商品中类数" width="110" />
    <el-table-column prop="auditStatusDesc" label="审核状态" width="110" />
    <el-table-column prop="initiatorName" label="发起人" width="110" />
    <el-table-column label="操作时间" min-width="170">
      <template #default="{ row }">{{ formatDateTime(row.operationTime) }}</template>
    </el-table-column>
    <el-table-column label="审核人" width="110">
      <template #default="{ row }">{{ row.auditorName || '-' }}</template>
    </el-table-column>
    <el-table-column label="审核时间" min-width="170">
      <template #default="{ row }">{{ formatDateTime(row.auditTime) }}</template>
    </el-table-column>
    <el-table-column label="操作" width="120" fixed="right">
      <template #default="{ row }">
        <el-button type="primary" link size="small" @click="openView(row)">查看</el-button>
        <el-button
          v-if="canAuditRow(row)"
          type="primary"
          link
          size="small"
          @click="openAudit(row)"
        >
          审核
        </el-button>
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

  <el-dialog v-model="viewVisible" title="查看入库单据" width="980px">
    <div v-if="currentHeader" class="dialog-content">
      <div class="info-grid">
        <span>单据号：{{ currentHeader.billCode }}</span>
        <span>审核状态：{{ currentHeader.auditStatusDesc }}</span>
        <span>发起人：{{ currentHeader.initiatorName || '-' }}</span>
        <span>操作时间：{{ formatDateTime(currentHeader.operationTime) }}</span>
        <span>审核人：{{ currentHeader.auditorName || '-' }}</span>
        <span>审核时间：{{ formatDateTime(currentHeader.auditTime) }}</span>
      </div>

      <h4>商品列表</h4>
      <el-table :data="detailList" style="width: 100%">
        <el-table-column type="index" label="序号" width="70" />
        <el-table-column prop="productCode" label="商品编号" min-width="140" />
        <el-table-column prop="productName" label="商品名称" min-width="140" />
        <el-table-column prop="categoryName" label="商品分类" width="110" />
        <el-table-column prop="brandName" label="商品品牌" width="110" />
        <el-table-column prop="inboundQuantity" label="入库数量" width="110" />
        <el-table-column prop="uomName" label="商品单位" width="100" />
        <el-table-column v-if="isTransferDocument" prop="lineRemark" label="备注" min-width="120" />
      </el-table>

      <h4>操作记录</h4>
      <div class="record-block">
        <template v-if="recordList.length">
          <div
            v-for="(r, idx) in recordList"
            :key="`${r.operationTime ?? ''}-${idx}`"
            class="record-item"
          >
            <div class="record-line">
              <span class="record-user">{{ r.operatorName || '-' }}</span>
              <span class="record-action">{{ r.operationTypeDesc || '-' }}</span>
              <span v-if="r.remark" class="record-remark">{{ r.remark }}</span>
            </div>
            <div class="record-time">{{ formatDateTime(r.operationTime) }}</div>
          </div>
        </template>
        <div v-else class="record-empty">暂无操作记录</div>
      </div>
    </div>
  </el-dialog>

  <el-dialog v-model="auditVisible" title="审核入库单据" width="980px">
    <div v-if="currentHeader" class="dialog-content">
      <div class="info-grid compact">
        <span>单据号：{{ currentHeader.billCode }}</span>
        <span>发起人：{{ currentHeader.initiatorName || '-' }}</span>
      </div>

      <h4>商品列表</h4>
      <el-table :data="detailList" style="width: 100%">
        <el-table-column type="index" label="序号" width="70" />
        <el-table-column prop="productCode" label="商品编号" min-width="140" />
        <el-table-column prop="productName" label="商品名称" min-width="140" />
        <el-table-column prop="categoryName" label="商品分类" width="110" />
        <el-table-column prop="brandName" label="商品品牌" width="110" />
        <el-table-column prop="inboundQuantity" label="入库数量" width="110" />
        <el-table-column prop="uomName" label="商品单位" width="100" />
        <el-table-column v-if="isTransferDocument" prop="lineRemark" label="备注" min-width="120" />
      </el-table>

      <h4>操作记录</h4>
      <div class="record-block">
        <template v-if="recordList.length">
          <div
            v-for="(r, idx) in recordList"
            :key="`${r.operationTime ?? ''}-${idx}`"
            class="record-item"
          >
            <div class="record-line">
              <span class="record-user">{{ r.operatorName || '-' }}</span>
              <span class="record-action">{{ r.operationTypeDesc || '-' }}</span>
              <span v-if="r.remark" class="record-remark">{{ r.remark }}</span>
            </div>
            <div class="record-time">{{ formatDateTime(r.operationTime) }}</div>
          </div>
        </template>
        <div v-else class="record-empty">暂无操作记录</div>
      </div>
    </div>
    <template #footer>
      <el-button type="primary" @click="handleApprove">审核通过</el-button>
      <el-button type="primary" @click="rejectVisible = true">审核拒绝</el-button>
      <el-button @click="auditVisible = false">取消</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="rejectVisible" title="审核拒绝原因" width="520px">
    <el-form label-width="90px">
      <el-form-item label="拒绝原因" required>
        <el-input
          v-model="rejectReason"
          type="textarea"
          :rows="4"
          maxlength="160"
          show-word-limit
          placeholder="请输入拒绝原因"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleReject">确定拒绝</el-button>
      <el-button @click="rejectVisible = false">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { RefreshRight, Search } from '@element-plus/icons-vue'
import Pagination from '@/layouts/components/Pagination.vue'
import QueryDateTimeRange from '@/components/query/Query/QueryDateTimeRange.vue'
import QueryInput from '@/components/query/Query/QueryInput.vue'
import { ROLE_WAREHOUSE_SPECIALIST } from '@/constants/role'
import { useUserStore } from '@/stores/user'
import {
  AUDIT_STATUS_OPTIONS,
  INBOUND_BUSINESS_TYPES,
  type InboundAuditListItem,
} from '@/type/inventoryAudit'
import { useInventoryAudit } from '@/hooks/InventoryAudit/useInventoryAudit'

const userStore = useUserStore()
const {
  list,
  total,
  query,
  currentHeader,
  detailList,
  recordList,
  fetchList,
  fetchDocument,
  approveDocument,
  rejectDocument,
  resetQuery,
} = useInventoryAudit()

const operationTimeRange = ref<[string, string] | null>(null)
const auditTimeRange = ref<[string, string] | null>(null)
const viewVisible = ref(false)
const auditVisible = ref(false)
const rejectVisible = ref(false)
const rejectReason = ref('')

const roleCode = computed(() => userStore.userInfo?.roleCode)
const isWarehouseSpecialist = computed(() => roleCode.value === ROLE_WAREHOUSE_SPECIALIST)
const isTransferDocument = computed(() => currentHeader.value?.businessType === 3)

watch(operationTimeRange, (value) => {
  query.value.operationTimeStart = value?.[0]
  query.value.operationTimeEnd = value?.[1]
})

watch(auditTimeRange, (value) => {
  query.value.auditTimeStart = value?.[0]
  query.value.auditTimeEnd = value?.[1]
})

onMounted(async () => {
  await fetchList()
})

function indexMethod(index: number) {
  return ((query.value.pageNum ?? 1) - 1) * (query.value.pageSize ?? 10) + index + 1
}

async function handleQuery() {
  query.value.pageNum = 1
  await fetchList()
}

async function handleReset() {
  operationTimeRange.value = null
  auditTimeRange.value = null
  resetQuery()
  await fetchList()
}

function canAuditRow(row: InboundAuditListItem) {
  return isWarehouseSpecialist.value && row.auditStatus === 1
}

async function openView(row: InboundAuditListItem) {
  await fetchDocument(row.billCode)
  viewVisible.value = true
}

async function openAudit(row: InboundAuditListItem) {
  await fetchDocument(row.billCode)
  rejectReason.value = ''
  auditVisible.value = true
}

async function handleApprove() {
  if (!currentHeader.value) return
  await approveDocument(currentHeader.value.billCode)
  ElMessage.success('审核操作成功')
  auditVisible.value = false
}

async function handleReject() {
  const reason = rejectReason.value.trim()
  if (!reason) {
    ElMessage.warning('拒绝原因必填，请重新输入。')
    return
  }
  if (reason.length > 160) {
    ElMessage.warning('拒绝原因输入有误，请重新输入。')
    return
  }
  if (!currentHeader.value) return
  await rejectDocument(currentHeader.value.billCode, reason)
  ElMessage.success('审核操作成功')
  rejectVisible.value = false
  auditVisible.value = false
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

.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px 24px;
  font-size: 14px;
  color: #303133;
}

.info-grid.compact {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

h4 {
  margin: 8px 0 0;
  font-size: 14px;
  color: #303133;
}

.record-block {
  width: 100%;
  max-height: 180px;
  overflow-y: auto;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 8px 12px;
}

.record-item {
  padding: 6px 0;
  border-bottom: 1px dashed #ebeef5;
}

.record-item:last-child {
  border-bottom: none;
}

.record-line {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 13px;
  color: #303133;
}

.record-user,
.record-action {
  color: #303133;
}

.record-remark {
  color: #f56c6c;
}

.record-time {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}

.record-empty {
  color: #909399;
  font-size: 13px;
}
</style>
