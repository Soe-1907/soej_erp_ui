<template>
  <BaseDialog
    v-model="visible"
    :title="dialogTitle"
    width="1180px"
    :confirmable="false"
    @close="handleClosed"
  >
    <template #dialogContent>
      <el-form v-loading="detailLoading" label-width="150px" @submit.prevent>
        <div v-if="isView" class="basic-info">
          <div class="info-item">
            <span class="info-label">销售退货单号：</span>
            <span class="info-value">{{ sourceMain?.returnCode || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">关联销售出库单号：</span>
            <span class="info-value">{{ form.salesOutboundCode || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">仓库名称：</span>
            <span class="info-value">{{ form.warehouseName || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">客户名称：</span>
            <span class="info-value">{{ form.customerName || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">审核状态：</span>
            <span class="info-value">{{ sourceMain?.auditStatusName || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">备注：</span>
            <span class="info-value">{{ headerRemark || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">发起人：</span>
            <span class="info-value">{{ sourceMain?.initiator || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">操作时间：</span>
            <span class="info-value">{{ formatDateTimeText(sourceMain?.operationTime) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">审核人：</span>
            <span class="info-value">{{ sourceMain?.auditor || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">审核时间：</span>
            <span class="info-value">{{ formatDateTimeText(sourceMain?.auditTime) }}</span>
          </div>
        </div>

        <div v-else class="header-row">
          <el-form-item label="关联销售出库单号" required>
            <el-input
              v-model="form.salesOutboundCode"
              placeholder="请输入关联销售出库单号"
              clearable
              style="width: 280px"
              @change="loadOutboundForReturn"
              @clear="clearOutbound"
            />
          </el-form-item>
          <el-form-item label="仓库名称">
            <el-input v-model="form.warehouseName" readonly placeholder="自动带入" style="width: 220px" />
          </el-form-item>
          <el-form-item label="客户名称">
            <el-input v-model="form.customerName" readonly placeholder="自动带入" style="width: 220px" />
          </el-form-item>
        </div>

        <el-form-item label="商品列表" :required="!isView">
          <div class="detail-block">
            <div v-if="!isView" class="detail-actions">
              <el-button type="danger" plain :icon="Delete" @click="onDeleteRows">批量删除</el-button>
            </div>

            <el-table
              :data="displayDetails"
              border
              empty-text="暂无数据"
              style="width: 100%"
              @selection-change="onSelectionChange"
            >
              <el-table-column v-if="!isView" type="selection" width="55" align="center" />
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column prop="productCode" label="商品编号" width="130" />
              <el-table-column prop="productName" label="商品名称" width="150" />
              <el-table-column prop="categoryName" label="商品分类" width="120" />
              <el-table-column prop="brandName" label="商品品牌" width="120" />
              <el-table-column prop="outboundQuantity" label="销售出库数量" width="130" />
              <el-table-column prop="uomName" label="商品单位" width="100" />
              <el-table-column label="实际销售价（元）" width="140">
                <template #default="{ row }">{{ formatMoney(row.actualPrice) }}</template>
              </el-table-column>
              <el-table-column label="销售结算金额（元）" width="160">
                <template #default="{ row }">{{ formatMoney(row.settlementAmount) }}</template>
              </el-table-column>
              <el-table-column
                v-if="showReturnableColumn"
                prop="returnableQuantity"
                label="可退数量"
                width="110"
              />
              <el-table-column label="销退数量" width="130">
                <template #default="{ row }">
                  <span v-if="isView">{{ row.returnQuantity ?? '-' }}</span>
                  <el-input
                    v-else
                    v-model="row.returnQuantity"
                    placeholder="请输入"
                    clearable
                    @input="(v: string) => onReturnQuantityInput(row, v)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="销退金额（元）" width="140">
                <template #default="{ row }">{{ formatMoney(row.returnItemAmount) }}</template>
              </el-table-column>
            </el-table>

            <div class="total-row">
              <span>合计：</span>
              <span>销售结算金额 {{ formatMoney(totalSettlementAmount) }}</span>
              <span class="total-amount">销退金额 {{ formatMoney(totalReturnAmount) }}</span>
            </div>
          </div>
        </el-form-item>

        <el-form-item v-if="showRecords" label="操作记录">
          <div class="record-block">
            <div v-if="recordLoading" class="record-empty">加载中...</div>
            <template v-else-if="records.length">
              <div v-for="(r, idx) in records" :key="`${r.recordId ?? idx}-${idx}`" class="record-item">
                <div class="record-line">
                  <span class="record-user">{{ r.operator || '-' }}</span>
                  <span class="record-action">{{ r.operationType || '-' }}</span>
                  <span v-if="r.rejectReason" class="record-remark">{{ r.rejectReason }}</span>
                </div>
                <div class="record-time">{{ formatDateTimeText(r.operationTime) }}</div>
              </div>
            </template>
            <div v-else class="record-empty">暂无操作记录</div>
          </div>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div v-if="!isView" class="dialog-footer">
        <el-button type="primary" @click="onSave">保存</el-button>
        <el-button v-if="props.mode === 'add'" type="primary" plain @click="onSaveAndNew">保存并新增</el-button>
        <el-button v-if="showSubmitInDialog" type="success" @click="onCommit">提交</el-button>
        <el-button @click="onFooterCancel">取消</el-button>
      </div>
      <div v-else class="dialog-footer">
        <el-button type="primary" @click="onFooterCancel">关闭</el-button>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import BaseDialog from '@/components/dialog/BaseDialog.vue'
import { useUserStore } from '@/stores/user'
import type {
  SalesReturnDetailDto,
  SalesReturnDetailLineViewVO,
  SalesReturnDetailViewVO,
  SalesReturnDto,
  SalesReturnPrefillLineVO,
  SalesReturnPrefillVO,
  SalesReturnRecordVO,
  SalesReturnVO,
} from '@/type/salesReturn'
import { getSalesReturnDetailViewApi, prefillSalesReturnLinesApi } from '@/api/product/salesReturn'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    mode?: 'add' | 'edit' | 'view'
    returnCode?: string
  }>(),
  { mode: 'add' }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'submit', dto: SalesReturnDto, opts?: { saveAndNew?: boolean }): void
  (e: 'commit', returnCode: string): void
}>()

interface DetailRow extends SalesReturnDetailDto {
  _key: number
}

const userStore = useUserStore()
const visible = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
const isView = computed(() => props.mode === 'view')
const isEdit = computed(() => props.mode === 'edit')
const showRecords = computed(() => isView.value || isEdit.value)
const showReturnableColumn = computed(() => !isView.value || sourceMain.value?.auditStatus !== 2)
const showSubmitInDialog = computed(
  () =>
    !isView.value &&
    isEdit.value &&
    !!sourceMain.value?.returnCode &&
    (sourceMain.value.auditStatus === 0 || sourceMain.value.auditStatus === 3)
)
const dialogTitle = computed(() => {
  if (isView.value) return '查看销售退货单'
  return isEdit.value ? '修改销售退货单' : '新增销售退货单'
})

const detailLoading = ref(false)
const recordLoading = ref(false)
const records = ref<SalesReturnRecordVO[]>([])
const sourceMain = ref<SalesReturnVO | null>(null)
const headerRemark = ref('')
const selectedRows = ref<DetailRow[]>([])
const details = ref<DetailRow[]>([])
let rowKeySeed = 0

const form = reactive({
  salesOutboundCode: '',
  warehouseCode: '',
  warehouseName: '',
  customerCode: '',
  customerName: '',
})

const displayDetails = computed(() => details.value)
const totalSettlementAmount = computed(() =>
  details.value.reduce((sum, row) => sum + toNumber(row.settlementAmount), 0)
)
const totalReturnAmount = computed(() =>
  details.value.reduce((sum, row) => sum + toNumber(row.returnItemAmount), 0)
)

function mapStatusLabel(auditStatus: number, desc: string) {
  if (auditStatus === 2) return '已完成'
  return desc || ''
}

function resetForm() {
  form.salesOutboundCode = ''
  form.warehouseCode = ''
  form.warehouseName = ''
  form.customerCode = ''
  form.customerName = ''
  details.value = []
  selectedRows.value = []
  records.value = []
  sourceMain.value = null
  headerRemark.value = ''
  rowKeySeed = 0
}

function resetAfterSaveAndNew() {
  resetForm()
}

defineExpose({ resetAfterSaveAndNew })

async function loadOutboundForReturn() {
  const code = form.salesOutboundCode.trim()
  if (!code) {
    clearOutbound()
    return
  }
  if (!userStore.userInfo?.userName) {
    ElMessage.warning('当前登录用户异常，请重新登录。')
    return
  }
  detailLoading.value = true
  try {
    const res = await prefillSalesReturnLinesApi(code)
    const data = (res as { data: SalesReturnPrefillVO }).data
    form.salesOutboundCode = data.refSalesOutboundCode ?? code
    form.warehouseCode = data.warehouseCode ?? ''
    form.warehouseName = data.warehouseName ?? ''
    form.customerCode = data.customerCode ?? ''
    form.customerName = data.customerName ?? ''
    details.value = (data.lines ?? []).map(prefillLineToDetailRow)
  } catch {
    clearOutbound(false)
  } finally {
    detailLoading.value = false
  }
}

function prefillLineToDetailRow(line: SalesReturnPrefillLineVO): DetailRow {
  const detail: DetailRow = {
    productCode: line.productCode,
    productName: line.productName,
    categoryName: line.categoryName,
    brandName: line.brandName,
    outboundQuantity: line.outboundQuantity != null ? String(line.outboundQuantity) : '',
    uomName: line.productUnit,
    actualPrice: line.actualSalePrice != null ? String(line.actualSalePrice) : '',
    settlementAmount: line.lineSettlementAmount != null ? String(line.lineSettlementAmount) : '',
    returnableQuantity: line.returnableQuantity != null ? String(line.returnableQuantity) : '',
    returnQuantity: '',
    returnItemAmount: '',
    _key: ++rowKeySeed,
  }
  recomputeReturnAmount(detail)
  return detail
}

function clearOutbound(clearCode = true) {
  if (clearCode) form.salesOutboundCode = ''
  form.warehouseCode = ''
  form.warehouseName = ''
  form.customerCode = ''
  form.customerName = ''
  details.value = []
  selectedRows.value = []
}

function lineViewToDetailRow(line: SalesReturnDetailLineViewVO): DetailRow {
  return {
    detailId: line.detailId,
    lineNo: line.lineNo,
    productCode: line.productCode,
    productName: line.productName,
    categoryName: line.categoryName,
    brandName: line.brandName,
    outboundQuantity: line.outboundQuantity != null ? String(line.outboundQuantity) : '',
    uomName: line.uomName,
    actualPrice: line.actualSalePrice != null ? String(line.actualSalePrice) : '',
    settlementAmount: line.lineSettlementAmount != null ? String(line.lineSettlementAmount) : '',
    returnableQuantity: line.returnableQuantity != null ? String(line.returnableQuantity) : '',
    returnQuantity: line.returnQuantity != null ? String(line.returnQuantity) : '',
    returnItemAmount: line.returnAmount != null ? String(line.returnAmount) : '',
    _key: ++rowKeySeed,
  }
}

function onSelectionChange(rows: DetailRow[]) {
  selectedRows.value = rows
}

function onDeleteRows() {
  if (!selectedRows.value.length) {
    ElMessage.warning('请先勾选要删除的行')
    return
  }
  const keys = new Set(selectedRows.value.map((row) => row._key))
  details.value = details.value.filter((row) => !keys.has(row._key))
  selectedRows.value = []
}

function onReturnQuantityInput(row: DetailRow, value: string) {
  row.returnQuantity = (value ?? '').replace(/[^\d]/g, '').slice(0, 8)
  recomputeReturnAmount(row)
}

function recomputeReturnAmount(row: DetailRow) {
  const quantity = toNumber(row.returnQuantity)
  const price = toNumber(row.actualPrice)
  row.returnItemAmount = quantity > 0 && price > 0 ? (quantity * price).toFixed(2) : ''
}

async function loadViewData(code: string) {
  detailLoading.value = true
  try {
    const res = await getSalesReturnDetailViewApi(code)
    const view = (res as { data: SalesReturnDetailViewVO }).data
    headerRemark.value = view.remark ?? ''
    sourceMain.value = {
      returnCode: view.salesReturnCode,
      salesOutboundCode: view.refSalesOutboundCode,
      warehouseCode: '',
      warehouseName: view.warehouseName ?? '',
      customerCode: '',
      customerName: view.customerName ?? '',
      returnKindAmount: view.lines?.length ?? 0,
      returnTotalAmount: Number(view.returnAmountSum ?? 0),
      auditStatus: view.auditStatus,
      auditStatusName: mapStatusLabel(view.auditStatus, view.auditStatusDesc ?? ''),
      initiator: view.initiatorName ?? '',
      operationTime: view.operationTime != null ? String(view.operationTime) : '',
      auditor: view.auditorName ?? '',
      auditTime: view.auditTime != null ? String(view.auditTime) : '',
    }
    form.salesOutboundCode = view.refSalesOutboundCode ?? ''
    form.warehouseName = view.warehouseName ?? ''
    form.customerName = view.customerName ?? ''
    details.value = (view.lines ?? []).map(lineViewToDetailRow)
    records.value = (view.operationLogs ?? []).map((log, idx) => ({
      recordId: idx,
      operationTime: log.operationTime != null ? String(log.operationTime) : '',
      operator: log.operatorName ?? '',
      operationType: log.operationTypeDesc ?? String(log.operationType ?? ''),
      rejectReason: log.remark,
    }))
  } catch {
    ElMessage.error('加载销售退货单失败')
    visible.value = false
  } finally {
    detailLoading.value = false
  }
}

watch(
  () => [visible.value, props.mode, props.returnCode] as const,
  async ([open, mode, code]) => {
    if (!open) return
    resetForm()
    await nextTick()
    if (mode === 'add') return
    if (!code) {
      ElMessage.error('缺少销售退货单号')
      visible.value = false
      return
    }
    await loadViewData(code)
  }
)

function validate(): boolean {
  if (!form.salesOutboundCode.trim()) {
    ElMessage.warning('关联销售出库单必填，请重新输入。')
    return false
  }
  if (!details.value.length) {
    ElMessage.warning('商品列表至少存在一行，请重新关联。')
    return false
  }
  const seen = new Set<string>()
  for (const row of details.value) {
    const key = row.productCode ?? ''
    if (seen.has(key)) {
      ElMessage.warning('商品重复，请重新关联。')
      return false
    }
    seen.add(key)
    const quantityText = String(row.returnQuantity ?? '').trim()
    if (!quantityText) {
      ElMessage.warning('销退数量必填，请重新输入。')
      return false
    }
    const quantity = Number(quantityText)
    if (!/^\d+$/.test(quantityText) || quantity <= 0 || quantity > toNumber(row.returnableQuantity)) {
      ElMessage.warning('销退数量输入有误，请重新输入。')
      return false
    }
  }
  return true
}

function buildSubmitDto(): SalesReturnDto {
  const detailsPayload: SalesReturnDetailDto[] = details.value.map((row) => ({
    productCode: row.productCode,
    returnQuantity: Number(row.returnQuantity),
  }))
  return {
    returnCode: sourceMain.value?.returnCode,
    salesOutboundCode: form.salesOutboundCode,
    warehouseCode: form.warehouseCode,
    warehouseName: form.warehouseName,
    customerCode: form.customerCode,
    customerName: form.customerName,
    details: detailsPayload,
  }
}

function onSave() {
  if (isView.value) return
  if (!validate()) return
  emit('submit', buildSubmitDto())
}

function onSaveAndNew() {
  if (isView.value) return
  if (!validate()) return
  emit('submit', buildSubmitDto(), { saveAndNew: true })
}

function onCommit() {
  const code = sourceMain.value?.returnCode ?? props.returnCode
  if (!code) {
    ElMessage.warning('请先保存单据后再提交')
    return
  }
  emit('commit', code)
}

function onFooterCancel() {
  visible.value = false
}

function handleClosed() {
  resetForm()
}

function formatMoney(value: number | string | undefined | null) {
  if (value === undefined || value === null || value === '') return '-'
  const n = Number(value)
  return Number.isNaN(n) ? '-' : n.toFixed(2)
}

function toNumber(value: number | string | undefined | null) {
  if (value === undefined || value === null || value === '') return 0
  const n = Number(value)
  return Number.isNaN(n) ? 0 : n
}

function formatDateTimeText(value: string | undefined) {
  if (!value) return '-'
  if (value.includes('T')) return value.replace('T', ' ').slice(0, 19)
  return value.length >= 19 ? value.slice(0, 19) : value
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.header-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 24px;
}
.basic-info {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  row-gap: 12px;
  column-gap: 36px;
  margin-bottom: 18px;
  font-size: 14px;
  color: #303133;
}
.info-item {
  display: flex;
  min-width: 0;
}
.info-label {
  flex: 0 0 150px;
  color: #606266;
  text-align: right;
}
.info-value {
  flex: 1;
  min-width: 0;
  word-break: break-all;
}
.detail-block {
  width: 100%;
}
.detail-actions {
  margin-bottom: 12px;
}
.total-row {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  color: #303133;
}
.total-amount {
  font-weight: 600;
  color: #f56c6c;
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
